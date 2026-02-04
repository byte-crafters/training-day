import * as Sentry from '@sentry/node';
import { Request, Response, NextFunction } from 'express';
import {
    validateInitDataAndGetUser,
    InitDataValidationError,
    MissingBotTokenError,
} from '../services/authService.js';

/**
 * Middleware для проверки Telegram Mini App initData.
 * Валидирует initData из заголовка Authorization и кладёт userId в res.locals.
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    Sentry.getCurrentScope().setAttribute('handler', 'auth_middleware');
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('tma ')) {
            Sentry.logger.warn('Failed to authenticate: no initData in Authorization header');
            return res.status(401).json({ error: 'Unauthorized: No initData provided' });
        }

        const initDataRaw = authHeader.substring(4);
        if (!initDataRaw) {
            Sentry.logger.warn('Failed to authenticate: empty initData');
            return res.status(401).json({ error: 'Unauthorized: Empty initData' });
        }

        const { user, initData, telegramUserId } = await validateInitDataAndGetUser(initDataRaw);

        res.locals.userId = user.id;
        res.locals.telegramUserId = telegramUserId;
        res.locals.initData = initData;
        Sentry.logger.info('Auth succeeded', { userId: user.id, telegramUserId });
        next();
    } catch (err) {
        if (err instanceof InitDataValidationError) {
            Sentry.captureException(err.cause ?? err);
            Sentry.logger.warn('Failed to authenticate: validation failed', {
                details: err.message,
            });
            return res.status(401).json({
                error: 'Unauthorized: Invalid or expired initData',
                details: err.message,
            });
        }
        if (err instanceof MissingBotTokenError) {
            Sentry.logger.warn('Failed to authenticate: bot token not found');
            return res.status(500).json({
                error: 'Server configuration error: bot token is missing',
            });
        }
        Sentry.captureException(err);
        return res.status(500).json({
            error: 'Internal server error',
            details: err instanceof Error ? err.message : 'Unknown error',
        });
    }
}
