import { Box, Typography } from "@mui/material";
import "./WorkoutCard.scss";

export interface WorkoutCardProps {
    date: string;
    name: string;
    duration: string;
}

function WorkoutCard({ date, name, duration }: WorkoutCardProps) {
    return (
        <Box className="workout-card">
            <Typography className="workout-card__date">{date}</Typography>
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
