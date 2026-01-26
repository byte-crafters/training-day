import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import WorkoutCard from "../../components/WorkoutCard";
import ContinueWorkoutCard from "../../components/ContinueWorkoutCard";
import "./WorkoutTracker.scss";
import { useEffect, useState } from "react";
import {
    getWorkouts,
    createWorkout as createWorkoutAPI,
} from "../../utils/api";
import { setWorkouts, useAppSelector, useAppDispatch, RootState } from "../../store";
import { Workout } from "@training-day/shared";
import { loadUnsavedWorkout, saveUnsavedWorkout } from "../../utils/storage";

function WorkoutTracker() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isDismissed, setIsDismissed] = useState(false);
    const [unsavedWorkout, setUnsavedWorkout] = useState<Workout | null>(null);

    const workouts = useAppSelector((state: RootState) => {
        return state.workouts.slice(0, 2);
    });

    // Загружаем unsavedWorkout из localStorage при монтировании
    useEffect(() => {
        const workout = loadUnsavedWorkout();
        setUnsavedWorkout(workout);
    }, []);

    const handleDeleteWorkout = () => {
        saveUnsavedWorkout(null);
        setUnsavedWorkout(null);
        setIsDismissed(true);
    };

    const handleDismissAndSave = async () => {
        if (!unsavedWorkout) {
            return;
        }

        // Скрываем карточку
        setIsDismissed(true);

        try {
            // Сохраняем тренировку в базу данных
            await createWorkoutAPI(unsavedWorkout);

            // Обновляем список тренировок
            const workouts = await getWorkouts();
            dispatch(setWorkouts(workouts));

            // Очищаем unsavedWorkout только после успешного сохранения
            saveUnsavedWorkout(null);
            setUnsavedWorkout(null);
        } catch (error) {
            console.error("Failed to save workout:", error);
            // При ошибке показываем карточку снова, чтобы пользователь мог попробовать еще раз
            setIsDismissed(false);
            // Можно добавить уведомление об ошибке
        }
    };

    return (
        <Box className="workout-tracker">
            <Box component="header" className="workout-tracker__header">
                <Typography variant="h1" color='main' className="workout-tracker__hub-label">
                    Training Day
                </Typography>
                <Typography variant="h2" className="workout-tracker__title">
                    Dashboard
                </Typography>
            </Box>

            <Box component="main" className="workout-tracker__main">
                <Box className="workout-tracker__welcome-section">
                    <Button
                        variant="contained"
                        size="large"
                        className="workout-tracker__start-button"
                        onClick={() => navigate("/select-exercises")}
                        startIcon={
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        }
                    >
                        Start training
                    </Button>
                </Box>

                {unsavedWorkout &&
                    unsavedWorkout.exercises?.length > 0 &&
                    !isDismissed && (
                        <Box className="workout-tracker__in-progress-section">
                            <Box className="workout-tracker__section-header">
                                <Typography variant="h5" color='text.secondary' className="workout-tracker__section-title">
                                    In progress
                                </Typography>
                                <Box className="workout-tracker__status-dot" />
                            </Box>
                            <ContinueWorkoutCard
                                workout={unsavedWorkout}
                                onDismiss={handleDismissAndSave}
                                onDelete={handleDeleteWorkout}
                            />
                        </Box>
                    )}

                <Box className="workout-tracker__workouts-section">
                    <Box className="workout-tracker__section-header">
                        <Typography variant="h5" color='text.secondary' className="workout-tracker__section-title">
                            Recent activity
                        </Typography>
                        <Typography variant="h5" color='main' className="workout-tracker__see-all">
                            See all
                        </Typography>
                    </Box>
                    <Box className="workout-tracker__workouts-list">
                        {workouts.map((workout: Workout) => (
                            <WorkoutCard
                                key={workout.id}
                                name={workout.name}
                                date={workout.date}
                                duration={workout.duration}
                                onClick={() => {
                                    navigate("/workout-results", { state: { workout } });
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default WorkoutTracker;
