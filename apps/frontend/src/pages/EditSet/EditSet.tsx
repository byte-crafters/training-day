import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import "./EditSet.scss";
import { Set, Exercise } from "@training-day/shared";

function EditSet() {
    const navigate = useNavigate();
    const location = useLocation();
    const { set, exercise, onSave } = (location.state as {
        set?: Set;
        exercise?: Exercise;
        onSave?: (updatedSet: Set) => void;
    }) || {};

    const [reps, setReps] = useState(set?.reps || 15);
    const [weight, setWeight] = useState<number | "">(set?.weight || 0);
    const [note, setNote] = useState(set?.note || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!set || !exercise) {
            navigate(-1);
        }
    }, [set, exercise, navigate]);

    if (!set || !exercise) {
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

    const handleSave = () => {
        if (reps <= 0) {
            return;
        }
        setIsSaving(true);
        // Имитация сохранения
        setTimeout(() => {
            const updatedSet: Set = {
                ...set,
                reps: reps,
                weight: weight !== "" ? Number(weight) : undefined,
                note: note || undefined,
            };
            if (onSave) {
                onSave(updatedSet);
            }
            setIsSaving(false);
            navigate(-1);
        }, 500);
    };

    return (
        <Box className="edit-set">
            <Box component="header" className="edit-set__header">
                <IconButton
                    className="edit-set__back-button"
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
                <Typography variant="h4" className="edit-set__title">
                    Edit Set {set.setNumber}
                </Typography>
                <Box className="edit-set__header-spacer" />
            </Box>

            <Box component="main" className="edit-set__main">
                <Box className="edit-set__card">
                    <Typography className="edit-set__exercise-name">
                        {exercise.name}
                    </Typography>

                    <Box className="edit-set__reps-section">
                        <Typography className="edit-set__reps-label">
                            Reps
                        </Typography>
                        <TextField
                            type="number"
                            className="edit-set__reps-input"
                            value={reps}
                            onChange={handleRepsChange}
                            inputProps={{
                                min: 0,
                            }}
                        />
                    </Box>

                    <Box className="edit-set__weight-section">
                        <Typography className="edit-set__weight-label">
                            Weight (kg)
                        </Typography>
                        <TextField
                            type="number"
                            className="edit-set__weight-input"
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

                    <Box className="edit-set__note-section">
                        <Typography className="edit-set__note-label">
                            Note (optional)
                        </Typography>
                        <TextField
                            className="edit-set__note-input"
                            placeholder="Add note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Box>
                </Box>
            </Box>

            <Box className="edit-set__footer">
                <Button
                    variant="contained"
                    fullWidth
                    className="edit-set__save-button"
                    onClick={handleSave}
                    disabled={isSaving || reps <= 0}
                >
                    {isSaving ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </Box>
        </Box>
    );
}

export default EditSet;

