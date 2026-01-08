import express from 'express';
import cors from 'cors';
import { Exercise, ExerciseType } from '@training-day/shared';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Пример данных
const exercises: Exercise[] = [
    {
        id: 'exercise-1',
        name: 'Bench Press',
        strength: true,
        type: ExerciseType.CHEST,
    },
    {
        id: 'exercise-2',
        name: 'Squats',
        strength: true,
        type: ExerciseType.LEGS,
    },
    {
        id: 'exercise-3',
        name: 'Deadlift',
        strength: true,
        type: ExerciseType.BACK,
    },
    {
        id: 'exercise-4',
        name: 'Running',
        strength: false,
        type: ExerciseType.CARDIO,
    },
];

// API Routes
app.get('/api/exercises', (_req, res) => {
    res.json(exercises);
});

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

