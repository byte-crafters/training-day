import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./ExerciseCard.scss";
import { useFirstWorkoutEvents } from "../../features/first-workout/model/use-first-workout-events";

export interface ExerciseCardProps {
    exercise: {
        id: string;
        name: string;
        icon: string;
        totalSets: number;
        completedSets: number;
        currentSet: number;
    },
    index: number;
}

function ExerciseCard({ exercise, index }: ExerciseCardProps) {
    const navigate = useNavigate();
    const { setOpened } = useFirstWorkoutEvents();

    const handleClick = () => {
        navigate("/exercise-detail", { state: { exercise } });
    };

    return (
        <Box id={index === 0 ? 'set-panel' : undefined}
            className="exercise-card" onClick={() => {
                setOpened();
                handleClick();
            }} sx={{ cursor: "pointer" }}>
            <Box className="exercise-card__content">
                <Typography className="exercise-card__name">
                    {exercise.name}
                </Typography>
                <Typography className="exercise-card__status">
                    {exercise.completedSets} sets completed
                </Typography>
            </Box>
            <Box className="exercise-card__action">
                <Typography className="exercise-card__action-text">
                    {exercise.completedSets > 0 ? "Continue" : "Start"}
                </Typography>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="exercise-card__arrow"
                >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </Box>
        </Box >
    );
}

export default ExerciseCard;

