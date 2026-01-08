import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

// Инициализируем Supabase (проверяем подключение)
import './db/supabase.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Supabase connected: ${process.env.SUPABASE_URL ? '✅' : '❌'}`);
});

