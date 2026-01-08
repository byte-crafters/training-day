import { supabase } from '../db/supabase.js';
import { Exercise, ExerciseType } from '@training-day/shared';

/**
 * Сервис для работы с упражнениями
 * Все методы работают напрямую с Supabase
 */
export class ExerciseService {
    /**
     * Получить все упражнения
     */
    static async getAll(): Promise<Exercise[]> {
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .order('name');

        if (error) {
            throw new Error(`Failed to fetch exercises: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Получить упражнение по ID
     */
    static async getById(id: string): Promise<Exercise | null> {
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Запись не найдена
                return null;
            }
            throw new Error(`Failed to fetch exercise: ${error.message}`);
        }

        return data;
    }

    /**
     * Создать новое упражнение
     */
    static async create(exercise: Exercise): Promise<Exercise> {
        const { data, error } = await supabase
            .from('exercises')
            .insert(exercise)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create exercise: ${error.message}`);
        }

        return data;
    }

    /**
     * Обновить упражнение
     */
    static async update(id: string, updates: Partial<Exercise>): Promise<Exercise> {
        const { data, error } = await supabase
            .from('exercises')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update exercise: ${error.message}`);
        }

        return data;
    }

    /**
     * Удалить упражнение
     */
    static async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete exercise: ${error.message}`);
        }
    }
}

