import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, IconButton, Button, Typography } from "@mui/material";
import ExerciseList from "../../components/ExerciseList";
import "./MyWorkout.scss";

function MyWorkout() {
    const navigate = useNavigate();

    // Получаем текущую тренировку из Redux store
    const currentWorkout = useSelector((state: any) => state.currentWorkout);
    const workoutName = currentWorkout?.name || "My Workout";
    const hasExercises = currentWorkout?.exercises?.length > 0;

    // Если нет текущей тренировки или упражнений, перенаправляем обратно
    useEffect(() => {
        if (!currentWorkout || !hasExercises) {
            navigate("/select-exercises");
        }
    }, [currentWorkout, hasExercises, navigate]);

    return (
        <Box className="my-workout">
            <Box component="header" className="my-workout__header">
                <IconButton
                    className="my-workout__back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Back"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </IconButton>
                <Box className="my-workout__header-spacer" />
            </Box>

            {hasExercises && (
                <Box className="my-workout__name-section">
                    <Typography className="my-workout__name-text">
                        {workoutName}
                    </Typography>
                </Box>
            )}

            {hasExercises && (
                <Box component="main" className="my-workout__main">
                    {/* <Box className="my-workout__timer-section">
                        <Typography variant="h2" className="my-workout__timer">
                            {formatTime(elapsedTime)}
                        </Typography>
                        <Typography className="my-workout__timer-label">
                            Elapsed Time
                        </Typography>
                    </Box> */}

                    <Box className="my-workout__exercises-list">
                        <ExerciseList />
                    </Box>
                </Box>
            )}

            <Box className="my-workout__footer">
                <Button
                    variant="contained"
                    fullWidth
                    className="my-workout__finish-button"
                    onClick={() => navigate("/")}
                >
                    Finish Workout
                </Button>
            </Box>
        </Box>
    );
}

export default MyWorkout;

