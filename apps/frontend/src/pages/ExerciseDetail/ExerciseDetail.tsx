import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, Button, Card } from "@mui/material";
import "./ExerciseDetail.scss";
import { Set, Activity } from "@training-day/shared";
import { addSet, updateSet, deleteSet, RootState, useAppDispatch, useAppSelector } from "../../store";
import SetForm from "../../components/SetForm";
import FeedbackButton from "../../components/FeedbackButton";
import { logAnalyticsEvent } from "../../utils/firebase";

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

    const [savedSets, setSavedSets] = useState<Set[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSet, setEditingSet] = useState<Set | null>(null);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

    // Синхронизируем savedSets с sets из activity
    useEffect(() => {
        if (activity?.sets) {
            setSavedSets(activity.sets);
        }
    }, [activity?.sets]);

    useEffect(() => {
        if (exercise) {
            logAnalyticsEvent("screen_view", {
                screen_name: "exercise_detail",
                exercise_id: exercise.id,
                exercise_name: exercise.name,
            });
        }
    }, [exercise?.id]);

    if (!exercise) {
        navigate("/my-workout");
        return null;
    }

    const handleOpenForm = () => {
        // Если есть сохраненные сеты, используем последний сет для предзаполнения
        const lastSet = savedSets.length > 0 ? savedSets[savedSets.length - 1] : null;
        setEditingSet(lastSet);
        setFormMode('add');
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingSet(null);
    };

    const handleSaveSet = (set: Set) => {
        if (!activity) {
            return;
        }

        if (formMode === 'edit' && editingSet) {
            // Обновляем существующий сет
            dispatch(updateSet({
                exerciseId: activity.id,
                setId: editingSet.id,
                set
            }));
            // Обновляем локальное состояние
            setSavedSets((prev) =>
                prev.map((s) => (s.id === editingSet.id ? set : s))
            );
        } else {
            // Добавляем новый сет
            dispatch(addSet({ exerciseId: activity.id, set }));
            // Обновляем локальное состояние
            setSavedSets((prev) => [...prev, set]);
        }
    };

    const handleEditSet = (set: Set) => {
        setEditingSet(set);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const handleDeleteSet = () => {
        if (!activity || !editingSet) {
            return;
        }

        // Удаляем сет из Redux store
        dispatch(deleteSet({
            exerciseId: activity.id,
            setId: editingSet.id
        }));

        // Обновляем локальное состояние
        setSavedSets((prev) => prev.filter((s) => s.id !== editingSet.id));

        // Закрываем форму после удаления
        setIsFormOpen(false);
        setEditingSet(null);
    };

    return (
        <Box className="exercise-detail">
            <Box component="header" className="exercise-detail__header">
                <IconButton
                    className="exercise-detail__back-button"
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
                <Typography variant="h4" className="exercise-detail__title">
                    {exercise.name}
                </Typography>
                <Box className="exercise-detail__header-spacer" />
            </Box>

            <Box component="main" className="exercise-detail__main">
                {savedSets.length > 0 ? (
                    <Box className="exercise-detail__previous-sets">
                        <Typography variant="h5"
                            color="text.secondary" sx={{ textTransform: "uppercase" }}
                            className="exercise-detail__previous-sets-title">
                            Previous Sets
                        </Typography>
                        {savedSets.map((set, index) => (
                            <Card
                                key={set.id}
                                variant="outlined"
                                className="exercise-detail__previous-set-item"
                                onClick={() => handleEditSet(set)}
                                sx={{ padding: "26px", borderRadius: "16px", margin: "10px 0", cursor: "pointer" }}
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
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Box className="exercise-detail__empty-state">
                        <Box className="exercise-detail__empty-state-icon">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Левая гантель */}
                                <rect x="2" y="8" width="4" height="8" rx="1" />
                                {/* Правая гантель */}
                                <rect x="18" y="8" width="4" height="8" rx="1" />
                                {/* Ручка */}
                                <line x1="6" y1="12" x2="18" y2="12" strokeWidth="2" />
                            </svg>
                        </Box>
                        <Typography variant="h4" color="text.secondary" className="exercise-detail__empty-state-text">
                            No sets yet
                        </Typography>
                        <Typography variant="h4" color="text.secondary" className="exercise-detail__empty-state-hint">
                            Tap the button below to add your first set of {exercise.name}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box className="exercise-detail__footer">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    className="exercise-detail__add-set-button-bottom"
                    onClick={handleOpenForm}
                >
                    Add Set
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    className="exercise-detail__finish-button"
                    onClick={() => navigate("/my-workout")}
                >
                    Finish Exercise
                </Button>
            </Box>

            <SetForm
                open={isFormOpen}
                onClose={handleCloseForm}
                onSave={handleSaveSet}
                onDelete={handleDeleteSet}
                initialSet={editingSet}
                mode={formMode}
            />

            <FeedbackButton />
        </Box>
    );
}

export default ExerciseDetail;
