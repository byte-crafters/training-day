import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Card } from "@mui/material";
import { Activity, Workout, ExerciseType } from "@training-day/shared";
import "./WorkoutResults.scss";
import { useAppSelector, RootState } from "../../store";
import { useEffect, useState } from "react";
import { logAnalyticsEvent } from "../../utils/firebase";
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, ANALYTICS_PARAMS } from "../../utils/analytics";
import formatTimerHMS from "../../utils/time";

// Функция для форматирования времени начала тренировки
const formatStartTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours}:${displayMinutes} ${ampm}`;
};

// Функция для получения названия группы мышц
const getMuscleGroupName = (type: ExerciseType): string => {
    const names: Record<ExerciseType, string> = {
        [ExerciseType.CHEST]: "Chest",
        [ExerciseType.LEGS]: "Legs",
        [ExerciseType.BACK]: "Back",
        [ExerciseType.CARDIO]: "Cardio",
        [ExerciseType.SHOULDERS]: "Shoulders",
        [ExerciseType.ABS]: "Abs",
        [ExerciseType.TRICEPS]: "Triceps",
        [ExerciseType.BICEPS]: "Biceps",
        [ExerciseType.FOREARMS]: "Forearms",
        [ExerciseType.CALVES]: "Calves",
    };
    return names[type] || type;
};

function WorkoutResults() {
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем тренировку из location.state или из store
    const workoutFromState = (location.state as { workout?: Workout })?.workout;
    const currentWorkout = useAppSelector((state: RootState) => state.currentWorkout);

    const [workout, _setWorkout] = useState<Workout | null>(workoutFromState || currentWorkout);

    useEffect(() => {
        if (workout) {
            logAnalyticsEvent(ANALYTICS_EVENTS.SCREEN_VIEW, {
                [ANALYTICS_PARAMS.SCREEN_NAME]: ANALYTICS_SCREENS.WORKOUT_RESULTS,
                [ANALYTICS_PARAMS.WORKOUT_ID]: workout.id,
            });
        }
    }, [workout?.id]);

    useEffect(() => {
        if (!workout) {
            navigate("/");
        }
    }, [workout, navigate]);

    if (!workout) {
        return null;
    }

    const startTime = formatStartTime(workout.date);
    const durationFormatted = formatTimerHMS(workout.duration ?? 0);

    return (
        <Box className="workout-results">
            <Box className="workout-results__sticky-header">
                <Box component="header" className="workout-results__header">
                    <Box className="workout-results__title-row">
                        <Typography variant="h4" className="workout-results__title">
                            {workout.name}
                        </Typography>
                    </Box>
                </Box>

                <Box className="workout-results__title-section">
                    <Box className="workout-results__metadata">
                        <Typography variant="body2" className="workout-results__start-time">
                            Started at {startTime}
                        </Typography>
                        <Typography variant="body2" className="workout-results__duration">
                            Total duration: {durationFormatted}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box component="main" className="workout-results__main">
                {workout.exercises.map((exercise: Activity) => (
                    <Card
                        key={exercise.id}
                        className="workout-results__exercise-card"
                        variant="outlined"
                    >
                        <Box className="workout-results__exercise-header">
                            <Typography variant="h6" className="workout-results__exercise-name">
                                {exercise.name}
                            </Typography>
                            <Typography variant="body2" className="workout-results__muscle-group">
                                {getMuscleGroupName(exercise.type)}
                            </Typography>
                        </Box>

                        {exercise.sets.length > 0 && (
                            <>
                                <Box className="workout-results__sets-header">
                                    <Typography variant="caption" className="workout-results__set-label">
                                        Set
                                    </Typography>
                                    <Typography variant="caption" className="workout-results__reps-label">
                                        Reps
                                    </Typography>
                                    <Typography variant="caption" className="workout-results__weight-label">
                                        Weight
                                    </Typography>
                                </Box>

                                <Box className="workout-results__sets-list">
                                    {exercise.sets.map((set, index) => (
                                        <Box key={set.id} className="workout-results__set-row">
                                            <Typography variant="body2" className="workout-results__set-number">
                                                {index + 1}
                                            </Typography>
                                            <Typography variant="body2" className="workout-results__set-reps">
                                                {set.reps}
                                            </Typography>
                                            <Typography variant="body2" className="workout-results__set-weight">
                                                {set.weight > 0 ? `${set.weight}kg` : "-"}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )}
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default WorkoutResults;
