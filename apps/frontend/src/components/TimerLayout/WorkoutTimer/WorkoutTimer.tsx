import { Box, SxProps, Typography, Theme } from "@mui/material";
import useTimer from "../../../hooks/use-timer";
import "./WorkoutTimer.scss";
import PausePlayButton from "../../PausePlayButton";

type TProps = {
    sx?: SxProps<Theme>;
};


export default function WorkoutTimer({ sx }: TProps) {
    const time = useTimer();

    return (
        <Box className="timer-panel"
            sx={sx}>
            <Box className="workout-timer">
                <Typography variant="body2" sx={{ color: 'white' }} className="workout-timer__label">
                    Time
                </Typography>
                <Typography component="h5" sx={{ fontSize: "20px" }} className="workout-timer__time" aria-live="polite">
                    {time}
                </Typography>
            </Box>
            <PausePlayButton />
        </Box>
    );
}
