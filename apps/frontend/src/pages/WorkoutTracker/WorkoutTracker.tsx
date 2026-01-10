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
import { setWorkouts, setCurrentWorkout, useAppSelector, useAppDispatch, RootState } from "../../store";
import { Workout } from "@training-day/shared";

function WorkoutTracker() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isDismissed, setIsDismissed] = useState(false);

    const workouts = useAppSelector((state: RootState) => {
        return state.workouts.slice(0, 2);
    }); 

    const currentWorkout = useAppSelector((state: RootState) => {
        return state.currentWorkout;
    });

    useEffect(() => {
        console.log(workouts);

        console.log(currentWorkout);
    }, [currentWorkout, workouts]);

    const handleDeleteWorkout = () => {
        dispatch(setCurrentWorkout(null));
        setIsDismissed(true);
    };

    const handleDismissAndSave = async () => {
        if (!currentWorkout) {
            return;
        }

        // Сохраняем ссылку на тренировку перед очисткой
        const workoutToSave = currentWorkout;

        // Скрываем карточку и очищаем currentWorkout сразу
        setIsDismissed(true);
        dispatch(setCurrentWorkout(null));

        try {
            // Сохраняем тренировку в базу данных
            await createWorkoutAPI(workoutToSave);

            // Обновляем список тренировок
            const workouts = await getWorkouts();
            dispatch(setWorkouts(workouts));
        } catch (error) {
            console.error("Failed to save workout:", error);
            // Можно добавить уведомление об ошибке
        }
    };

    return (
        <Box className="workout-tracker">
            <Box component="header" className="workout-tracker__header">
                <Typography variant="h2" className="workout-tracker__title">
                    Workout Tracker
                </Typography>
            </Box>

            <Box component="main" className="workout-tracker__main">
                <Box className="workout-tracker__welcome-section">
                    <Button
                        variant="contained"
                        size="large"
                        className="workout-tracker__start-button"
                        onClick={() => navigate("/select-exercises")}
                    >
                        Start Training
                    </Button>
                </Box>

                {currentWorkout &&
                    currentWorkout.exercises?.length > 0 &&
                    !isDismissed && (
                        <ContinueWorkoutCard
                            workout={currentWorkout}
                            onDismiss={handleDismissAndSave}
                            onDelete={handleDeleteWorkout}
                        />
                    )}

                <Box className="workout-tracker__workouts-section">
                    <Typography
                        variant="h5"
                        className="workout-tracker__section-title"
                    >
                        Recent Workouts
                    </Typography>
                    <Box className="workout-tracker__workouts-list">
                        {workouts.map((workout: Workout) => (
                            <WorkoutCard
                                key={workout.id}
                                name={workout.name}
                                date={workout.date}
                                duration={workout.duration}
                            />
                        ))}
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    fullWidth
                    className="workout-tracker__stats-button"
                >
                    View Stats →
                </Button>
            </Box>
        </Box>
    );
}

export default WorkoutTracker;
