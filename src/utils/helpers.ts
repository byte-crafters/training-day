import { v4 as uuidv4 } from 'uuid';
import { Exercise, Activity, Workout } from '../types';

/**
 * Преобразует Exercise в Activity (выбранное упражнение с пустыми сетами)
 * @param exercise - упражнение из списка доступных
 * @returns Activity с пустым массивом сетов и всеми полями Exercise
 */
export function exerciseToActivity(exercise: Exercise): Activity {
    return {
        ...exercise, // Копируем все поля Exercise (id, name, strength, type)
        sets: [], // Начальный пустой массив сетов
    };
}

/**
 * Создает тренировку из выбранных упражнений
 * @param exercises - массив выбранных упражнений (Exercise[])
 * @returns Workout с преобразованными упражнениями в Activity[]
 */
export function createWorkout(exercises: Exercise[]): Workout {
    // Преобразуем Exercise[] в Activity[]
    const activities: Activity[] = exercises.map(exerciseToActivity);
    
    return {
        id: uuidv4(),
        name: 'Training on ' + new Date().toLocaleDateString(),
        date: new Date().toISOString(),
        duration: '0:00', // Начальная длительность
        exercises: activities,
    };
}