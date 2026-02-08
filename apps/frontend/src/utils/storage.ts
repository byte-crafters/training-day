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
 * Загружает текущую тренировку из localStorage.
 * Приводит duration и elapsedMs к number (на случай старых данных со строкой).
 */
export const loadCurrentWorkout = (): Workout | null => {
    try {
        const stored = localStorage.getItem(CURRENT_WORKOUT_KEY);
        if (stored) {
            const raw = JSON.parse(stored) as Record<string, unknown>;
            const duration =
                typeof raw.duration === "string"
                    ? parseInt(raw.duration, 10) || 0
                    : Number(raw.duration) || 0;
            const elapsedMs = raw.elapsedMs != null ? Number(raw.elapsedMs) || 0 : undefined;
            return { ...raw, duration, ...(elapsedMs !== undefined && { elapsedMs }) } as Workout;
        }
    } catch (error) {
        console.error('Failed to load current workout from localStorage:', error);
    }
    return null;
};
