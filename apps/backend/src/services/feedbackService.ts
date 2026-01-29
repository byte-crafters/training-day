import { sendTelegramMessage } from '../utils/telegram.js';

export interface FeedbackData {
    message: string;
    telegramUserId: number;
    userInfo?: {
        username?: string;
        firstName?: string;
    };
}

/**
 * Сервис для отправки feedback в Telegram
 * Отправляет сообщение админу без сохранения в БД
 */
export class FeedbackService {
    static async sendToTelegram(data: FeedbackData): Promise<void> {
        // Используем основной бот для отправки feedback
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            console.error('❌ TELEGRAM_BOT_TOKEN is not set in environment variables');
            throw new Error('TELEGRAM_BOT_TOKEN is not set');
        }

        const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
        if (!adminChatId) {
            console.error('❌ TELEGRAM_ADMIN_CHAT_ID is not set in environment variables');
            throw new Error('TELEGRAM_ADMIN_CHAT_ID is not set');
        }

        // Логируем попытку отправки (без токена для безопасности)
        console.log('📤 Sending feedback to Telegram:', {
            chatId: adminChatId,
            hasToken: !!botToken,
            tokenLength: botToken.length,
            userId: data.telegramUserId,
        });

        // Форматируем сообщение
        const userDisplayName = data.userInfo?.firstName || 
                               data.userInfo?.username || 
                               `User ${data.telegramUserId}`;
        
        const usernamePart = data.userInfo?.username 
            ? `(@${data.userInfo.username})` 
            : '';

        const telegramMessage = `
📝 <b>Новый Feedback</b>

👤 <b>Пользователь:</b> ${userDisplayName} ${usernamePart}
🆔 <b>Telegram ID:</b> ${data.telegramUserId}

💬 <b>Сообщение:</b>
${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'medium'
})}
        `.trim();

        await sendTelegramMessage(botToken, adminChatId, telegramMessage);
    }
}
