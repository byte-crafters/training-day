import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import {
    validateInitDataAndGetUser,
    InitDataValidationError,
    MissingBotTokenError,
} from '../services/authService.js';

export class AuthController {
    /**
     * POST /api/auth/telegram
     * Принимает initData из заголовка, валидирует и создаёт/обновляет пользователя.
     */
    static async initTelegram(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'auth_initTelegram');
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('tma ')) {
                Sentry.logger.warn('Failed to init Telegram auth: missing or invalid Authorization header');
                return res.status(401).json({
                    error: 'Missing or invalid Authorization header. Expected format: "tma <initDataRaw>"',
                });
            }

            const initDataRaw = authHeader.substring(4);
            if (!initDataRaw) {
                Sentry.logger.warn('Failed to init Telegram auth: missing initDataRaw in Authorization header');
                return res.status(400).json({ error: 'Missing initDataRaw in Authorization header' });
            }

            const { user } = await validateInitDataAndGetUser(initDataRaw);

            Sentry.logger.info('Telegram auth succeeded', {
                id: user.id,
                telegramUserId: user.telegram_user_id,
                username: user.username,
            });

            return res.status(200).json({
                success: true,
                message: 'Authentication successful',
                user: {
                    id: user.id,
                    telegramUserId: user.telegram_user_id,
                    username: user.username,
                    firstName: user.first_name,
                },
            });
        } catch (err) {
            if (err instanceof InitDataValidationError) {
                Sentry.logger.warn('Failed to init Telegram auth: validation failed', { details: err.message });
                return res.status(401).json({
                    error: 'Invalid or expired init data',
                    details: err.message,
                });
            }
            if (err instanceof MissingBotTokenError) {
                Sentry.logger.warn('Failed to init Telegram auth: bot token not found');
                return res.status(500).json({
                    error: 'Server configuration error: bot token is missing',
                });
            }
            Sentry.captureException(err);
            return res.status(500).json({
                error: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    }
}
