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
                <Typography variant="h4" className="workout-tracker__title">
                    Workout Tracker
                </Typography>
                <IconButton
                    className="workout-tracker__menu-button"
                    aria-label="Menu"
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
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </IconButton>
            </Box>

            <Box component="main" className="workout-tracker__main">
                <Box className="workout-tracker__welcome-section">
                    <Typography variant="h3" className="workout-tracker__greeting">
                        Welcome Back!
                    </Typography>
                    <Typography className="workout-tracker__subtitle">
                        Ready to train?
                    </Typography>
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
