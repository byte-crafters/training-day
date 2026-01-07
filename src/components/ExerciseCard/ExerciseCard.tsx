import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./ExerciseCard.scss";

export interface ExerciseCardProps {
    exercise: {
        id: string;
        name: string;
        icon: string;
        totalSets: number;
        completedSets: number;
        currentSet: number;
    };
}

function ExerciseCard({ exercise }: ExerciseCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/exercise-detail", { state: { exercise } });
    };

    return (
        <Box className="exercise-card" onClick={handleClick} sx={{ cursor: "pointer" }}>
            <Box className="exercise-card__icon">{exercise.icon}</Box>
            <Box className="exercise-card__content">
                <Typography className="exercise-card__name">
                    {exercise.name}
                </Typography>
                <Typography className="exercise-card__status">
                    {exercise.completedSets} of {exercise.totalSets} sets completed
                </Typography>
            </Box>
            <Box className="exercise-card__progress">
                <Typography className="exercise-card__progress-text">
                    {exercise.currentSet} of {exercise.totalSets}
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
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </Box>
        </Box>
    );
}

export default ExerciseCard;

