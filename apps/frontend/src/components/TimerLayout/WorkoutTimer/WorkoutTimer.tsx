import { Box, SxProps, Typography, Theme } from "@mui/material";
import useTimer from "../../../hooks/use-timer";
import "./WorkoutTimer.scss";
import PausePlayButton from "../../PausePlayButton";
import { useEffect } from "react";
import { setTimerFromWorkout, startTimer, store, useAppDispatch } from "../../../store";
import { loadCurrentWorkout, saveCurrentWorkout } from "../../../utils/storage";

type TProps = {
    sx?: SxProps<Theme>;
};


export default function WorkoutTimer({ sx }: TProps) {
    const time = useTimer();
    const dispatch = useAppDispatch();

    useEffect(() => {

        const loadTimer = () => {
            const workout = loadCurrentWorkout();
            if (workout) {
                dispatch(setTimerFromWorkout(workout));
            }
        }

        const saveWorkoutWithElapsedBeforeUnload = () => {
            const state = store.getState();
            if (!state.currentWorkout) return;
            const elapsedMs =
                state.timer.accumulated +
                (state.timer.startedAt ? Date.now() - state.timer.startedAt : 0);
            if (elapsedMs > 0) {
                saveCurrentWorkout({ ...state.currentWorkout, elapsedMs });
            }
        };

        loadTimer()
        dispatch(startTimer());

        return () => {
            saveWorkoutWithElapsedBeforeUnload();
        };
    }, [])

    return (
        <Box className="timer-panel"
            sx={sx}>
            <Box className="workout-timer">
                <Typography variant="body2" sx={{ color: 'white' }} className="workout-timer__label">
                    Time
                </Typography>
                <Typography component="h5" sx={{ fontSize: "20px", color: 'white' }} className="workout-timer__time" aria-live="polite">
                    {time}
                </Typography>
            </Box>
            <PausePlayButton />
        </Box>
    );
}
