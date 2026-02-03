import { Router } from 'express';
import { ExerciseController } from '../controllers/exerciseController.js';
import { WorkoutController } from '../controllers/workoutController.js';
import { AuthController } from '../controllers/authController.js';
import { FeedbackController } from '../controllers/feedbackController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Exercises routes
router.get('/exercises', ExerciseController.getAll);
router.get('/exercises/:id', ExerciseController.getById);
router.post('/exercises', ExerciseController.create);
router.put('/exercises/:id', ExerciseController.update);
router.delete('/exercises/:id', ExerciseController.delete);

// Workouts routes (требуют аутентификации)
router.get('/workouts', authMiddleware, WorkoutController.getAll);
router.get('/workouts/:id', authMiddleware, WorkoutController.getById);
router.post('/workouts', authMiddleware, WorkoutController.create);
router.put('/workouts/:id', authMiddleware, WorkoutController.update);
router.delete('/workouts/:id', authMiddleware, WorkoutController.delete);

// Auth routes
router.post('/auth/telegram', AuthController.initTelegram);

// Feedback routes (требуют аутентификации)
router.post('/feedback', authMiddleware, FeedbackController.create);

// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

router.get("/debug-sentry", function mainHandler(_req, _res) {
    throw new Error("My first Sentry error!");
});

export default router;

