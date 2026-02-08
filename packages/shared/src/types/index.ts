export interface Set {
    id: string;
    reps: number;
    weight: number;
    note: string | null;
}

export interface Exercise {
    id: string;
    name: string;
    strength: boolean;
    type: ExerciseType;
}

export interface Activity extends Exercise {
    sets: Set[];
}

export interface Workout {
    id: string;
    name: string;
    date: string; // ISO timestamp string (время создания тренировки)
    duration: number; // Длительность тренировки в секундах
    exercises: Activity[];
    /** Прошлое время таймера в мс (только для текущей тренировки в localStorage, на API не отправляется) */
    elapsedMs?: number;
}

export enum ExerciseType {
    CHEST = "chest",
    LEGS = "legs",
    BACK = "back",
    CARDIO = "cardio",
    SHOULDERS = "shoulders",
    ABS = "abs",
    TRICEPS = "triceps",
    BICEPS = "biceps",
    FOREARMS = "forearms",
    CALVES = "calves",
}

export interface Timer {
    startedAt: number | null;
    accumulated: number; //ms
}