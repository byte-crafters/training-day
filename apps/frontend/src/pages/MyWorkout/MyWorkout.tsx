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
    startTimer,
    pauseTimer,
    resetTimer,
} from "../../store";
import {
    createWorkout as createWorkoutAPI,
    getWorkouts,
} from "../../utils/api";
import { saveCurrentWorkout } from "../../utils/storage";
import FeedbackButton from "../../components/FeedbackButton";
import { logAnalyticsEvent } from "../../utils/firebase";
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, ANALYTICS_PARAMS } from "../../utils/analytics";
import * as Sentry from "@sentry/react";
import WorkoutTimer from "../../components/WorkoutTimer";
import PausePlayButton from "../../components/PausePlayButton";

function MyWorkout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Получаем текущую тренировку из Redux store
    const currentWorkout = useAppSelector(
        (state: RootState) => state.currentWorkout
    );
    const timer = useAppSelector((state: RootState) => state.timer);
    const workoutName = currentWorkout?.name || "Untitled Workout";
    const hasExercises =
        currentWorkout?.exercises?.length &&
        currentWorkout.exercises.length > 0;
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        dispatch(startTimer());
        logAnalyticsEvent(ANALYTICS_EVENTS.SCREEN_VIEW, { [ANALYTICS_PARAMS.SCREEN_NAME]: ANALYTICS_SCREENS.MY_WORKOUT });
        return () => {
            dispatch(pauseTimer());
        };
    }, [dispatch]);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(workoutName);
    const textRef = useRef<HTMLDivElement>(null);
    const [textWidth, setTextWidth] = useState<number | undefined>(undefined);

    // Синхронизируем editedName с workoutName
    useEffect(() => {
        setEditedName(workoutName);
    }, [workoutName]);

    // Измеряем ширину текста для синхронизации с input
    useEffect(() => {
        if (textRef.current && !isEditingName) {
            const width = textRef.current.offsetWidth;
            setTextWidth(width);
        }
    }, [workoutName, isEditingName]);

    const handleStartEditName = () => {
        setIsEditingName(true);
        setEditedName(workoutName);
    };

    const handleSaveName = () => {
        if (editedName.trim()) {
            dispatch(updateWorkoutName(editedName.trim()));
        } else {
            setEditedName(workoutName);
        }
        setIsEditingName(false);
    };

    const handleCancelEditName = () => {
        setEditedName(workoutName);
        setIsEditingName(false);
    };

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
        dispatch(pauseTimer());
        navigate("/select-exercises");
    };

    return (
        <Box className="my-workout">
            <Box component="header" className="my-workout__header">
                <IconButton
                    className="my-workout__back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Back"
                    sx={{ color: '#ffffff' }}
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
                {hasExercises && (
                    <Box className="my-workout__name-section">
                        {isEditingName ? (
                            <Box className="my-workout__name-edit">
                                <TextField
                                    className="my-workout__name-input"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    sx={
                                        textWidth ? { width: `${textWidth}px` } : {}
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSaveName();
                                        } else if (e.key === "Escape") {
                                            handleCancelEditName();
                                        }
                                    }}
                                    autoFocus
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                />
                                <IconButton
                                    className="my-workout__save-button"
                                    onClick={handleSaveName}
                                    aria-label="Save"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </IconButton>
                            </Box>
                        ) : (
                            <Box className="my-workout__name-display">
                                <Typography
                                    style={{ fontSize: "20px" }}
                                    ref={textRef}
                                    className="my-workout__name-text"
                                >
                                    {workoutName.length > 10 ? `${workoutName.slice(0, 10)}...` : workoutName}
                                </Typography>
                                <IconButton
                                    className="my-workout__edit-button"
                                    onClick={handleStartEditName}
                                    aria-label="Edit"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                )}
                <Box className="my-workout__header-spacer" />
            </Box>
            {hasExercises && (
                <Box component="main" className="my-workout__main">
                    <WorkoutTimer />
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

                    <Box className="my-workout__exercises-list">
                        <ExerciseList />
                    </Box>
                </Box>
            )}

            <Box className="my-workout__footer">
                {hasExercises && (
                    <Box className="my-workout__footer-pause-row">
                        <PausePlayButton className="my-workout__pause-button" />
                    </Box>
                )}
                <Button
                    variant="contained"
                    size="large"
                    color="error"
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

            <FeedbackButton />
        </Box>
    );
}

export default MyWorkout;
