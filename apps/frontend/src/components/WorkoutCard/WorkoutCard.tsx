import { Box, Typography } from "@mui/material"; 
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import "./WorkoutCard.scss";

import formatTimerHMS from "../../utils/time";

export interface WorkoutCardProps {
    name: string;
    date: string; // ISO timestamp string (время создания)
    duration: number; // длительность в секундах
    onClick?: () => void;
}

function WorkoutCard({ name, date, duration, onClick }: WorkoutCardProps) {
    const workoutDate = new Date(date);
    const formattedDate = workoutDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    return (
        <Box
            className="workout-card"
            onClick={onClick}
            sx={{ cursor: "pointer" }}
        >
            <Box className="workout-card__icon">
               <FitnessCenterIcon />
            </Box>
            <Box className="workout-card__content">
                <Typography variant="h4" className="workout-card__name">{name}</Typography>
                <Typography variant="body2" className="workout-card__date">{formattedDate}</Typography>
            </Box>
            <Box className="workout-card__right">
                <Typography variant="body2" color='text.secondary' className="workout-card__duration">
                    {formatTimerHMS(duration)}
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
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </Box>
        </Box>
    );
}

export default WorkoutCard;
