import { Workout } from "@training-day/shared";
import { toast } from "./toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Базовый fetch с обработкой ошибок
 * credentials: 'include' позволяет отправлять cookies с каждым запросом
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            credentials: 'include', // Важно: отправляем cookies с каждым запросом
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Ошибка запроса к ${endpoint}`;
        toast.error(errorMessage);
        throw error;
    }
}

/**
 * Получить все тренировки
 */
export const getWorkouts = async () => {
    return fetchAPI('/workouts');
};

/**
 * Получить все упражнения
 */
export const getExercises = async () => {
    return fetchAPI('/exercises');
};

/**
 * Нормализует данные тренировки перед отправкой на сервер
 * Убирает лишние поля и гарантирует наличие обязательных
 */
function normalizeWorkoutForAPI(workout: Workout) {
    return {
        id: workout.id,
        name: workout.name,
        date: workout.date || new Date().toISOString(), // Если нет date, используем текущее время
        duration: workout.duration || '0:00', // Если нет duration, используем '0:00'
        exercises: workout.exercises || [],
    };
}

/**
 * Создать тренировку
 */
export const createWorkout = async (workout: Workout) => {
    try {
        // Нормализуем данные перед отправкой
        const normalizedWorkout = normalizeWorkoutForAPI(workout);
        
        const response = await fetch(`${API_BASE_URL}/workouts`, {
            method: 'POST',
            credentials: 'include', // Отправляем cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(normalizedWorkout),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Ошибка создания тренировки: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            toast.error(errorMessage);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        toast.success('Тренировка успешно создана');
        return await response.json();
    } catch (error) {
        if (error instanceof Error && !error.message.includes('API Error')) {
            toast.error(`Ошибка создания тренировки: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Обновить тренировку
 */
export const updateWorkout = async (id: string, workout: Workout) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
            method: 'PUT',
            credentials: 'include', // Отправляем cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workout),
        });
        
        if (!response.ok) {
            const errorMessage = `Ошибка обновления тренировки: ${response.status} ${response.statusText}`;
            toast.error(errorMessage);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        toast.success('Тренировка успешно обновлена');
        return await response.json();
    } catch (error) {
        if (error instanceof Error && !error.message.includes('API Error')) {
            toast.error(`Ошибка обновления тренировки: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Удалить тренировку
 */
export const deleteWorkout = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
            method: 'DELETE',
            credentials: 'include', // Отправляем cookies
        });
        
        if (!response.ok) {
            const errorMessage = `Ошибка удаления тренировки: ${response.status} ${response.statusText}`;
            toast.error(errorMessage);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        toast.success('Тренировка успешно удалена');
    } catch (error) {
        if (error instanceof Error && !error.message.includes('API Error')) {
            toast.error(`Ошибка удаления тренировки: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Отправить данные инициализации Telegram Mini App на сервер
 */
export const sendTelegramInitData = async (initDataRaw: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
            method: 'POST',
            credentials: 'include', // Важно: для получения cookies
            headers: {
                Authorization: `tma ${initDataRaw}`,
            },
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Ошибка авторизации: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorJson.details || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            toast.error(errorMessage);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error instanceof Error && !error.message.includes('API Error')) {
            toast.error(`Ошибка авторизации: ${error.message}`);
        }
        throw error;
    }
};