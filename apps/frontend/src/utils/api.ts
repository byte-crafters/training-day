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
 * Создать тренировку
 */
export const createWorkout = async (workout: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts`, {
            method: 'POST',
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