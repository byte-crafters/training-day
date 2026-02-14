import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    IconButton,
    Button,
    Typography,
    CircularProgress,
    TextField,
} from "@mui/material";
import ExerciseList from "../../components/ExerciseList";
import "./MyWorkout.scss";
import {
    setCurrentWorkout,
    setWorkouts,
    updateWorkoutName,
    useAppDispatch,
    useAppSelector,
    RootState,
    pauseTimer,
    resetTimer,
} from "../../store";
import {
    createWorkout as createWorkoutAPI,
    getWorkouts,
} from "../../utils/api";
import { saveCurrentWorkout } from "../../utils/storage";
import { logAnalyticsEvent } from "../../utils/firebase";
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, ANALYTICS_PARAMS } from "../../utils/analytics";
import EditNameHeader from "../../components/EditNameHeader";
import * as Sentry from "@sentry/react";
import useHeader from "../../hooks/use-header";

function MyWorkout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Получаем текущую тренировку из Redux store
    const currentWorkout = useAppSelector(
        (state: RootState) => state.currentWorkout
    );
    const timer = useAppSelector((state: RootState) => state.timer);
    const hasExercises =
        currentWorkout?.exercises?.length &&
        currentWorkout.exercises.length > 0;
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {


        logAnalyticsEvent(ANALYTICS_EVENTS.SCREEN_VIEW, { [ANALYTICS_PARAMS.SCREEN_NAME]: ANALYTICS_SCREENS.MY_WORKOUT });
    }, []);

    const handleFinishWorkout = async () => {
        if (!currentWorkout) {
            return;
        }

        const totalMs =
            timer.accumulated +
            (timer.startedAt ? Date.now() - timer.startedAt : 0);
        const duration = Math.floor(totalMs / 1000); // секунды, в БД сохраняется как текст

        setIsSaving(true);
        try {
            const savedWorkout = await createWorkoutAPI({
                ...currentWorkout,
                duration,
            });

            if (!savedWorkout) {
                throw new Error("Failed to save workout");
            }
            dispatch(pauseTimer());
            const workouts = await getWorkouts();//надо ли тут?
            dispatch(setWorkouts(workouts));

            logAnalyticsEvent(ANALYTICS_EVENTS.WORKOUT_COMPLETED, {
                [ANALYTICS_PARAMS.WORKOUT_ID]: currentWorkout.id,
                [ANALYTICS_PARAMS.DURATION]: String(duration),
            });

            dispatch(setCurrentWorkout(null));
            saveCurrentWorkout(null);

            dispatch(resetTimer());
            navigate("/");
        } catch (error) {
            Sentry.captureException(error);
            console.error("Failed to finish workout:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddExercises = () => {
        navigate("/select-exercises",);
    };

    useHeader(<EditNameHeader />);

    return (
        <Box className="my-workout">

            {hasExercises && (
                <Box component="main" className="my-workout__main">
                    <Box className="my-workout__add-exercises-section">
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            className="my-workout__add-exercises-button"
                            onClick={handleAddExercises}
                        >
                            Add Exercises
                        </Button>
                    </Box>

                    <ExerciseList />
                </Box>
            )}

            <Box className="my-workout__footer">
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    fullWidth
                    className="my-workout__finish-button"
                    onClick={handleFinishWorkout}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <CircularProgress
                                size={20}
                                color="inherit"
                                sx={{ mr: 1 }}
                            />
                            Saving...
                        </>
                    ) : (
                        "Finish Workout"
                    )}
                </Button>
            </Box>
        </Box>
    );
}

export default MyWorkout;
