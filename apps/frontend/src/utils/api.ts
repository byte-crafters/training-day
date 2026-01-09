const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Базовый fetch с обработкой ошибок
 */
async function fetchAPI(endpoint: string) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
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
function normalizeWorkoutForAPI(workout: any) {
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
export const createWorkout = async (workout: any) => {
    try {
        // Нормализуем данные перед отправкой
        const normalizedWorkout = normalizeWorkoutForAPI(workout);
        
        console.log('Sending workout to backend:', JSON.stringify(normalizedWorkout, null, 2));
        
        const response = await fetch(`${API_BASE_URL}/workouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(normalizedWorkout),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error response:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to create workout:', error);
        throw error;
    }
};

/**
 * Обновить тренировку
 */
export const updateWorkout = async (id: string, workout: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workout),
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to update workout:', error);
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
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Failed to delete workout:', error);
        throw error;
    }
};