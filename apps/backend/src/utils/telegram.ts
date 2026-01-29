/**
 * Утилита для отправки сообщений в Telegram через Bot API
 */
export async function sendTelegramMessage(
    botToken: string,
    chatId: string | number,
    message: string
): Promise<void> {
    // Валидация токена
    if (!botToken || botToken.trim().length === 0) {
        throw new Error('Bot token is empty or invalid');
    }

    // Валидация chat_id
    if (!chatId || (typeof chatId === 'string' && chatId.trim().length === 0)) {
        throw new Error('Chat ID is empty or invalid');
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { 
            description?: string;
            error_code?: number;
            parameters?: unknown;
        };
        
        const errorMessage = errorData.description || response.statusText;
        const errorCode = errorData.error_code;
        
        // Логируем детали ошибки для отладки (без чувствительных данных)
        console.error('❌ Telegram API error:', {
            status: response.status,
            statusText: response.statusText,
            errorCode,
            description: errorMessage,
            chatId: typeof chatId === 'number' ? chatId : 'string',
            hasToken: !!botToken,
            tokenLength: botToken.length,
        });
        
        // Более понятные сообщения об ошибках
        let userFriendlyMessage = errorMessage;
        if (response.status === 401) {
            userFriendlyMessage = 'Unauthorized: Invalid bot token or bot was revoked';
        } else if (errorCode === 400) {
            if (errorMessage?.includes('chat not found')) {
                userFriendlyMessage = 'Chat not found: Bot must be added to the chat first';
            } else if (errorMessage?.includes('chat_id')) {
                userFriendlyMessage = 'Invalid chat ID';
            }
        }
        
        throw new Error(
            `Telegram API error: ${userFriendlyMessage}${errorCode ? ` (code: ${errorCode})` : ''}`
        );
    }
}
