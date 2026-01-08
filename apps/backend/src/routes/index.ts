import { Router } from 'express';
import { ExerciseController } from '../controllers/exerciseController.js';
import { WorkoutController } from '../controllers/workoutController.js';

const router = Router();

// Exercises routes
router.get('/exercises', ExerciseController.getAll);
router.get('/exercises/:id', ExerciseController.getById);
router.post('/exercises', ExerciseController.create);
router.put('/exercises/:id', ExerciseController.update);
router.delete('/exercises/:id', ExerciseController.delete);

// Workouts routes
router.get('/workouts', WorkoutController.getAll);
router.get('/workouts/:id', WorkoutController.getById);
router.post('/workouts', WorkoutController.create);
router.put('/workouts/:id', WorkoutController.update);
router.delete('/workouts/:id', WorkoutController.delete);

// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

export default router;

