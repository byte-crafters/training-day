import { Request, Response, NextFunction } from 'express';
import { validate, parse, type InitData } from '@tma.js/init-data-node';
import { UserService } from '../services/userService.js';

/**
 * Middleware для проверки Telegram Mini App initData
 * Валидирует initData из заголовка Authorization и извлекает user ID
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Получаем initData из заголовка Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('tma ')) {
            console.log('❌ Auth middleware: No initData in Authorization header');
            return res.status(401).json({ error: 'Unauthorized: No initData provided' });
        }

        const initDataRaw = authHeader.substring(4); // Убираем префикс "tma "

        if (!initDataRaw) {
            console.log('❌ Auth middleware: Empty initData');
            return res.status(401).json({ error: 'Unauthorized: Empty initData' });
        }

        // Получаем токен бота из переменных окружения
        const botToken = process.env.TELEGRAM_BETA_BOT_TOKEN;
        if (!botToken) {
            console.error('❌ Auth middleware: TELEGRAM_BETA_BOT_TOKEN is not set');
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
                console.log('❌ Auth middleware: User data is missing in initData');
                return res.status(401).json({ 
                    error: 'Unauthorized: User data is missing in initData' 
                });
            }

            const telegramUserId = initData.user.id;

            // Получаем или создаем пользователя в БД, чтобы получить userId
            // Это нужно для связи с workouts (workouts привязаны к userId, а не telegramUserId)
            // Автоматически создаем пользователя, если его нет - это делает поток более надежным
            const user = await UserService.createOrUpdate(telegramUserId, {
                username: initData.user.username,
                first_name: initData.user.first_name,
                last_name: initData.user.last_name,
            });

            // Сохраняем данные в res.locals для использования в контроллерах
            res.locals.userId = user.id;
            res.locals.telegramUserId = telegramUserId;
            res.locals.initData = initData;

            console.log('✅ Auth middleware: InitData validated, userId:', user.id, 'telegramUserId:', telegramUserId);

            next();
        } catch (validationError) {
            console.error('❌ Auth middleware: InitData validation failed:', validationError);
            return res.status(401).json({ 
                error: 'Unauthorized: Invalid or expired initData',
                details: validationError instanceof Error ? validationError.message : 'Validation failed'
            });
        }
    } catch (error) {
        console.error('❌ Auth middleware: Unexpected error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
