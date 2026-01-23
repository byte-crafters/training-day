import { supabase } from '../db/supabase.js';
import { Workout, Activity, Set } from '@training-day/shared';
import { v4 as uuidv4 } from 'uuid';

/**
 * Сервис для работы с тренировками
 * Работает с Supabase, включая связанные данные (activities и sets)
 */
export class WorkoutService {
    /**
     * Получить все тренировки с упражнениями и сетами для конкретного пользователя
     */
    static async getAll(userId: string): Promise<Workout[]> {
        // Получаем все тренировки пользователя, сортируем по дате создания (сначала новые), затем по created_at
        const { data: workouts, error: workoutsError } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false });

        if (workoutsError) {
            throw new Error(`Failed to fetch workouts: ${workoutsError.message}`);
        }

        if (!workouts || workouts.length === 0) {
            return [];
        }

        // Для каждой тренировки получаем activities и sets
        const workoutsWithExercises = await Promise.all(
            workouts.map(async (workout: any) => {
                const exercises = await this.getExercisesForWorkout(workout.id);
                return {
                    id: workout.id,
                    name: workout.name,
                    date: workout.date, // Время создания тренировки
                    duration: workout.duration, // Длительность тренировки
                    exercises,
                };
            })
        );

        return workoutsWithExercises;
    }

    /**
     * Получить тренировку по ID с упражнениями и сетами
     * Проверяет, что тренировка принадлежит пользователю
     */
    static async getById(id: string, userId: string): Promise<Workout | null> {
        // Получаем тренировку с проверкой принадлежности пользователю
        const { data: workout, error: workoutError } = await supabase
            .from('workouts')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (workoutError) {
            if (workoutError.code === 'PGRST116') {
                return null;
            }
            throw new Error(`Failed to fetch workout: ${workoutError.message}`);
        }

        // Получаем упражнения для этой тренировки
        const exercises = await this.getExercisesForWorkout(id);

        return {
            id: workout.id,
            name: workout.name,
            date: workout.date, // Время создания тренировки
            duration: workout.duration, // Длительность тренировки
            exercises,
        };
    }

    /**
     * Получить упражнения (activities) для тренировки
     */
    private static async getExercisesForWorkout(workoutId: string): Promise<Activity[]> {
        // Получаем activities для тренировки
        const { data: activities, error: activitiesError } = await supabase
            .from('activities')
            .select('*')
            .eq('workout_id', workoutId);

        if (activitiesError) {
            throw new Error(`Failed to fetch activities: ${activitiesError.message}`);
        }

        if (!activities || activities.length === 0) {
            return [];
        }

        // Для каждой activity получаем sets
        const activitiesWithSets = await Promise.all(
            activities.map(async (activity) => {
                const { data: sets, error: setsError } = await supabase
                    .from('sets')
                    .select('*')
                    .eq('activity_id', activity.id)
                    .order('created_at');

                if (setsError) {
                    throw new Error(`Failed to fetch sets: ${setsError.message}`);
                }

                return {
                    id: activity.exercise_id,
                    name: activity.name,
                    strength: activity.strength,
                    type: activity.type,
                    sets: (sets || []).map((set) => ({
                        id: set.id,
                        reps: set.reps,
                        weight: set.weight,
                        note: set.note,
                    })),
                };
            })
        );

        return activitiesWithSets;
    }

    /**
     * Создать новую тренировку с упражнениями и сетами
     */
    static async create(workout: Workout, userId: string): Promise<Workout> {
        // Начинаем транзакцию (Supabase не поддерживает транзакции напрямую,
        // поэтому делаем последовательные операции)
        
        console.log('Creating workout:', JSON.stringify(workout, null, 2));
        
        // 1. Создаем тренировку
        const { data: createdWorkout, error: workoutError } = await supabase
            .from('workouts')
            .insert({
                id: workout.id,
                name: workout.name,
                date: workout.date, // Время создания тренировки
                duration: workout.duration, // Длительность тренировки
                user_id: userId, // Привязываем к пользователю
            })
            .select()
            .single();

        if (workoutError) {
            console.error('Workout creation error:', workoutError);
            throw new Error(`Failed to create workout: ${workoutError.message}`);
        }

        // 2. Создаем activities и sets для каждого упражнения
        for (const exercise of workout.exercises) {
            // Генерируем уникальный ID для activity
            const activityId = uuidv4();
            
            // Создаем activity
            console.log('Creating activity for exercise:', exercise.id, exercise.name);
            const { data: activity, error: activityError } = await supabase
                .from('activities')
                .insert({
                    id: activityId,
                    workout_id: workout.id,
                    exercise_id: exercise.id, // Ссылка на Exercise из справочника
                    name: exercise.name,
                    strength: exercise.strength,
                    type: exercise.type,
                })
                .select()
                .single();

            if (activityError) {
                console.error('Activity creation error:', activityError);
                // Если ошибка, удаляем созданную тренировку
                await supabase.from('workouts').delete().eq('id', workout.id);
                throw new Error(`Failed to create activity: ${activityError.message}`);
            }

            // 3. Создаем sets для activity
            if (exercise.sets && exercise.sets.length > 0) {
                const setsToInsert = exercise.sets.map((set) => ({
                    id: set.id,
                    activity_id: activityId, // Используем уникальный ID activity
                    reps: set.reps,
                    weight: set.weight,
                    note: set.note,
                }));

                const { error: setsError } = await supabase
                    .from('sets')
                    .insert(setsToInsert);

                if (setsError) {
                    // Если ошибка, удаляем созданную тренировку и activity
                    await supabase.from('activities').delete().eq('id', activityId);
                    await supabase.from('workouts').delete().eq('id', workout.id);
                    throw new Error(`Failed to create sets: ${setsError.message}`);
                }
            }
        }

        // Возвращаем полную тренировку
        return this.getById(workout.id, userId) as Promise<Workout>;
    }

    /**
     * Обновить тренировку
     * Проверяет, что тренировка принадлежит пользователю
     */
    static async update(id: string, updates: Partial<Workout>, userId: string): Promise<Workout> {
        const updateData: any = {};
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.date !== undefined) updateData.date = updates.date;
        if (updates.duration !== undefined) updateData.duration = updates.duration;

        const { data, error } = await supabase
            .from('workouts')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId) // Проверяем принадлежность пользователю
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Workout not found or access denied');
            }
            throw new Error(`Failed to update workout: ${error.message}`);
        }

        return this.getById(id, userId) as Promise<Workout>;
    }

    /**
     * Удалить тренировку (каскадно удалятся activities и sets)
     * Проверяет, что тренировка принадлежит пользователю
     */
    static async delete(id: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', id)
            .eq('user_id', userId); // Проверяем принадлежность пользователю

        if (error) {
            throw new Error(`Failed to delete workout: ${error.message}`);
        }
    }
}

