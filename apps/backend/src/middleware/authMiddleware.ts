import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/jwt.js';

/**
 * Middleware для проверки JWT токена из cookies
 * Извлекает user ID из access_token и сохраняет в res.locals
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Получаем access_token из cookies
        const accessToken = req.cookies?.access_token;

        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized: No access token provided' });
        }

        // Валидируем токен
        const payload = verifyAccessToken(accessToken);

        // Сохраняем данные пользователя в res.locals для использования в контроллерах
        res.locals.userId = payload.userId;
        res.locals.telegramUserId = payload.telegramUserId;

        next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Unauthorized: Invalid or expired token',
            details: error instanceof Error ? error.message : 'Token validation failed'
        });
    }
}
