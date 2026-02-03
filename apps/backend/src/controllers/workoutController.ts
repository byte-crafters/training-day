import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { WorkoutService } from '../services/workoutService.js';

/**
 * Контроллер для работы с тренировками
 * Обрабатывает HTTP запросы и вызывает соответствующие методы сервиса
 * Все методы требуют аутентификации и работают только с тренировками текущего пользователя
 */
export class WorkoutController {
    /**
     * GET /api/workouts
     * Получить все тренировки текущего пользователя
     */
    static async getAll(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            if (!userId) {
                console.log('❌ WorkoutController.getAll: No userId in res.locals');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            console.log('📋 WorkoutController.getAll: Fetching workouts for userId:', userId);
            const workouts = await WorkoutService.getAll(userId);
            console.log(`✅ WorkoutController.getAll: Found ${workouts.length} workouts for userId:`, userId);
            res.json(workouts);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ WorkoutController.getAll error:', message);
            res.status(500).json({ error: message });
        }
    }

    /**
     * GET /api/workouts/:id
     * Получить тренировку по ID (только если она принадлежит текущему пользователю)
     */
    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = res.locals.userId;
            
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const workout = await WorkoutService.getById(id, userId);

            if (!workout) {
                return res.status(404).json({ error: 'Workout not found' });
            }

            res.json(workout);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * POST /api/workouts
     * Создать новую тренировку для текущего пользователя
     */
    static async create(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const workout = req.body;

            // Валидация обязательных полей
            if (!workout.id || !workout.name || !workout.date || !workout.duration) {
                return res.status(400).json({ 
                    error: 'Missing required fields',
                    received: {
                        id: !!workout.id,
                        name: !!workout.name,
                        date: !!workout.date,
                        duration: !!workout.duration
                    }
                });
            }

            const createdWorkout = await WorkoutService.create(workout, userId);
            res.status(201).json(createdWorkout);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error creating workout:', error);
            res.status(500).json({ error: message });
        }
    }

    /**
     * PUT /api/workouts/:id
     * Обновить тренировку (только если она принадлежит текущему пользователю)
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = res.locals.userId;
            
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const workout = await WorkoutService.update(id, req.body, userId);
            res.json(workout);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            
            // Если тренировка не найдена или доступ запрещен
            if (message.includes('not found') || message.includes('access denied')) {
                return res.status(404).json({ error: message });
            }
            
            res.status(500).json({ error: message });
        }
    }

    /**
     * DELETE /api/workouts/:id
     * Удалить тренировку (только если она принадлежит текущему пользователю)
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = res.locals.userId;
            
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            await WorkoutService.delete(id, userId);
            res.status(204).send();
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }
}

