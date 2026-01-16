import { Request, Response } from 'express';
import { validate, parse, type InitData } from '@tma.js/init-data-node';
import { UserService } from '../services/userService.js';

/**
 * Контроллер для аутентификации и работы с Telegram Mini App
 * Теперь авторизация происходит через initData в каждом запросе,
 * этот endpoint используется только для создания/обновления пользователя
 */
export class AuthController {
    /**
     * POST /api/auth/telegram
     * Получить и обработать данные инициализации Telegram Mini App
     * Создает/обновляет пользователя в БД
     * initData валидируется автоматически через authMiddleware в других запросах
     */
    static async initTelegram(req: Request, res: Response) {
        try {
            // Получаем данные из заголовка Authorization
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('tma ')) {
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
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            if (!botToken) {
                console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
                return res.status(500).json({ 
                    error: 'Server configuration error: bot token is missing'
                });
            }

            // Валидация подписи initData
            try {
                validate(initDataRaw, botToken, {
                    // Считаем подпись валидной в течение 1 часа с момента создания
                    expiresIn: 3600,
                });

                // Парсим данные для дальнейшего использования
                const initData: InitData = parse(initDataRaw);

                // Проверяем, что user данные присутствуют
                if (!initData.user?.id) {
                    return res.status(400).json({ 
                        error: 'User data is missing in initData'
                    });
                }

                const telegramUserId = initData.user.id;

                // Создаем или обновляем пользователя в БД
                const user = await UserService.createOrUpdate(telegramUserId, {
                    username: initData.user.username,
                    first_name: initData.user.first_name,
                    last_name: initData.user.last_name,
                });

                console.log('✅ User created/updated:', {
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
                // Ошибка валидации (неверная подпись, истек срок действия и т.д.)
                console.error('❌ Init data validation failed:', validationError);
                return res.status(401).json({ 
                    error: 'Invalid or expired init data',
                    details: validationError instanceof Error ? validationError.message : 'Validation failed'
                });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ Error processing Telegram init data:', error);
            return res.status(500).json({ error: message });
        }
    }
}
