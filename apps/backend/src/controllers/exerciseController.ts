import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { ExerciseService } from '../services/exerciseService.js';

/**
 * Контроллер для работы с упражнениями
 * Обрабатывает HTTP запросы и вызывает соответствующие методы сервиса
 */
export class ExerciseController {
    /**
     * GET /api/exercises
     * Получить все упражнения
     */
    static async getAll(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'exercise_getAll');
        try {
            const exercises = await ExerciseService.getAll();
            Sentry.logger.info('Exercises fetched', { count: exercises.length });
            res.json(exercises);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * GET /api/exercises/:id
     * Получить упражнение по ID
     */
    static async getById(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'exercise_getById');
        try {
            const { id } = req.params;
            const exercise = await ExerciseService.getById(id);

            if (!exercise) {
                Sentry.logger.warn('Exercise not found', { id });
                return res.status(404).json({ error: 'Exercise not found' });
            }

            Sentry.logger.info('Exercise fetched', { id, exercise });
            res.json(exercise);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * POST /api/exercises
     * Создать новое упражнение
     */
    static async create(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'exercise_create');
        try {
            const exercise = await ExerciseService.create(req.body);
            Sentry.logger.info('Exercise created', { exercise });
            res.status(201).json(exercise);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * PUT /api/exercises/:id
     * Обновить упражнение
     */
    static async update(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'exercise_update');
        try {
            const { id } = req.params;
            const exercise = await ExerciseService.update(id, req.body);
            Sentry.logger.info('Exercise updated', { id, exercise });
            res.json(exercise);
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * DELETE /api/exercises/:id
     * Удалить упражнение
     */
    static async delete(req: Request, res: Response) {
        Sentry.getCurrentScope().setAttribute('handler', 'exercise_delete');
        try {
            const { id } = req.params;
            await ExerciseService.delete(id);
            Sentry.logger.info('Exercise deleted', { id });
            res.status(204).send();
        } catch (error) {
            Sentry.captureException(error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }
}

