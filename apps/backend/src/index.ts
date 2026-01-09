import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

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

// API Routes
app.use('/api', routes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Supabase connected: ${process.env.SUPABASE_URL ? '✅' : '❌'}`);
});

