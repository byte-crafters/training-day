import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

// Получаем URL и ключ из переменных окружения
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Проверяем, что переменные окружения установлены
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env file:\n' +
        '- SUPABASE_URL\n' +
        '- SUPABASE_KEY (или SUPABASE_SERVICE_ROLE_KEY)'
    );
}

// Создаем клиент Supabase с Service Role Key
// Service Role Key обходит Row Level Security (RLS) - используйте только на backend!
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

