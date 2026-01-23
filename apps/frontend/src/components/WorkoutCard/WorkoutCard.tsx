import { Box, Typography } from "@mui/material";
import "./WorkoutCard.scss";

export interface WorkoutCardProps {
    name: string;
    date: string; // ISO timestamp string (время создания)
    duration: string; // Длительность тренировки
    onClick?: () => void;
}

function WorkoutCard({ name, date, duration, onClick }: WorkoutCardProps) {
    
    const workoutDate = new Date(date);
    const formattedDate = workoutDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    return (
        <Box 
            className="workout-card" 
            onClick={onClick}
            sx={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <Typography className="workout-card__date">{formattedDate}</Typography>
            <Box className="workout-card__content">
                <Typography className="workout-card__name">{name}</Typography>
                <Typography className="workout-card__duration">
                    {duration}
                </Typography>
            </Box>
        </Box>
    );
}

export default WorkoutCard;
