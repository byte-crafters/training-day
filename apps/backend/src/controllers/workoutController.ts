import { Request, Response } from 'express';
import { WorkoutService } from '../services/workoutService.js';

/**
 * Контроллер для работы с тренировками
 * Обрабатывает HTTP запросы и вызывает соответствующие методы сервиса
 */
export class WorkoutController {
    /**
     * GET /api/workouts
     * Получить все тренировки
     */
    static async getAll(req: Request, res: Response) {
        try {
            const workouts = await WorkoutService.getAll();
            res.json(workouts);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * GET /api/workouts/:id
     * Получить тренировку по ID
     */
    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const workout = await WorkoutService.getById(id);

            if (!workout) {
                return res.status(404).json({ error: 'Workout not found' });
            }

            res.json(workout);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * POST /api/workouts
     * Создать новую тренировку
     */
    static async create(req: Request, res: Response) {
        try {
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

            const createdWorkout = await WorkoutService.create(workout);
            res.status(201).json(createdWorkout);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error creating workout:', error);
            res.status(500).json({ error: message });
        }
    }

    /**
     * PUT /api/workouts/:id
     * Обновить тренировку
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const workout = await WorkoutService.update(id, req.body);
            res.json(workout);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }

    /**
     * DELETE /api/workouts/:id
     * Удалить тренировку
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await WorkoutService.delete(id);
            res.status(204).send();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    }
}

