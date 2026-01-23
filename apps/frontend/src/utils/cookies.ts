/**
 * Утилиты для работы с cookies
 */

/**
 * Получить значение cookie по имени
 */
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

/**
 * Получить access token из cookies
 */
export function getAccessToken(): string | null {
    return getCookie('access_token');
}

/**
 * Получить refresh token из cookies
 */
export function getRefreshToken(): string | null {
    return getCookie('refresh_token');
}

/**
 * Получить все cookies (для отладки)
 */
export function getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach((cookie) => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = value;
        }
    });
    return cookies;
}
