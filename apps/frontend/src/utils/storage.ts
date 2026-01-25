import { Workout } from '@training-day/shared';

const CURRENT_WORKOUT_KEY = 'training-day:currentWorkout';
const UNSAVED_WORKOUT_KEY = 'training-day:unsavedWorkout';

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

/**
 * Сохраняет несохраненную тренировку в localStorage
 */
export const saveUnsavedWorkout = (workout: Workout | null): void => {
    try {
        if (workout) {
            localStorage.setItem(UNSAVED_WORKOUT_KEY, JSON.stringify(workout));
        } else {
            localStorage.removeItem(UNSAVED_WORKOUT_KEY);
        }
    } catch (error) {
        console.error('Failed to save unsaved workout to localStorage:', error);
    }
};

/**
 * Загружает несохраненную тренировку из localStorage
 */
export const loadUnsavedWorkout = (): Workout | null => {
    try {
        const stored = localStorage.getItem(UNSAVED_WORKOUT_KEY);
        if (stored) {
            return JSON.parse(stored) as Workout;
        }
    } catch (error) {
        console.error('Failed to load unsaved workout from localStorage:', error);
    }
    return null;
};
