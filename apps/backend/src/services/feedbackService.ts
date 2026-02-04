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
            throw new Error('TELEGRAM_BOT_TOKEN is not set');
        }

        const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
        if (!adminChatId) {
            throw new Error('TELEGRAM_ADMIN_CHAT_ID is not set');
        }

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
