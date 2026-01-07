import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import WorkoutCard from "../../components/WorkoutCard";
import "./WorkoutTracker.scss";

interface Workout {
    date: string;
    name: string;
    duration: string;
}

function WorkoutTracker() {
    const navigate = useNavigate();
    const recentWorkouts: Workout[] = [
        { date: "Mon, Apr 20", name: "Full Body Workout", duration: "45 mins" },
        { date: "Sat, Apr 18", name: "Cardio Session", duration: "30 mins" },
        { date: "Wed, Apr 16", name: "Upper Body", duration: "50 mins" },
    ];

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
                    <Typography variant="h5" className="workout-tracker__section-title">
                        Recent Workouts
                    </Typography>
                    <Box className="workout-tracker__workouts-list">
                        {recentWorkouts.map((workout, index) => (
                            <WorkoutCard
                                key={index}
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
