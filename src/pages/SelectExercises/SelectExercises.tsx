import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    Button,
    Checkbox,
} from "@mui/material";
import "./SelectExercises.scss";

type Category = "All" | "Chest" | "Back" | "Legs" | "Cardio";

interface Exercise {
    id: string;
    name: string;
    selected: boolean;
}

function SelectExercises() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(
        new Set()
    );

    const exercisesFromStore = useSelector((state: any) => state.exercises);

    const exercises: Exercise[] = exercisesFromStore.map((exercise: any) => ({
        ...exercise,
        selected: selectedExerciseIds.has(exercise.id),
    }));

    const categories: Category[] = ["All", "Chest", "Back", "Legs", "Cardio"];

    const handleToggleExercise = (id: string) => {
        setSelectedExerciseIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const filteredExercises = exercisesFromStore.filter(
        (exercise) =>
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === "All" ||
                exercise.type === selectedCategory.toLowerCase())
    );

    const selectedExercisesCount = exercises.filter(
        (exercise) => exercise.selected
    ).length;

    const handleBeginWorkout = () => {
        const selectedExercises = exercises.filter(
            (exercise) => exercise.selected
        );
        if (selectedExercises.length === 0) {
            return;
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
                    What are you up to today?
                </Typography>
                <Box className="select-exercises__header-spacer" />
            </Box>

            <Box component="main" className="select-exercises__main">
                <Box sx={{ marginBottom: "20px" }}>
                    <TextField
                        className="select-exercises__search"
                        placeholder="Search exercises..."
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
                            className={`select-exercises__category ${
                                selectedCategory === category
                                    ? "select-exercises__category--active"
                                    : ""
                            }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </Box>

                <Box className="select-exercises__list">
                    {filteredExercises.map((exercise) => (
                        <Box
                            key={exercise.id}
                            className="select-exercises__exercise-item"
                        >
                            <Checkbox
                                checked={exercise.selected}
                                onChange={() =>
                                    handleToggleExercise(exercise.id)
                                }
                                className="select-exercises__checkbox"
                            />
                            <Typography className="select-exercises__exercise-name">
                                {exercise.name}
                            </Typography>
                            {exercise.selected && (
                                <Box className="select-exercises__checkmark">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box className="select-exercises__footer">
                <Button
                    variant="contained"
                    fullWidth
                    className="select-exercises__begin-button"
                    onClick={handleBeginWorkout}
                    disabled={selectedExercisesCount === 0}
                >
                    Begin Workout
                </Button>
            </Box>
        </Box>
    );
}

export default SelectExercises;
