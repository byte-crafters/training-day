import 'dotenv/config';
import './sentry/instrument.mjs';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import * as Sentry from '@sentry/node';

// Инициализируем Supabase (проверяем подключение)
import './db/supabase.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // For development, allow all. In production, uncomment below:
            // callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', routes);

// Sentry error handler — обязательно после всех маршрутов
Sentry.setupExpressErrorHandler(app);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Supabase connected: ${process.env.SUPABASE_URL ? '✅' : '❌'}`);
});

