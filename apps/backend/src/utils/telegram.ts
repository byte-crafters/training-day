/**
 * Утилита для отправки сообщений в Telegram через Bot API
 */
export async function sendTelegramMessage(
    botToken: string,
    chatId: string | number,
    message: string
): Promise<void> {
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
        const errorData = await response.json().catch(() => ({})) as { description?: string };
        throw new Error(
            `Telegram API error: ${errorData.description || response.statusText}`
        );
    }
}
