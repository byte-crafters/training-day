import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Activity, Workout } from "@training-day/shared";
import "./WorkoutResults.scss";
import { useAppSelector, RootState } from "../../store";
import { useEffect, useState } from "react";
import { logAnalyticsEvent } from "../../utils/firebase";
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, ANALYTICS_PARAMS } from "../../utils/analytics";
import useHeader from "../../hooks/use-header";
import formatDate from "../../utils/date";
import WorkoutRecords from "../../components/WorkoutRecords";
import ActivityResultCard from "../../components/ActivityResultCard";
import MuscleRadarChart from "../../components/MuscleRadarChart";

function WorkoutResults() {
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем тренировку из location.state или из store
    const workoutFromState = (location.state as { workout?: Workout })?.workout;
    const currentWorkout = useAppSelector((state: RootState) => state.currentWorkout);

    const [workout, _setWorkout] = useState<Workout | null>(workoutFromState || currentWorkout);

    useEffect(() => {
        if (workout) {
            logAnalyticsEvent(ANALYTICS_EVENTS.SCREEN_VIEW, {
                [ANALYTICS_PARAMS.SCREEN_NAME]: ANALYTICS_SCREENS.WORKOUT_RESULTS,
                [ANALYTICS_PARAMS.WORKOUT_ID]: workout.id,
            });
        }
    }, [workout?.id]);

    useEffect(() => {
        if (!workout) {
            navigate("/");
        }
    }, [workout, navigate]);

    if (!workout) {
        return null;
    }

    const header = (
        <Typography variant="h4" className="workout-results__title">
            Workout summary
        </Typography>
    )
    useHeader(header);

    const formattedDate = formatDate(workout.date);

    return (
        <Box className="workout-results">
            <Box className="workout-results__name">
                <Typography variant="h1" sx={{ fontSize: 20, textAlign: 'center' }} >
                    {workout.name}
                </Typography>
            </Box>
            <Typography variant="h3" className="workout-results__start-time">
                {formattedDate}
            </Typography>
            <Box sx={{
                position: 'sticky',
                top: '24px',
                width: '100%',
                padding: '10px',
                background: '#1a1a1a',
                zIndex: '9999'
            }} />
            <WorkoutRecords workout={workout} />
            <MuscleRadarChart workout={workout} />
            {workout.exercises.map((activity: Activity) => (
                <ActivityResultCard activity={activity} key={activity.id} />
            ))}
        </Box>
    );
}

export default WorkoutResults;
