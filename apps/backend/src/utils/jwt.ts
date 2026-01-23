import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

export interface JWTPayload {
    userId: string;
    telegramUserId: number;
}

/**
 * Генерация access token (короткоживущий токен для аутентификации)
 */
export function generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '15m', // 15 минут
    });
}

/**
 * Генерация refresh token (долгоживущий токен для обновления access token)
 */
export function generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '7d', // 7 дней
    });
}

/**
 * Валидация access token
 */
export function verifyAccessToken(token: string): JWTPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid access token');
    }
}

/**
 * Валидация refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}
