import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button, TextField, Drawer } from "@mui/material";
import { Set } from "@training-day/shared";
import { v4 as uuidv4 } from 'uuid';
import "./SetForm.scss";
import { useFirstWorkout } from "../../features/first-workout/model/use-first-workout";
import { useFirstWorkoutEvents } from "../../features/first-workout/model/use-first-workout-events";
import { SpotlightCoachmark } from "../../features/first-workout/ui/SpotlightCoachmark";

interface SetFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (set: Set) => void;
    onDelete?: () => void;
    initialSet?: Set | null;
    formMode?: 'add' | 'edit';
}

function SetForm({ open, onClose, onSave, onDelete, initialSet, formMode = 'add' }: SetFormProps) {
    const MAX_REPS = 300;
    const MAX_WEIGHT = 800;

    const [reps, setReps] = useState<number | "">(15);
    const [weight, setWeight] = useState<number | "">(30);
    const [note, setNote] = useState<string>("");

    const { mode } = useFirstWorkout();
    console.log(mode)
    const { setLogged } = useFirstWorkoutEvents();

    // Заполняем форму при открытии или изменении initialSet
    useEffect(() => {
        if (open) {
            if (initialSet && formMode === 'edit') {
                // Режим редактирования: заполняем значениями из initialSet
                setReps(initialSet.reps || 15);
                setWeight(initialSet.weight > 0 ? initialSet.weight : 30);
                setNote(initialSet.note || "");
            } else if (formMode === 'add') {
                // Режим добавления: используем дефолтные значения или значения из initialSet (последний сет)
                if (initialSet) {
                    setReps(initialSet.reps || 15);
                    setWeight(initialSet.weight > 0 ? initialSet.weight : 30);
                    setNote(initialSet.note || "");
                } else {
                    setReps(15);
                    setWeight(30);
                    setNote("");
                }
            }
        }
    }, [open, initialSet, formMode]);

    const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = e.target.value.trim();
        if (trimmedValue === "" || trimmedValue === "-") {
            setReps("");
        } else if (!isNaN(Number(trimmedValue))
            && Number(trimmedValue) >= 0
            && Number(trimmedValue) <= MAX_REPS) {
            setReps(Number(trimmedValue));
        }
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = e.target.value.trim();
        if (trimmedValue === "" || trimmedValue === "-") {
            setWeight("");
        } else if (!isNaN(Number(trimmedValue))
            && Number(trimmedValue) >= 0
            && Number(trimmedValue) <= MAX_WEIGHT) {
            setWeight(Number(trimmedValue));
        }
    };

    // Функции для увеличения/уменьшения значений (steppers)
    const incrementReps = () => {
        setReps((prev) => {
            if (prev === "" || prev === 0) return 1;
            return Math.min(MAX_REPS, prev + 1);
        });
    };

    const decrementReps = () => {
        setReps((prev) => {
            if (prev === "" || prev === 0) return "";
            return Math.max(0, prev - 1);
        });
    };

    const incrementWeight = () => {
        setWeight((prev) => {
            if (prev === "" || prev === 0) return 1;
            return Math.min(MAX_WEIGHT, prev + 1);
        });
    };

    const decrementWeight = () => {
        setWeight((prev) => {
            if (prev === "" || prev === 0) return "";
            return Math.max(0, prev - 1);
        });
    };

    const incrementWeightBy5 = () => {
        setWeight((prev) => {
            if (prev === "" || prev === 0) return 5;
            return Math.min(MAX_WEIGHT, prev + 5);
        });
    };

    const decrementWeightBy5 = () => {
        setWeight((prev) => {
            if (prev === "" || prev === 0) return "";
            return Math.max(0, prev - 5);
        });
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value.slice(0, 100));
    };

    const handleSave = () => {

        setLogged();
        // Валидация: reps должен быть больше 0
        const repsValue = reps === "" ? 0 : reps;
        if (repsValue <= 0) {
            return;
        }

        const set: Set = {
            id: uuidv4(),
            reps: repsValue,
            weight: weight === "" ? 0 : weight,
            note: note || null,
        };

        onSave(set);

        // Сброс полей после сохранения (только в режиме добавления)
        if (formMode === 'add') {
            setReps(15);
            setWeight("");
            setNote("");
        }

        onClose();
    };

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: '#000000',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    maxHeight: '90vh',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            }}
        >
            <Box className="set-form__drawer">
                <Box className="set-form__drawer-handle" />

                <Box className="set-form__drawer-content">
                    <Typography variant="h4" color="text.secondary" className="set-form__title">
                        {formMode === 'edit' ? 'Edit set' : 'Add set'}
                    </Typography>

                    <Box className="set-form__inputs-row">
                        <Box className="set-form__input-group">
                            <Typography variant="h4" className="set-form__input-label">
                                Reps
                            </Typography>
                            <Box className="set-form__input-with-steppers">
                                <IconButton
                                    className="set-form__stepper-button"
                                    onClick={decrementReps}
                                    disabled={reps === "" || reps === 0}
                                    aria-label="Decrease reps"
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
                                        <path d="M5 12h14" />
                                    </svg>
                                </IconButton>
                                <TextField
                                    type="number"
                                    className="set-form__compact-input"
                                    value={reps === "" ? "" : reps}
                                    onChange={handleRepsChange}
                                    placeholder="15"
                                    inputProps={{
                                        min: 0,
                                        style: {
                                            MozAppearance: 'textfield',
                                        },
                                    }}
                                    sx={{
                                        '& input[type=number]': {
                                            MozAppearance: 'textfield',
                                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                                WebkitAppearance: 'none',
                                                margin: 0,
                                                display: 'none',
                                            },
                                        },
                                    }}
                                />
                                <IconButton
                                    className="set-form__stepper-button"
                                    onClick={incrementReps}
                                    disabled={reps === MAX_REPS}
                                    aria-label="Increase reps"
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
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </IconButton>
                            </Box>
                        </Box>

                        <Box className="set-form__input-group">
                            <Typography variant="h4" className="set-form__input-label">
                                Weight (kg)
                            </Typography>
                            <Box className="set-form__input-with-steppers">
                                <IconButton

                                    className="set-form__stepper-button set-form__stepper-button--large"
                                    onClick={decrementWeightBy5}
                                    disabled={weight === "" || weight === 0}
                                    aria-label="Decrease weight by 5"
                                >
                                    <Typography className="set-form__stepper-button-text">-5</Typography>
                                </IconButton>
                                <IconButton
                                    className="set-form__stepper-button"
                                    onClick={decrementWeight}
                                    disabled={weight === "" || weight === 0}
                                    aria-label="Decrease weight"
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
                                        <path d="M5 12h14" />
                                    </svg>
                                </IconButton>
                                <TextField
                                    type="number"
                                    className="set-form__compact-input"
                                    value={weight === "" ? "" : weight}
                                    onChange={handleWeightChange}
                                    placeholder="30"
                                    inputProps={{
                                        min: 0,
                                        step: 1,
                                        style: {
                                            MozAppearance: 'textfield',
                                        },
                                    }}
                                    sx={{
                                        '& input[type=number]': {
                                            MozAppearance: 'textfield',
                                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                                WebkitAppearance: 'none',
                                                margin: 0,
                                                display: 'none',
                                            },
                                        },
                                    }}
                                />
                                <IconButton
                                    className="set-form__stepper-button"
                                    onClick={incrementWeight}
                                    disabled={weight === MAX_WEIGHT}
                                    aria-label="Increase weight"
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
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </IconButton>
                                <IconButton
                                    className="set-form__stepper-button set-form__stepper-button--large"
                                    onClick={incrementWeightBy5}
                                    disabled={weight === MAX_WEIGHT}
                                    aria-label="Increase weight by 5"
                                >
                                    <Typography className="set-form__stepper-button-text">+5</Typography>
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Box className="set-form__note-section">
                        <Typography variant="h4" className="set-form__note-label">
                            Note
                        </Typography>
                        <TextField
                            className="set-form__note-input"
                            placeholder="Add note..."
                            value={note}
                            onChange={handleNoteChange}
                            multiline
                            rows={2}
                        />
                    </Box>
                    {formMode === 'edit' && onDelete && (
                        <Box
                            sx={{ padding: '0px 24px' }}><Button
                                variant="outlined"
                                fullWidth
                                className="set-form__delete-button"
                                onClick={onDelete}
                            >
                                Delete
                            </Button>
                        </Box>
                    )}
                </Box>
                <Box
                    id="log-set-btn" sx={{ padding: '16px 24px' }}>
                    <Button
                        variant="contained"
                        className="set-form__add-button"
                        onClick={handleSave}
                        disabled={reps === "" || reps <= 0}
                        fullWidth
                    >
                        {formMode === 'edit' ? 'Save' : 'Add'}
                    </Button>
                </Box>
            </Box>
            {mode == 'set_logged' &&
                <SpotlightCoachmark
                    targetId="log-set-btn"
                    title="Start doing set"
                    description="Click the button above to start your workout routine" />
            }
        </Drawer>
    );
}

export default SetForm;
