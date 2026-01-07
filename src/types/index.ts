export interface Set {
    id: string;
    reps: number;
    weight: number;
}

export interface Activity {
    id: string;
    name: string;
    sets: Set[];
}

export interface Workout {
    id: string;
    name: string;
    date: string;
    duration: string;
    exercises: Activity[];
}

export interface Exercise {
    id: string;
    name: string;
    strength: boolean;
    type: ExerciseType;
}

export enum ExerciseType {
    CHEST = "chest",
    LEGS = "legs",
    BACK = "back",
    CARDIO = "cardio",
}