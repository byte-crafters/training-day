import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import ExerciseCard from "../../components/ExerciseCard";
import "./MyWorkout.scss";

interface Exercise {
    id: string;
    name: string;
    icon: string;
    totalSets: number;
    completedSets: number;
    currentSet: number;
}

interface SelectedExercise {
    id: string;
    name: string;
    selected: boolean;
}

// Маппинг имен упражнений на иконки
const exerciseIcons: Record<string, string> = {
    "Push-Ups": "💪",
    "Dumbbell Bench Press": "🏋️",
    "Pull-Ups": "🔼",
    "Lat Pulldown": "🔽",
    "Squats": "🦵",
    "Lunges": "🚶",
    "Plank": "🧘",
};

// Маппинг имен упражнений на количество сетов по умолчанию
const defaultSets: Record<string, number> = {
    "Push-Ups": 3,
    "Dumbbell Bench Press": 3,
    "Pull-Ups": 3,
    "Lat Pulldown": 3,
    "Squats": 2,
    "Lunges": 2,
    "Plank": 3,
};

function MyWorkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [elapsedTime, setElapsedTime] = useState(5); // в секундах

    // Получаем выбранные упражнения из state или используем пустой массив
    const selectedExercises =
        (location.state as { exercises?: SelectedExercise[] })?.exercises || [];

    // Преобразуем выбранные упражнения в формат для отображения
    const exercises: Exercise[] = selectedExercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        icon: exerciseIcons[exercise.name] || "💪",
        totalSets: defaultSets[exercise.name] || 3,
        completedSets: 0,
        currentSet: 1,
    }));

    // Если нет выбранных упражнений, перенаправляем обратно
    useEffect(() => {
        if (exercises.length === 0) {
            navigate("/select-exercises");
        }
    }, [exercises.length, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <Box className="my-workout">
            <Box component="header" className="my-workout__header">
                <IconButton
                    className="my-workout__back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Back"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </IconButton>
                <Typography variant="h4" className="my-workout__title">
                    My Workout
                </Typography>
                <Box className="my-workout__header-spacer" />
            </Box>

            {exercises.length > 0 && (
                <Box component="main" className="my-workout__main">
                    <Box className="my-workout__timer-section">
                        <Typography variant="h2" className="my-workout__timer">
                            {formatTime(elapsedTime)}
                        </Typography>
                        <Typography className="my-workout__timer-label">
                            Elapsed Time
                        </Typography>
                    </Box>

                    <Box className="my-workout__exercises-list">
                        {exercises.map((exercise) => (
                            <ExerciseCard key={exercise.id} exercise={exercise} />
                        ))}
                    </Box>
                </Box>
            )}

            <Box className="my-workout__footer">
                <Button
                    variant="contained"
                    fullWidth
                    className="my-workout__finish-button"
                    onClick={() => navigate("/")}
                >
                    Finish Workout
                </Button>
            </Box>
        </Box>
    );
}

export default MyWorkout;

