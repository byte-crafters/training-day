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
        try {
            const { message } = req.body;
            const userId = res.locals.userId;
            const telegramUserId = res.locals.telegramUserId;

            // Валидация
            if (!message || typeof message !== 'string' || !message.trim()) {
                return res.status(400).json({ 
                    error: 'Message is required and must be a non-empty string' 
                });
            }

            // Получаем информацию о пользователе
            const user = await UserService.findByTelegramId(telegramUserId);

            // Отправляем в Telegram
            await FeedbackService.sendToTelegram({
                message: message.trim(),
                telegramUserId,
                userInfo: {
                    username: user?.username,
                    firstName: user?.first_name,
                },
            });

            console.log('✅ Feedback sent to Telegram:', {
                telegramUserId,
                username: user?.username,
            });

            return res.status(200).json({ 
                success: true,
                message: 'Feedback sent successfully' 
            });
        } catch (error) {
            console.error('❌ Error sending feedback:', error);
            return res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Failed to send feedback' 
            });
        }
    }
}
