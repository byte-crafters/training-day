import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Button, Typography, CircularProgress } from "@mui/material";
import ExerciseList from "../../components/ExerciseList";
import "./MyWorkout.scss";
import { setCurrentWorkout, setWorkouts } from "../../store";
import { createWorkout as createWorkoutAPI, getWorkouts } from "../../utils/api";

function MyWorkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Получаем текущую тренировку из Redux store
    const currentWorkout = useSelector((state: any) => state.currentWorkout);
    const workoutName = currentWorkout?.name || "My Workout";
    const hasExercises = currentWorkout?.exercises?.length > 0;
    const [isSaving, setIsSaving] = useState(false);

    // Если нет текущей тренировки или упражнений, перенаправляем обратно
    useEffect(() => {
        if (!currentWorkout || !hasExercises) {
            navigate("/select-exercises");
        }
    }, [currentWorkout, hasExercises, navigate]);

    const handleFinishWorkout = async () => {
        if (!currentWorkout) {
            return;
        }

        setIsSaving(true);
        try {
            // Сохраняем тренировку в базу данных
            await createWorkoutAPI(currentWorkout);
            
            // Обновляем список тренировок
            const workouts = await getWorkouts();
            dispatch(setWorkouts(workouts));
            
            // Очищаем текущую тренировку
            dispatch(setCurrentWorkout(null));
            
            // Переходим на главную страницу
            navigate("/");
        } catch (error) {
            console.error("Failed to finish workout:", error);
            // Можно добавить уведомление об ошибке
        } finally {
            setIsSaving(false);
        }
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
                <Box className="my-workout__header-spacer" />
            </Box>

            {hasExercises && (
                <Box className="my-workout__name-section">
                    <Typography className="my-workout__name-text">
                        {workoutName}
                    </Typography>
                </Box>
            )}

            {hasExercises && (
                <Box component="main" className="my-workout__main">
                    {/* <Box className="my-workout__timer-section">
                        <Typography variant="h2" className="my-workout__timer">
                            {formatTime(elapsedTime)}
                        </Typography>
                        <Typography className="my-workout__timer-label">
                            Elapsed Time
                        </Typography>
                    </Box> */}

                    <Box className="my-workout__add-exercises-section">
                        <Button
                            variant="outlined"
                            fullWidth
                            className="my-workout__add-exercises-button"
                            onClick={() => navigate("/select-exercises")}
                        >
                            Add Exercises
                        </Button>
                    </Box>

                    <Box className="my-workout__exercises-list">
                        <ExerciseList />
                    </Box>
                </Box>
            )}

            <Box className="my-workout__footer">
                <Button
                    variant="contained"
                    fullWidth
                    className="my-workout__finish-button"
                    onClick={handleFinishWorkout}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Saving...
                        </>
                    ) : (
                        "Finish Workout"
                    )}
                </Button>
            </Box>
        </Box>
    );
}

export default MyWorkout;

