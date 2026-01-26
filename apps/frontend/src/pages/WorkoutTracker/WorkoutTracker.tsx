import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import WorkoutCard from "../../components/WorkoutCard";
import ContinueWorkoutCard from "../../components/ContinueWorkoutCard";
import "./WorkoutTracker.scss";
import { useState } from "react";
import {
    getWorkouts,
    createWorkout as createWorkoutAPI,
} from "../../utils/api";
import { setWorkouts, setCurrentWorkout, useAppSelector, useAppDispatch, RootState } from "../../store";
import { Workout } from "@training-day/shared";

function WorkoutTracker() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isDismissed, setIsDismissed] = useState(false);
    const [showStartDialog, setShowStartDialog] = useState(false);

    const workouts = useAppSelector((state: RootState) => {
        return state.workouts.slice(0, 2);
    });

    const currentWorkout = useAppSelector((state: RootState) => state.currentWorkout);

    const handleDeleteWorkout = () => {
        dispatch(setCurrentWorkout(null));
        setIsDismissed(true);
    };

    const handleDismissAndSave = async () => {
        if (!currentWorkout) {
            return;
        }

        // Скрываем карточку
        setIsDismissed(true);

        try {
            // Сохраняем тренировку в базу данных
            await createWorkoutAPI(currentWorkout);

            // Обновляем список тренировок
            const workouts = await getWorkouts();
            dispatch(setWorkouts(workouts));

            // Очищаем currentWorkout только после успешного сохранения
            dispatch(setCurrentWorkout(null));
        } catch (error) {
            console.error("Failed to save workout:", error);
            // При ошибке показываем карточку снова, чтобы пользователь мог попробовать еще раз
            setIsDismissed(false);
            // Можно добавить уведомление об ошибке
        }
    };

    const handleStartTraining = () => {
        // Если есть текущая тренировка, показываем диалог выбора
        if (currentWorkout && currentWorkout.exercises?.length > 0) {
            setShowStartDialog(true);
        } else {
            // Если нет текущей тренировки, сразу переходим к выбору упражнений
            navigate("/select-exercises");
        }
    };

    const handleContinueWorkout = () => {
        setShowStartDialog(false);
        navigate("/my-workout");
    };

    const handleCreateNewWorkout = () => {
        setShowStartDialog(false);
        dispatch(setCurrentWorkout(null));
        navigate("/select-exercises");
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
                        onClick={handleStartTraining}
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

                {currentWorkout &&
                    currentWorkout.exercises?.length > 0 &&
                    !isDismissed && (
                        <Box className="workout-tracker__in-progress-section">
                            <Box className="workout-tracker__section-header">
                                <Typography variant="h5" color='text.secondary' className="workout-tracker__section-title">
                                    In progress
                                </Typography>
                                <Box className="workout-tracker__status-dot" />
                            </Box>
                            <ContinueWorkoutCard
                                workout={currentWorkout}
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

            <Dialog
                open={showStartDialog}
                onClose={() => setShowStartDialog(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                    }
                }}
            >
                <DialogTitle sx={{ color: '#ffffff' }}>
                    You have an unfinished workout
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#ffffff', mb: 2 }}>
                        Do you want to continue the current workout or create a new one?
                    </Typography>
                    {currentWorkout && (
                        <Typography variant="body2" sx={{ color: '#aaaaaa' }}>
                            Current workout: {currentWorkout.name || 'No name'}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={handleCreateNewWorkout}
                        variant="outlined"
                        sx={{
                            color: '#ffffff',
                            borderColor: '#ffffff',
                            '&:hover': {
                                borderColor: '#ffffff',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        Start a new one
                    </Button>
                    <Button
                        onClick={handleContinueWorkout}
                        variant="contained"
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        }}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default WorkoutTracker;
