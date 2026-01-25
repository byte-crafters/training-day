import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button, TextField, Drawer } from "@mui/material";
import { Set } from "@training-day/shared";
import "./SetForm.scss";

interface SetFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (set: Set) => void;
    onDelete?: () => void;
    initialSet?: Set | null;
    mode?: 'add' | 'edit';
}

function SetForm({ open, onClose, onSave, onDelete, initialSet, mode = 'add' }: SetFormProps) {
    const [reps, setReps] = useState<number | "">(15);
    const [weight, setWeight] = useState<number | "">("");
    const [note, setNote] = useState("");

    // Заполняем форму при открытии или изменении initialSet
    useEffect(() => {
        if (open) {
            if (initialSet && mode === 'edit') {
                // Режим редактирования: заполняем значениями из initialSet
                setReps(initialSet.reps || 15);
                setWeight(initialSet.weight > 0 ? initialSet.weight : "");
                setNote(initialSet.note || "");
            } else if (mode === 'add') {
                // Режим добавления: используем дефолтные значения или значения из initialSet (последний сет)
                if (initialSet) {
                    setReps(initialSet.reps || 15);
                    setWeight(initialSet.weight > 0 ? initialSet.weight : "");
                    setNote(initialSet.note || "");
                } else {
                    setReps(15);
                    setWeight("");
                    setNote("");
                }
            }
        }
    }, [open, initialSet, mode]);

    // Единая функция обработки изменения значения
    const handleValueChange = (
        value: string,
        setter: (val: number | "") => void
    ) => {
        const trimmedValue = value.trim();
        if (trimmedValue === "" || trimmedValue === "-") {
            setter("");
        } else if (!isNaN(Number(trimmedValue)) && Number(trimmedValue) >= 0) {
            setter(Number(trimmedValue));
        }
    };

    const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e.target.value, setReps);
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e.target.value, setWeight);
    };

    // Функции для увеличения/уменьшения значений (steppers)
    const incrementReps = () => {
        setReps((prev) => (prev === "" ? 1 : Math.max(0, prev + 1)));
    };

    const decrementReps = () => {
        setReps((prev) => {
            if (prev === "" || prev === 0) return "";
            return Math.max(0, prev - 1);
        });
    };

    const incrementWeight = () => {
        setWeight((prev) => (prev === "" ? 1 : prev + 1));
    };

    const decrementWeight = () => {
        setWeight((prev) => {
            if (prev === "" || prev === 0) return "";
            return Math.max(0, prev - 1);
        });
    };

    const incrementWeightBy5 = () => {
        setWeight((prev) => (prev === "" ? 5 : Math.max(0, prev + 5)));
    };

    const decrementWeightBy5 = () => {
        setWeight((prev) => {
            if (prev === "" || prev === 0) return "";
            return Math.max(0, prev - 5);
        });
    };

    const handleSave = () => {
        // Валидация: reps должен быть больше 0
        const repsValue = reps === "" ? 0 : reps;
        if (repsValue <= 0) {
            return;
        }

        const set: Set = {
            id: initialSet?.id || Date.now().toString(),
            reps: repsValue,
            weight: weight === "" ? 0 : weight,
            note: note || null,
        };

        onSave(set);

        // Сброс полей после сохранения (только в режиме добавления)
        if (mode === 'add') {
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
                        {mode === 'edit' ? 'Edit set' : 'Add set'}
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
                                    placeholder="0"
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
                            onChange={(e) => setNote(e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        className="set-form__add-button"
                        onClick={handleSave}
                        disabled={reps === "" || reps <= 0}
                    >
                        {mode === 'edit' ? 'Save' : 'Add'}
                    </Button>

                    {mode === 'edit' && onDelete && (
                        <Button
                            variant="outlined"
                            fullWidth
                            className="set-form__delete-button"
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}

export default SetForm;
