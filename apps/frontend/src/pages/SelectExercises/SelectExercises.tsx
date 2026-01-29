import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    Button,
} from "@mui/material";
import { ExerciseType, Activity } from "@training-day/shared";
import "./SelectExercises.scss";
import { logAnalyticsEvent } from "../../utils/firebase";
import {
    RootState,
    setCurrentWorkout,
    useAppDispatch,
    useAppSelector,
} from "../../store";
import { createWorkout, exerciseToActivity } from "../../utils/helpers";
import ExerciseListItem from "../../components/ExerciseListItem";
import { saveCurrentWorkout } from "../../utils/storage";
import FeedbackButton from "../../components/FeedbackButton";

type Category = "All" | ExerciseType;

function SelectExercises() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        logAnalyticsEvent("screen_view", { screen_name: "select_exercises" });
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

        navigate("/my-workout", { state: { exercises: selectedExercises } });
    };

    return (
        <Box className="select-exercises">
            <Box component="header" className="select-exercises__header">
                <IconButton
                    className="select-exercises__back-button"
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
                <Typography variant="h4" className="select-exercises__title">
                    Choose exercises
                </Typography>
                <Box className="select-exercises__header-spacer" />
            </Box>

            <Box className="select-exercises__sticky-section">
                <Box sx={{ marginBottom: "20px" }}>
                    <TextField
                        className="select-exercises__search"
                        placeholder="Search 200+ exercises"
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

                <Box className="select-exercises__categories">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant="text"
                            sx={{ fontSize: 12, fontWeight: 700, padding: "6px 15px", minWidth: "auto" }}
                            className={`select-exercises__category ${selectedCategory === category
                                ? "select-exercises__category--active"
                                : ""
                                }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {getCategoryLabel(category)}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Box className="select-exercises__section-title">
                <Typography variant="h5" color='text.secondary' sx={{ textTransform: "uppercase" }}>
                    Recommended
                </Typography>
            </Box>

            <Box component="main" className="select-exercises__main">
                <Box className="select-exercises__list">
                    {filteredExercises.map((exercise) => {
                        const isSelected = selectedExerciseIds.includes(
                            exercise.id
                        );
                        return (
                            <ExerciseListItem
                                key={exercise.id}
                                exercise={exercise}
                                isSelected={isSelected}
                                onClick={() => handleToggleExercise(exercise.id)}
                            />
                        );
                    })}
                </Box>
            </Box>

            <Box className="select-exercises__footer">
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

            <FeedbackButton />
        </Box>
    );
}

export default SelectExercises;
