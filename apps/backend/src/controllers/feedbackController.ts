import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { FeedbackService } from '../services/feedbackService.js';
import { UserService } from '../services/userService.js';

/**
 * Контроллер для обработки feedback
 */
export class FeedbackController {
    /**
     * POST /api/feedback
     * Отправляет feedback в Telegram админу
     */
    static async create(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'feedback_create');
        try {
            const { message } = req.body;
            const userId = res.locals.userId;
            const telegramUserId = res.locals.telegramUserId;

            if (!message || typeof message !== 'string' || !message.trim()) {
                Sentry.logger.warn('Failed to send feedback: invalid or empty message');
                return res.status(400).json({
                    error: 'Message is required and must be a non-empty string'
                });
            }

            const user = await UserService.findByTelegramId(telegramUserId);

            await FeedbackService.sendToTelegram({
                message: message.trim(),
                telegramUserId,
                userInfo: {
                    username: user?.username,
                    firstName: user?.first_name,
                },
            });

            Sentry.logger.info('Feedback sent', { userId, telegramUserId });
            return res.status(200).json({
                success: true,
                message: 'Feedback sent successfully'
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            if (msg.includes('TELEGRAM_BOT_TOKEN') || msg.includes('TELEGRAM_ADMIN_CHAT_ID')) {
                Sentry.logger.warn('Failed to send feedback: missing Telegram env', { details: msg });
            }
            Sentry.captureException(error);
            return res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to send feedback'
            });
        }
    }
}
