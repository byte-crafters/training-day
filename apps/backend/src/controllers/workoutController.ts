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
        Sentry.getCurrentScope().setAttribute('handler', 'workout_getAll');
        try {
            const userId = res.locals.userId;
            if (!userId) {
                Sentry.logger.warn('Failed to get workouts: no userId in res.locals');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const workouts = await WorkoutService.getAll(userId);
            Sentry.logger.info('Workouts fetched', { userId, count: workouts.length });
            res.json(workouts);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * GET /api/workouts/:id
     * Получить тренировку по ID (только если она принадлежит текущему пользователю)
     */
    static async getById(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'workout_getById');
        try {
            const { id } = req.params;
            const userId = res.locals.userId;

            if (!userId) {
                Sentry.logger.warn('Failed to get workout: no userId in res.locals');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const workout = await WorkoutService.getById(id, userId);

            if (!workout) {
                Sentry.logger.warn('Workout not found', { id, userId });
                return res.status(404).json({ error: 'Workout not found' });
            }

            Sentry.logger.info('Workout fetched', { id, userId, workout });
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
        Sentry.getCurrentScope().setAttribute('handler', 'workout_create');

        try {
            const userId = res.locals.userId;

            if (!userId) {
                Sentry.logger.warn('Failed to create workout: no userId in res.locals');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const workout = req.body;

            if (!workout.id || !workout.name || !workout.date || !workout.duration) {
                Sentry.logger.warn('Failed to create workout: missing required fields', {
                    hasId: !!workout.id,
                    hasName: !!workout.name,
                    hasDate: !!workout.date,
                    hasDuration: !!workout.duration,
                });
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
            Sentry.logger.info('Workout created', { userId, workout: createdWorkout });
            res.status(201).json(createdWorkout);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * PUT /api/workouts/:id
     * Обновить тренировку (только если она принадлежит текущему пользователю)
     */
    static async update(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'workout_update');
        try {
            const { id } = req.params;
            const userId = res.locals.userId;

            if (!userId) {
                Sentry.logger.warn('Failed to update workout: no userId in res.locals');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const workout = await WorkoutService.update(id, req.body, userId);
            Sentry.logger.info('Workout updated', { id, userId, workout });
            res.json(workout);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            if (message.includes('not found') || message.includes('access denied')) {
                Sentry.logger.warn('Workout not found or access denied', { userId: res.locals.userId });
                return res.status(404).json({ error: message });
            }
            Sentry.captureException(error);
            res.status(500).json({ error: message });
        }
    }

    /**
     * DELETE /api/workouts/:id
     * Удалить тренировку (только если она принадлежит текущему пользователю)
     */
    static async delete(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'workout_delete');
        try {
            const { id } = req.params;
            const userId = res.locals.userId;

            if (!userId) {
                Sentry.logger.warn('Failed to delete workout: no userId in res.locals');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            await WorkoutService.delete(id, userId);
            Sentry.logger.info('Workout deleted', { id, userId });
            res.status(204).send();
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }
}

