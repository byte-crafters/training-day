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
import "./ExerciseDetail.scss";
import { Set, Activity } from "@training-day/shared";
import { useDispatch, useSelector } from "react-redux";
import { addSet } from "../../store";

function ExerciseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    // Получаем exercise из location.state (для отображения)
    const exerciseFromState = (location.state as { exercise?: { id: string; name: string; totalSets?: number } })?.exercise;
    
    // Получаем currentWorkout из Redux store
    const currentWorkout = useSelector((state: any) => state.currentWorkout);
    
    // Находим Activity из currentWorkout по id
    const activity = currentWorkout?.exercises?.find(
        (ex: Activity) => ex.id === exerciseFromState?.id
    ) || null;
    
    // Используем activity если есть, иначе fallback на exerciseFromState
    const exercise = activity || exerciseFromState;

    const [reps, setReps] = useState(15);
    const [weight, setWeight] = useState<number | "">(0);
    const [note, setNote] = useState("");
    const [savedSets, setSavedSets] = useState<Set[]>([]);
    const [isSaving] = useState(false);
    const [showSaveMessage] = useState(false);

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
        if (!activity) {
            return;
        }

        const newSet: Set = {
            id: Date.now().toString(),
            reps: reps,
            weight: weight || 0,
            note: note || null,
        };

        dispatch(addSet({ exerciseId: activity.id, set: newSet }));
        
        // Обновляем локальное состояние для немедленного отображения
        setSavedSets((prev) => [...prev, newSet]);
        
        // Сброс полей после сохранения
        setReps(15);
        setWeight(0);
        setNote("");
    };

    const handleDeleteSet = () => {
        if (savedSets.length > 0) {
            const updatedSets = savedSets.slice(0, -1);
            setSavedSets(updatedSets);
        }
    };

    const handleEditSet = (_setToEdit: Set) => {
        console.log('11111');
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
                <Box className="exercise-detail__card">
                    <Typography className="exercise-detail__add-set-title">
                        Add set
                    </Typography>
                    
                    <Box className="exercise-detail__inputs-row">
                        <Box className="exercise-detail__input-group">
                            <Typography className="exercise-detail__input-label">
                                Reps
                            </Typography>
                            <TextField
                                type="number"
                                className="exercise-detail__compact-input"
                                value={reps}
                                onChange={handleRepsChange}
                                inputProps={{
                                    min: 0,
                                }}
                            />
                        </Box>

                        <Box className="exercise-detail__input-group">
                            <Typography className="exercise-detail__input-label">
                                Weight (kg)
                            </Typography>
                            <TextField
                                type="number"
                                className="exercise-detail__compact-input"
                                value={weight}
                                onChange={handleWeightChange}
                                placeholder="0"
                                inputProps={{
                                    min: 0,
                                    step: 1,
                                }}
                            />
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

                {savedSets.length > 0 && (
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

