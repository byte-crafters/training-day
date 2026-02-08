import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Workout } from "@training-day/shared";
import "./ContinueWorkoutCard.scss";
import formatTimerHMS from "../../utils/time";
import { useAppDispatch, setTimerFromWorkout } from "../../store";

interface ContinueWorkoutCardProps {
    workout: Workout;
    onDismiss: () => void;
    onDelete: () => void;
}

function ContinueWorkoutCard({ workout, onDismiss, onDelete }: ContinueWorkoutCardProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Вычисляем количество оставшихся упражнений
    const completedExercises = workout.exercises?.filter(
        (ex) => ex.sets && ex.sets.length > 0
    ).length || 0;
    const totalExercises = workout.exercises?.length || 0;
    const remainingExercises = totalExercises - completedExercises;

    const elapsedSeconds =
        workout.elapsedMs != null
            ? Math.floor(workout.elapsedMs / 1000)
            : workout.duration;
    const elapsedTime = formatTimerHMS(elapsedSeconds);

    return (
        <Box className="continue-workout-card">
            <Box className="continue-workout-card__card">
                <Box className="continue-workout-card__accent-line" />
                <Box className="continue-workout-card__header">
                    <Typography variant="h4" color='main' className="continue-workout-card__name">
                        {workout.name}
                    </Typography>
                    <IconButton
                        className="continue-workout-card__close-button"
                        onClick={onDismiss}
                        aria-label="Close"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </IconButton>
                </Box>
                <Typography variant="body2" color='text.secondary' className="continue-workout-card__info">
                    {elapsedTime} elapsed • {remainingExercises} exercises left
                </Typography>
                <Box className="continue-workout-card__buttons">
                    <Button
                        variant="contained"
                        size="small"
                        color="info"
                        sx={{ fontSize: "0.7rem", textTransform: "none", fontWeight: 600 }}
                        className="continue-workout-card__continue-button"
                        onClick={() => {
                            dispatch(setTimerFromWorkout(workout));
                            navigate("/my-workout");
                        }}
                        startIcon={
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        }
                    >
                        Continue
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        className="continue-workout-card__delete-button"
                        onClick={onDelete}
                        sx={{
                            display: 'flex',
                            padding: '15px 10px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        startIcon={
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        }
                    >
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ContinueWorkoutCard;

