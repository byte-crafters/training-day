import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { validate, parse, type InitData } from '@tma.js/init-data-node';
import { UserService } from '../services/userService.js';

export class AuthController {
    /**
     * POST /api/auth/telegram
     * Получить и обработать данные инициализации Telegram Mini App
     * Создает/обновляет пользователя в БД
     * initData валидируется автоматически через authMiddleware в других запросах
     */
    static async initTelegram(req: Request, res: Response) {
        await Sentry.withScope(async (scope) => {
            scope.setTag('auth.endpoint', 'initTelegram');
            Sentry.logger.info('Initialization via Telegram Mini App started');
            try {
                // Получаем данные из заголовка Authorization
                const authHeader = req.headers.authorization;

                if (!authHeader || !authHeader.startsWith('tma ')) {
                    Sentry.logger.warn('initTelegram: missing or invalid Authorization header');
                    return res.status(401).json({
                        error: 'Missing or invalid Authorization header. Expected format: "tma <initDataRaw>"'
                    });
                }

                const initDataRaw = authHeader.substring(4); // Убираем префикс "tma "

                // Валидация обязательных полей
                if (!initDataRaw) {
                    return res.status(400).json({
                        error: 'Missing initDataRaw in Authorization header'
                    });
                }

                // Получаем токен бота из переменных окружения
                const botToken = process.env.TELEGRAM_BETA_BOT_TOKEN;
                if (!botToken) {
                    scope.setTag('auth.failure', 'missing_bot_token');
                    Sentry.logger.error('initTelegram: TELEGRAM_BETA_BOT_TOKEN is not set');
                    console.error('TELEGRAM_BETA_BOT_TOKEN is not set in environment variables');
                    return res.status(500).json({
                        error: 'Server configuration error: bot token is missing'
                    });
                }

                // Валидация подписи initData
                try {
                    validate(initDataRaw, botToken, {
                        // Считаем подпись валидной в течение 1 часа с момента создания
                        // сейчас 24 часа чтобы я мог замокать данные
                        expiresIn: 3600 * 24,
                    });

                    // Парсим данные для дальнейшего использования
                    const initData: InitData = parse(initDataRaw);
                    Sentry.logger.info('initTelegram: initData validated');

                    // Проверяем, что user данные присутствуют
                    if (!initData.user?.id) {
                        return res.status(400).json({
                            error: 'User data is missing in initData'
                        });
                    }

                    const telegramUserId = initData.user.id;
                    scope.setUser({
                        id: String(telegramUserId),
                        username: initData.user.username ?? undefined,
                    });
                    scope.setContext('init_telegram', {
                        telegramUserId,
                        hasUsername: !!initData.user.username,
                        hasFirstName: !!initData.user.first_name,
                    });

                    // Создаем или обновляем пользователя в БД
                    const user = await UserService.createOrUpdate(telegramUserId, {
                        username: initData.user.username,
                        first_name: initData.user.first_name,
                        last_name: initData.user.last_name,
                    });

                    scope.setUser({
                        id: user.id,
                        username: user.username ?? undefined,
                        segment: String(user.telegram_user_id),
                    });
                    scope.setTag('auth.result', 'success');
                    Sentry.logger.info('initTelegram: user created/updated', { userId: user.id, telegramUserId: user.telegram_user_id });
                    console.log('User created/updated:', {
                        id: user.id,
                        telegramUserId: user.telegram_user_id,
                        username: user.username,
                    });

                    // Возвращаем успешный ответ с данными пользователя
                    return res.status(200).json({
                        success: true,
                        message: 'Authentication successful',
                        user: {
                            id: user.id,
                            telegramUserId: user.telegram_user_id,
                            username: user.username,
                            firstName: user.first_name,
                        }
                    });
                } catch (validationError) {
                    scope.setTag('auth.failure', 'validation_failed');
                    Sentry.logger.warn('initTelegram: validation failed', { details: validationError instanceof Error ? validationError.message : String(validationError) });
                    console.error('Init data validation failed:', validationError);
                    return res.status(401).json({
                        error: 'Invalid or expired init data',
                        details: validationError instanceof Error ? validationError.message : 'Validation failed'
                    });
                }
            } catch (error) {
                scope.setTag('auth.failure', 'unexpected_error');
                Sentry.logger.error('initTelegram: unexpected error', { message: error instanceof Error ? error.message : String(error) });
                Sentry.captureException(error);
                const message = error instanceof Error ? error.message : 'Unknown error';
                console.error('Error processing Telegram init data:', error);
                return res.status(500).json({ error: message });
            }
        });
    }
}
