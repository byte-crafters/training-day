import { Workout } from "@training-day/shared";
import { toast } from "./toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Получить initData из sessionStorage
 * Используем initDataRaw из useRawInitData(), который сохраняется в sessionStorage['initData']
 * Это гарантирует, что hash параметр присутствует и валидация пройдет успешно
 */
function getInitData(): string | null {
    try {
        // Используем initDataRaw, сохраненный в App.tsx из useRawInitData()
        // Это гарантирует полный initData с hash параметром
        const initData = sessionStorage.getItem('initData');
        if (initData && initData.length > 0) {
            // Проверяем наличие hash для отладки
            if (initData.includes('hash=')) {
                return initData;
            } else {
                console.warn('⚠️ getInitData: initData found but hash parameter missing');
                return initData;
            }
        }
    } catch (e) {
        console.warn('Failed to read initData from sessionStorage:', e);
    }
    
    return null;
}

/**
 * Базовый fetch с обработкой ошибок
 * Автоматически добавляет initData в заголовок Authorization для авторизации
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    try {
        // Преобразуем options.headers в объект для удобной работы
        const existingHeaders = options.headers as Record<string, string> | undefined;
        
        // Используем Record<string, string> для корректной типизации заголовков
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...existingHeaders,
        };
        
        // Добавляем Authorization заголовок с initData, только если он еще не установлен
        // Это позволяет переопределить initData, передав Authorization в options.headers
        if (!headers['Authorization']) {
            const initData = getInitData();
            if (initData) {
                headers['Authorization'] = `tma ${initData}`;
            }
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            // credentials больше не нужен, так как не используем cookies
            // credentials: 'include',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorJson.details || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            
            // Для 401 ошибок показываем более понятное сообщение
            if (response.status === 401) {
                errorMessage = 'Требуется авторизация. Пожалуйста, обновите страницу.';
            }
            
            toast.error(errorMessage);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error instanceof Error && !error.message.includes('API Error')) {
            const errorMessage = error.message || `Ошибка запроса к ${endpoint}`;
            toast.error(errorMessage);
        }
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
    // Нормализуем данные перед отправкой
    const normalizedWorkout = normalizeWorkoutForAPI(workout);
    
    const result = await fetchAPI('/workouts', {
        method: 'POST',
        body: JSON.stringify(normalizedWorkout),
    });
    
    toast.success('Тренировка успешно создана');
    return result;
};

/**
 * Обновить тренировку
 */
export const updateWorkout = async (id: string, workout: Workout) => {
    const result = await fetchAPI(`/workouts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(workout),
    });
    
    toast.success('Тренировка успешно обновлена');
    return result;
};

/**
 * Удалить тренировку
 */
export const deleteWorkout = async (id: string) => {
    await fetchAPI(`/workouts/${id}`, {
        method: 'DELETE',
    });
    
    toast.success('Тренировка успешно удалена');
};

/**
 * Отправить данные инициализации Telegram Mini App на сервер
 * Используется для создания/обновления пользователя в БД
 * Обычно вызывается один раз при инициализации приложения
 */
export const sendTelegramInitData = async (initDataRaw: string) => {
    return fetchAPI('/auth/telegram', {
        method: 'POST',
        headers: {
            Authorization: `tma ${initDataRaw}`,
        },
    });
};