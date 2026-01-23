import { Workout } from '@training-day/shared';

const CURRENT_WORKOUT_KEY = 'training-day:currentWorkout';

/**
 * Сохраняет текущую тренировку в localStorage
 */
export const saveCurrentWorkout = (workout: Workout | null): void => {
    try {
        if (workout) {
            localStorage.setItem(CURRENT_WORKOUT_KEY, JSON.stringify(workout));
        } else {
            localStorage.removeItem(CURRENT_WORKOUT_KEY);
        }
    } catch (error) {
        console.error('Failed to save current workout to localStorage:', error);
    }
};

/**
 * Загружает текущую тренировку из localStorage
 */
export const loadCurrentWorkout = (): Workout | null => {
    try {
        const stored = localStorage.getItem(CURRENT_WORKOUT_KEY);
        if (stored) {
            return JSON.parse(stored) as Workout;
        }
    } catch (error) {
        console.error('Failed to load current workout from localStorage:', error);
    }
    return null;
};

