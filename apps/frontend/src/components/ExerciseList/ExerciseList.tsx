import { Box } from "@mui/material";
import ExerciseCard from "../ExerciseCard";
import { Activity } from "@training-day/shared";
import "./ExerciseList.scss";
import { RootState, useAppSelector } from "../../store";

export interface Exercise {
    id: string;
    name: string;
    icon: string;
    totalSets: number;
    completedSets: number;
    currentSet: number;
}

// Маппинг имен упражнений на количество сетов по умолчанию
const defaultSets: Record<string, number> = {
    "Push-Ups": 3,
    "Dumbbell Bench Press": 3,
    "Pull-Ups": 3,
    "Lat Pulldown": 3,
    "Squats": 2,
    "Lunges": 2,
    "Plank": 3,
    "Bench Press": 3,
    "Deadlift": 3,
    "Running": 1,
};

function ExerciseList() {
    // Получаем currentWorkout из Redux store
    const currentWorkout = useAppSelector((state: RootState) => state.currentWorkout);
    const activities: Activity[] = currentWorkout?.exercises || [];

    // Преобразуем Activity[] в формат для отображения
    const exercises: Exercise[] = activities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        icon: "",
        totalSets: defaultSets[activity.name] || 3,
        completedSets: activity.sets.length,
        currentSet: activity.sets.length > 0 ? activity.sets.length + 1 : 1,
    }));

    if (exercises.length === 0) {
        return null;
    }

    return (
        <Box className="exercise-list">
            {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
        </Box>
    );
}

export default ExerciseList;

