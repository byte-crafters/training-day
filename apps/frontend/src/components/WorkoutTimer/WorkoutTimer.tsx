import { Box, Typography } from "@mui/material";
import useTimer from "../../hooks/use-timer";
import "./WorkoutTimer.scss";

export default function WorkoutTimer() {
    const time = useTimer();

    return (
        <Box className="workout-timer">
            <Typography component="div" className="workout-timer__time" aria-live="polite">
                {time}
            </Typography>
            <Typography component="span" className="workout-timer__label">
                Workout time
            </Typography>
        </Box>
    );
}
