import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector, pauseTimer, startTimer } from "../../store";
import "./PausePlayButton.scss";

interface PausePlayButtonProps {
    className?: string;
}

export default function PausePlayButton({ className = "" }: PausePlayButtonProps) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const timer = useAppSelector((state) => state.timer);
    const isRunning = !!timer.startedAt;

    return (
        <IconButton
            className={`pause-play-button ${className}`.trim()}
            onClick={() =>
                isRunning ? dispatch(pauseTimer()) : dispatch(startTimer())
            }
            aria-label={isRunning ? "Pause workout" : "Resume workout"}
            sx={{ color: theme.palette.primary.main }}
        >
            {isRunning ? (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
            ) : (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M8 5v14l11-7z" />
                </svg>
            )}
        </IconButton>
    );
}
