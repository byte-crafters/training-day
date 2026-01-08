import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import WorkoutCard from "../../components/WorkoutCard";
import "./WorkoutTracker.scss";
import { useEffect, useState } from "react";
import { getExercises, getWorkouts } from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setExercises, setWorkouts } from "../../store";

interface Workout {
    date: string;
    name: string;
    duration: string;
}

function WorkoutTracker() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const workouts = useSelector((state) => {
        return state.workouts.slice(0, 3);
    });

    return (
        <Box className="workout-tracker">
            <Box component="header" className="workout-tracker__header">
                <Typography variant="h2" className="workout-tracker__title">
                    Workout Tracker
                </Typography>
            </Box>

            <Box component="main" className="workout-tracker__main">
                <Box className="workout-tracker__welcome-section">
                    <Button
                        variant="contained"
                        size="large"
                        className="workout-tracker__start-button"
                        onClick={() => navigate("/select-exercises")}
                    >
                        Start Training
                    </Button>
                </Box>

                <Box className="workout-tracker__workouts-section">
                    <Typography
                        variant="h5"
                        className="workout-tracker__section-title"
                    >
                        Recent Workouts
                    </Typography>
                    <Box className="workout-tracker__workouts-list">
                        {workouts.map((workout) => (
                            <WorkoutCard
                                key={workout.id}
                                date={workout.date}
                                name={workout.name}
                                duration={workout.duration}
                            />
                        ))}
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    fullWidth
                    className="workout-tracker__stats-button"
                >
                    View Stats →
                </Button>
            </Box>
        </Box>
    );
}

export default WorkoutTracker;
