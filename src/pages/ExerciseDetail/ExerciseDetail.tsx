import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import "./ExerciseDetail.scss";

interface Exercise {
    id: string;
    name: string;
    icon: string;
    totalSets: number;
    completedSets: number;
    currentSet: number;
}

interface Set {
    id: string;
    setNumber: number;
    reps: number;
    weight?: number;
    note?: string;
    savedAt: Date;
}

function ExerciseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const exercise = (location.state as { exercise?: Exercise })?.exercise;

    const [reps, setReps] = useState(15);
    const [weight, setWeight] = useState<number | "">(0);
    const [note, setNote] = useState("");
    const [savedSets, setSavedSets] = useState<Set[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);

    if (!exercise) {
        navigate("/my-workout");
        return null;
    }

    const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setReps(value === "" ? 0 : Number(value));
        }
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setWeight(value === "" ? "" : Number(value));
        }
    };

    const handleSaveSet = () => {
        if (reps <= 0) {
            return;
        }
        setIsSaving(true);
        // Имитация сохранения
        setTimeout(() => {
            const newSet: Set = {
                id: Date.now().toString(),
                setNumber: currentSetNumber,
                reps: reps,
                weight: weight !== "" ? Number(weight) : undefined,
                note: note || undefined,
                savedAt: new Date(),
            };
            setSavedSets([...savedSets, newSet]);
            setCurrentSetNumber(currentSetNumber + 1);
            setReps(15); // Сброс к значению по умолчанию
            setWeight(0);
            setNote("");
            setIsSaving(false);
            setShowSaveMessage(true);
            setTimeout(() => setShowSaveMessage(false), 3000);
        }, 500);
    };

    const handleDeleteSet = () => {
        if (savedSets.length > 0) {
            const updatedSets = savedSets.slice(0, -1);
            setSavedSets(updatedSets);
            if (updatedSets.length > 0) {
                setCurrentSetNumber(updatedSets[updatedSets.length - 1].setNumber + 1);
            } else {
                setCurrentSetNumber(1);
            }
        }
    };

    const handleEditSet = (setToEdit: Set) => {
        console.log('11111');
        // navigate("/edit-set", {
        //     state: {
        //         set: setToEdit,
        //         exercise: exercise,
        //         onSave: (updatedSet: Set) => {
        //             setSavedSets((prevSets) =>
        //                 prevSets.map((set) =>
        //                     set.id === updatedSet.id ? updatedSet : set
        //                 )
        //             );
        //         },
        //     },
        // });
    };

    const totalSets = exercise.totalSets;
    const completedSets = savedSets.length;

    return (
        <Box className="exercise-detail">
            <Box component="header" className="exercise-detail__header">
                <IconButton
                    className="exercise-detail__back-button"
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
                <Typography variant="h4" className="exercise-detail__title">
                    {exercise.name}
                </Typography>
                <Box className="exercise-detail__header-spacer" />
            </Box>

            <Box component="main" className="exercise-detail__main">
                {savedSets.length > 0 && (
                    <Box className="exercise-detail__card">
                        <Box className="exercise-detail__previous-sets">
                            <Typography className="exercise-detail__previous-sets-title">
                                Previous Sets
                            </Typography>
                            {savedSets.map((set) => (
                                <Box
                                    key={set.id}
                                    className="exercise-detail__previous-set-item"
                                    onClick={() => handleEditSet(set)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <Typography className="exercise-detail__previous-set-text">
                                        Set {set.setNumber}: {set.reps} reps
                                        {set.weight !== undefined && set.weight > 0 && ` • ${set.weight} kg`}
                                    </Typography>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="exercise-detail__arrow"
                                    >
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                <Box className="exercise-detail__card">
                    <Box className="exercise-detail__reps-section">
                        <Typography className="exercise-detail__reps-label">
                            Reps
                        </Typography>
                        <TextField
                            type="number"
                            className="exercise-detail__reps-input"
                            value={reps}
                            onChange={handleRepsChange}
                            inputProps={{
                                min: 0,
                            }}
                        />
                    </Box>

                    <Box className="exercise-detail__weight-section">
                        <Typography className="exercise-detail__weight-label">
                            Weight (kg)
                        </Typography>
                        <TextField
                            type="number"
                            className="exercise-detail__weight-input"
                            value={weight}
                            onChange={handleWeightChange}
                            placeholder="0"
                            inputProps={{
                                min: 0,
                                step: 1,
                                style: { textAlign: "center", fontSize: "32px", fontWeight: 600 },
                            }}
                        />
                    </Box>

                    <Box className="exercise-detail__note-section">
                        <Typography className="exercise-detail__note-label">
                            Note (optional)
                        </Typography>
                        <TextField
                            className="exercise-detail__note-input"
                            placeholder="Add note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Box>

                    {showSaveMessage && (
                        <Box className="exercise-detail__save-message">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <Typography>Set {completedSets} saved!</Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box className="exercise-detail__footer">
                <Button
                    variant="contained"
                    fullWidth
                    className="exercise-detail__save-button"
                    onClick={handleSaveSet}
                    disabled={isSaving || savedSets.length >= totalSets || reps <= 0}
                >
                    {isSaving ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Save Set"
                    )}
                </Button>
                {savedSets.length > 0 && (
                    <Button
                        variant="outlined"
                        fullWidth
                        className="exercise-detail__delete-button"
                        onClick={handleDeleteSet}
                    >
                        Delete Set
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default ExerciseDetail;

