import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Workout } from "@training-day/shared";
import "./ContinueWorkoutCard.scss";

interface ContinueWorkoutCardProps {
    workout: Workout;
    onDismiss: () => void;
    onDelete: () => void;
}

function ContinueWorkoutCard({ workout, onDismiss, onDelete }: ContinueWorkoutCardProps) {
    const navigate = useNavigate();

    // Берем максимум 3 упражнения
    const exercisesToShow = workout.exercises.slice(0, 3);
    const exerciseNames = exercisesToShow.map((ex) => ex.name);

    return (
        <Box className="continue-workout-card">
            <Box className="continue-workout-card__card">
                <IconButton
                    className="continue-workout-card__close-button"
                    onClick={onDismiss}
                    aria-label="Dismiss"
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
                <Typography className="continue-workout-card__title">
                    Unfinished Business
                </Typography>
                <Typography className="continue-workout-card__name">
                    {workout.name}
                </Typography>
                <Box className="continue-workout-card__exercises">
                    {exerciseNames.map((name, index) => (
                        <Box key={index} className="continue-workout-card__exercise-item">
                            <Typography className="continue-workout-card__exercise-name">
                                {name}
                            </Typography>
                            {index < exerciseNames.length - 1 && (
                                <Typography className="continue-workout-card__exercise-separator">
                                    •
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
                <Box className="continue-workout-card__buttons">
                    <Button
                        variant="contained"
                        className="continue-workout-card__continue-button"
                        onClick={() => navigate("/my-workout")}
                    >
                        Continue
                    </Button>
                    <Button
                        variant="outlined"
                        className="continue-workout-card__delete-button"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ContinueWorkoutCard;

