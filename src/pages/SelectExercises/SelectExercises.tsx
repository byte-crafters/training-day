import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

type Category = "All" | "Chest" | "Back" | "Legs" | "Custom";

interface Exercise {
    id: string;
    name: string;
    selected: boolean;
}

function SelectExercises() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [exercises, setExercises] = useState<Exercise[]>([
        { id: "1", name: "Push-Ups", selected: true },
        { id: "2", name: "Dumbbell Bench Press", selected: true },
        { id: "3", name: "Pull-Ups", selected: true },
        { id: "4", name: "Lat Pulldown", selected: true },
        { id: "5", name: "Squats", selected: true },
        { id: "6", name: "Lunges", selected: true },
        { id: "7", name: "Plank", selected: true },
    ]);

    const categories: Category[] = ["All", "Chest", "Back", "Legs", "Custom"];

    const handleToggleExercise = (id: string) => {
        setExercises((prev) =>
            prev.map((exercise) =>
                exercise.id === id
                    ? { ...exercise, selected: !exercise.selected }
                    : exercise
            )
        );
    };

    const filteredExercises = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedExercisesCount = exercises.filter(
        (exercise) => exercise.selected
    ).length;

    const handleBeginWorkout = () => {
        const selectedExercises = exercises.filter((exercise) => exercise.selected);
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
                    Select Exercises
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
                                onChange={() => handleToggleExercise(exercise.id)}
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

