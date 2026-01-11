import { Request, Response } from 'express';
import { validate, parse, type InitData } from '@tma.js/init-data-node';

/**
 * Контроллер для аутентификации и работы с Telegram Mini App
 */
export class AuthController {
    /**
     * POST /api/auth/telegram
     * Получить и обработать данные инициализации Telegram Mini App
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

                // Здесь можно добавить:
                // - Сохранение данных пользователя в БД
                // - Создание сессии/токена
                // - Логирование данных пользователя

                console.log('Validated Telegram init data:', {
                    userId: initData.user?.id,
                    username: initData.user?.username,
                    firstName: initData.user?.first_name,
                });

                // Сохраняем распарсенные данные в res.locals для использования в других middleware
                res.locals.initData = initData;

                // Возвращаем успешный ответ
                return res.status(200).json({ 
                    success: true,
                    message: 'Telegram init data validated and received',
                    user: {
                        id: initData.user?.id,
                        username: initData.user?.username,
                        firstName: initData.user?.first_name,
                    }
                });
            } catch (validationError) {
                // Ошибка валидации (неверная подпись, истек срок действия и т.д.)
                console.error('Init data validation failed:', validationError);
                return res.status(401).json({ 
                    error: 'Invalid or expired init data',
                    details: validationError instanceof Error ? validationError.message : 'Validation failed'
                });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error processing Telegram init data:', error);
            return res.status(500).json({ error: message });
        }
    }
}
