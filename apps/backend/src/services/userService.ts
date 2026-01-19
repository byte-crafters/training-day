import { supabase } from '../db/supabase.js';

export interface User {
    id: string;
    telegram_user_id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Сервис для работы с пользователями
 */
export class UserService {
    /**
     * Найти пользователя по Telegram User ID
     */
    static async findByTelegramId(telegramUserId: number): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_user_id', telegramUserId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Запись не найдена
                return null;
            }
            throw new Error(`Failed to find user: ${error.message}`);
        }

        return data;
    }

    /**
     * Создать или обновить пользователя
     */
    static async createOrUpdate(telegramUserId: number, userData: {
        username?: string;
        first_name?: string;
        last_name?: string;
    }): Promise<User> {
        // Сначала пытаемся найти существующего пользователя
        const existingUser = await this.findByTelegramId(telegramUserId);

        if (existingUser) {
            // Обновляем существующего пользователя
            const { data, error } = await supabase
                .from('users')
                .update({
                    username: userData.username,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                })
                .eq('telegram_user_id', telegramUserId)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to update user: ${error.message}`);
            }

            return data;
        } else {
            // Создаем нового пользователя
            const { data, error } = await supabase
                .from('users')
                .insert({
                    telegram_user_id: telegramUserId,
                    username: userData.username,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                })
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to create user: ${error.message}`);
            }

            return data;
        }
    }
}
