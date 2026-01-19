import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, Button, TextField, Drawer } from "@mui/material";
import "./ExerciseDetail.scss";
import { Set, Activity } from "@training-day/shared";
import { addSet, RootState, useAppDispatch, useAppSelector } from "../../store";

function ExerciseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    // Получаем exercise из location.state (для отображения)
    const exerciseFromState = (
        location.state as {
            exercise?: { id: string; name: string; totalSets?: number };
        }
    )?.exercise;

    // Получаем currentWorkout из Redux store
    const currentWorkout = useAppSelector(
        (state: RootState) => state.currentWorkout
    );

    // Находим Activity из currentWorkout по id
    const activity =
        currentWorkout?.exercises?.find(
            (ex: Activity) => ex.id === exerciseFromState?.id
        ) || null;

    // Используем activity если есть, иначе fallback на exerciseFromState
    const exercise = activity || exerciseFromState;

    const [reps, setReps] = useState<number | "">(15);
    const [weight, setWeight] = useState<number | "">("");
    const [note, setNote] = useState("");
    const [savedSets, setSavedSets] = useState<Set[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Синхронизируем savedSets с sets из activity
    useEffect(() => {
        if (activity?.sets) {
            setSavedSets(activity.sets);
        }
    }, [activity?.sets]);

    if (!exercise) {
        navigate("/my-workout");
        return null;
    }

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
        setWeight((prev) => (prev === "" ? 5 : prev + 5));
    };

    const decrementWeightBy5 = () => {
        setWeight((prev) => {
            if (prev === "" || prev === 0) return "";
            return Math.max(0, prev - 5);
        });
    };

    const handleSaveSet = () => {
        if (!activity) {
            return;
        }

        // Валидация: reps должен быть больше 0
        const repsValue = reps === "" ? 0 : reps;
        if (repsValue <= 0) {
            return;
        }

        const newSet: Set = {
            id: Date.now().toString(),
            reps: repsValue,
            weight: weight === "" ? 0 : weight,
            note: note || null,
        };

        dispatch(addSet({ exerciseId: activity.id, set: newSet }));

        // Обновляем локальное состояние для немедленного отображения
        setSavedSets((prev) => [...prev, newSet]);

        // Сброс полей после сохранения
        setReps(15);
        setWeight("");
        setNote("");
        
        // Закрываем форму после сохранения
        setIsFormOpen(false);
    };

    const handleOpenForm = () => {
        // Если есть сохраненные сеты, заполняем форму значениями из последнего сета
        if (savedSets.length > 0) {
            const lastSet = savedSets[savedSets.length - 1];
            setReps(lastSet.reps || 15);
            setWeight(lastSet.weight > 0 ? lastSet.weight : "");
            setNote(lastSet.note || "");
        } else {
            // Если сетов нет, используем дефолтные значения
            setReps(15);
            setWeight("");
            setNote("");
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        // Сброс полей при закрытии (опционально)
        // setReps(15);
        // setWeight("");
        // setNote("");
    };

    const handleEditSet = (set: Set) => {
        console.log(set);
        // navigate("/edit-set", {
        //     state: {
        //         set: _setToEdit,
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
                {savedSets.length > 0 ? (
                    <Box className="exercise-detail__card">
                        <Box className="exercise-detail__previous-sets">
                            <Typography className="exercise-detail__previous-sets-title">
                                Previous Sets
                            </Typography>
                            {savedSets.map((set, index) => (
                                <Box
                                    key={set.id}
                                    className="exercise-detail__previous-set-item"
                                    onClick={() => handleEditSet(set)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <Typography className="exercise-detail__previous-set-text">
                                        Set {index + 1}: {set.reps} reps
                                        {set.weight !== undefined &&
                                            set.weight > 0 &&
                                            ` • ${set.weight} kg`}
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
                ) : (
                    <Box className="exercise-detail__empty-state">
                        <Typography className="exercise-detail__empty-state-text">
                            No sets yet
                        </Typography>
                        <Typography className="exercise-detail__empty-state-hint">
                            Tap the button below to add your first set
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box className="exercise-detail__footer">
                <Button
                    variant="outlined"
                    fullWidth
                    className="exercise-detail__add-set-button-bottom"
                    onClick={handleOpenForm}
                >
                    Add Set
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    className="exercise-detail__finish-button"
                    onClick={() => navigate("/my-workout")}
                >
                    Finish Exercise
                </Button>
            </Box>

            {/* Выплывающая форма снизу */}
            <Drawer
                anchor="bottom"
                open={isFormOpen}
                onClose={handleCloseForm}
                PaperProps={{
                    sx: {
                        backgroundColor: '#2a2a2a',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        maxHeight: '90vh',
                    },
                }}
            >
                <Box className="exercise-detail__form-drawer">
                    <Box className="exercise-detail__form-drawer-handle" />
                    
                    <Box className="exercise-detail__form-drawer-content">
                        <Typography className="exercise-detail__add-set-title">
                            Add set
                        </Typography>

                        <Box className="exercise-detail__inputs-row">
                            <Box className="exercise-detail__input-group">
                                <Typography className="exercise-detail__input-label">
                                    Reps
                                </Typography>
                                <Box className="exercise-detail__input-with-steppers">
                                    <IconButton
                                        className="exercise-detail__stepper-button"
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
                                        className="exercise-detail__compact-input"
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
                                        className="exercise-detail__stepper-button"
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

                            <Box className="exercise-detail__input-group">
                                <Typography className="exercise-detail__input-label">
                                    Weight (kg)
                                </Typography>
                                <Box className="exercise-detail__input-with-steppers">
                                    <IconButton
                                        className="exercise-detail__stepper-button exercise-detail__stepper-button--large"
                                        onClick={decrementWeightBy5}
                                        disabled={weight === "" || weight === 0}
                                        aria-label="Decrease weight by 5"
                                    >
                                        <Typography className="exercise-detail__stepper-button-text">-5</Typography>
                                    </IconButton>
                                    <IconButton
                                        className="exercise-detail__stepper-button"
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
                                        className="exercise-detail__compact-input"
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
                                        className="exercise-detail__stepper-button"
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
                                        className="exercise-detail__stepper-button exercise-detail__stepper-button--large"
                                        onClick={incrementWeightBy5}
                                        aria-label="Increase weight by 5"
                                    >
                                        <Typography className="exercise-detail__stepper-button-text">+5</Typography>
                                    </IconButton>
                                </Box>
                            </Box>
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

                        <Button
                            variant="contained"
                            fullWidth
                            className="exercise-detail__add-set-button"
                            onClick={handleSaveSet}
                            disabled={reps === "" || reps <= 0}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
}

export default ExerciseDetail;
