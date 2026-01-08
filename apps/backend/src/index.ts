import express from 'express';
import cors from 'cors';
import { Exercise, ExerciseType, Workout } from '@training-day/shared';

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

let workouts: Workout[] = [
    {
        id: "workout-1",
        name: "Full Body Workout",
        date: "Mon, Apr 20",
        duration: "45 mins",
        exercises: [
            {
                id: "exercise-1-1",
                name: "Bench Press",
                strength: true,
                type: ExerciseType.CHEST,
                sets: [
                    { id: "set-1-1-1", reps: 10, weight: 80, note: null },
                    { id: "set-1-1-2", reps: 8, weight: 85, note: null },
                    { id: "set-1-1-3", reps: 6, weight: 90, note: null },
                ],
            },
            {
                id: "exercise-1-2",
                name: "Squats",
                strength: true,
                type: ExerciseType.LEGS,
                sets: [
                    { id: "set-1-2-1", reps: 12, weight: 100, note: null },
                    { id: "set-1-2-2", reps: 10, weight: 110, note: null },
                    { id: "set-1-2-3", reps: 8, weight: 120, note: null },
                ],
            },
            {
                id: "exercise-1-3",
                name: "Deadlift",
                strength: true,
                type: ExerciseType.BACK,
                sets: [
                    { id: "set-1-3-1", reps: 8, weight: 120, note: null },
                    { id: "set-1-3-2", reps: 6, weight: 130, note: null },
                    { id: "set-1-3-3", reps: 5, weight: 140, note: null },
                ],
            },
        ],
    },
    {
        id: "workout-2",
        name: "Cardio Session",
        date: "Sat, Apr 18",
        duration: "30 mins",
        exercises: [
            {
                id: "exercise-2-1",
                name: "Running",
                strength: false,
                type: ExerciseType.CARDIO,
                sets: [
                    { id: "set-2-1-1", reps: 1, weight: 0, note: null },
                ],
            },
            {
                id: "exercise-2-2",
                name: "Jump Rope",
                strength: false,
                type: ExerciseType.CARDIO,
                sets: [
                    { id: "set-2-2-1", reps: 100, weight: 0, note: null },
                    { id: "set-2-2-2", reps: 100, weight: 0, note: null },
                    { id: "set-2-2-3", reps: 100, weight: 0, note: null },
                ],
            },
        ],
    }
]

// Exercises API Routes
app.get('/api/exercises', (_req, res) => {
    res.json(exercises);
});

// Workouts API Routes
app.get('/api/workouts', (_req, res) => {
    res.json(workouts);
});

app.get('/api/workouts/:id', (req, res) => {
    const workout = workouts.find((w) => w.id === req.params.id);
    if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
});

app.post('/api/workouts', (req, res) => {
    const workout: Workout = req.body;
    
    // Валидация
    if (!workout.id || !workout.name || !workout.date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Проверка на дубликат
    if (workouts.find((w) => w.id === workout.id)) {
        return res.status(409).json({ error: 'Workout with this id already exists' });
    }

    workouts.push(workout);
    res.status(201).json(workout);
});

app.put('/api/workouts/:id', (req, res) => {
    const workoutId = req.params.id;
    const workoutIndex = workouts.findIndex((w) => w.id === workoutId);

    if (workoutIndex === -1) {
        return res.status(404).json({ error: 'Workout not found' });
    }

    const updatedWorkout: Workout = { ...workouts[workoutIndex], ...req.body };
    workouts[workoutIndex] = updatedWorkout;
    res.json(updatedWorkout);
});

app.delete('/api/workouts/:id', (req, res) => {
    const workoutId = req.params.id;
    const workoutIndex = workouts.findIndex((w) => w.id === workoutId);

    if (workoutIndex === -1) {
        return res.status(404).json({ error: 'Workout not found' });
    }

    workouts.splice(workoutIndex, 1);
    res.status(204).send();
});

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

