import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
} from "@mui/material";
import { ExerciseType, Activity } from "@training-day/shared";
import "./SelectExercises.scss";
import { logAnalyticsEvent } from "../../utils/firebase";
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, ANALYTICS_PARAMS } from "../../utils/analytics";
import {
    RootState,
    setCurrentWorkout,
    useAppDispatch,
    useAppSelector,
} from "../../store";
import { createWorkout, exerciseToActivity } from "../../utils/helpers";
import ExerciseListItem from "../../components/ExerciseListItem";
import { saveCurrentWorkout } from "../../utils/storage";
import useHeader from "../../hooks/use-header";
import { useFirstWorkout } from "../../features/first-workout/model/use-first-workout";
import { SpotlightCoachmark } from "../../features/first-workout/ui/SpotlightCoachmark";
import { useFirstWorkoutEvents } from "../../features/first-workout/model/use-first-workout-events";

type Category = "All" | ExerciseType;

function SelectExercises() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { mode } = useFirstWorkout();
    console.log(mode);
    const { setExercisesSelected, setWorkoutTimerStarted } = useFirstWorkoutEvents();

    useEffect(() => {
        logAnalyticsEvent(ANALYTICS_EVENTS.SCREEN_VIEW, { [ANALYTICS_PARAMS.SCREEN_NAME]: ANALYTICS_SCREENS.SELECT_EXERCISES });
    }, []);

    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>(
        []
    );

    const exercisesFromStore = useAppSelector(
        (state: RootState) => state.exercises
    );
    const currentWorkout = useAppSelector(
        (state: RootState) => state.currentWorkout
    );


    // Инициализируем выбранные упражнения из текущей тренировки, если она существует
    useEffect(() => {
        if (currentWorkout?.exercises) {
            const existingExerciseIds = currentWorkout.exercises.map(
                (ex: Activity) => ex.id
            );
            setSelectedExerciseIds(existingExerciseIds);
        }
    }, [currentWorkout]);

    // Получаем уникальные типы упражнений из данных
    const categories: Category[] = [
        "All",
        ...Array.from(new Set(exercisesFromStore.map((ex) => ex.type))),
    ];

    const handleToggleExercise = (id: string) => {
        setSelectedExerciseIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((exerciseId) => exerciseId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const getCategoryType = (category: Category): ExerciseType | null => {
        if (category === "All") {
            return null;
        }
        return category as ExerciseType;
    };

    const getCategoryLabel = (category: Category): string => {
        if (category === "All") {
            return "All";
        }
        // Просто делаем первую букву заглавной
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const filteredExercises = exercisesFromStore.filter((exercise) => {
        const matchesSearch = exercise.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const categoryType = getCategoryType(selectedCategory);
        const matchesCategory =
            selectedCategory === "All" || exercise.type === categoryType;
        return matchesSearch && matchesCategory;
    });

    const selectedExercisesCount = selectedExerciseIds.length;

    const handleBeginWorkout = () => {
        setWorkoutTimerStarted();
        const selectedExercises = exercisesFromStore.filter((exercise) =>
            selectedExerciseIds.includes(exercise.id)
        );
        if (selectedExercises.length === 0) {
            return;
        }

        // Если есть текущая тренировка, обновляем её, сохраняя существующие сеты
        if (currentWorkout) {
            const existingExercisesMap = new Map(
                currentWorkout.exercises.map((ex: Activity) => [ex.id, ex])
            );

            // Создаем обновленный список упражнений
            const updatedExercises: Activity[] = selectedExercises.map(
                (exercise) => {
                    const existingActivity = existingExercisesMap.get(
                        exercise.id
                    );
                    // Если упражнение уже было в тренировке, сохраняем его сеты
                    if (existingActivity) {
                        return existingActivity;
                    }
                    // Если упражнение новое, создаем новую Activity
                    return exerciseToActivity(exercise);
                }
            );

            const updatedWorkout = {
                ...currentWorkout,
                exercises: updatedExercises,
            };

            dispatch(setCurrentWorkout(updatedWorkout));
            saveCurrentWorkout(updatedWorkout);
        } else {
            // Создаем новую тренировку
            const newWorkout = createWorkout(selectedExercises);
            dispatch(setCurrentWorkout(newWorkout));
            saveCurrentWorkout(newWorkout);
        }

        logAnalyticsEvent(ANALYTICS_EVENTS.WORKOUT_STARTED, {
            [ANALYTICS_PARAMS.EXERCISES_COUNT]: selectedExercises.length,
        });
        navigate("/my-workout", { state: { exercises: selectedExercises } });
    };

    const headerContent = (
        <Typography variant="h4" className="select-exercises__title">
            Choose exercises
        </Typography>
    )

    useHeader(headerContent);

    return (
        <Box className="select-exercises">
            <Box className="select-exercises__search-section">
                <Box sx={{ marginBottom: "10px" }}>
                    <TextField
                        className="select-exercises__search"
                        placeholder="Search exercises"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
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
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>

            <Box className="select-exercises__sticky-section">
                <Box className="select-exercises__categories">
                    {categories.map((category) => (
                        <Box
                            key={category}
                            sx={{ fontSize: 12, fontWeight: 700, padding: "5px 15px", minWidth: "auto", borderRadius: "20px" }}
                            className={`select-exercises__category ${selectedCategory === category
                                ? "select-exercises__category--active"
                                : ""
                                }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {getCategoryLabel(category)}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box className="select-exercises__section-title">
                {filteredExercises.length > 0 ? (

                    <Typography variant="h5" color='text.secondary' sx={{ textTransform: "uppercase" }}>
                        Recommended
                    </Typography>
                ) : (
                    <Typography variant="h4" color="text.secondary" textAlign="center">
                        No exercises found
                    </Typography>
                )}
            </Box>

            <Box component="main" className="select-exercises__main">
                <Box className="select-exercises__list" >
                    {filteredExercises.map((exercise, index) => {
                        const isSelected = selectedExerciseIds.includes(
                            exercise.id
                        );
                        return (
                            <ExerciseListItem
                                id={index == 0 ? "select-exercises-panel" : undefined}
                                key={exercise.id}
                                exercise={exercise}
                                isSelected={isSelected}
                                onClick={() => {
                                    if (index == 0)
                                        setExercisesSelected();
                                    handleToggleExercise(exercise.id)
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            <Box className="select-exercises__footer"
                id="begin-workout-btn">
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    className="select-exercises__begin-button"
                    onClick={handleBeginWorkout}
                    disabled={selectedExercisesCount === 0}
                >
                    {currentWorkout ? "Continue Workout" : "Begin Workout"}
                </Button>
            </Box>
            {mode == 'select_exercises' &&
                <SpotlightCoachmark
                    targetId="select-exercises-panel"
                    title="Select exercises"
                    description="Click the button above to start your workout routine" />
            }
            {mode == 'start_workout_timer' &&
                <SpotlightCoachmark
                    targetId="begin-workout-btn"
                    title="Begin workout!"
                    description="Click the button above to start your workout routine" />
            }
        </Box>
    );
}

export default SelectExercises;
