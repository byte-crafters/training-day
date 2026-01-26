import { createSlice, configureStore, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { Exercise, Set, Workout } from '@training-day/shared';
import { saveCurrentWorkout, loadCurrentWorkout } from '../utils/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const initialWorkouts: Workout[] = [];

const workoutsSlice = createSlice({
    name: 'workout',
    initialState: initialWorkouts,
    reducers: {
        setWorkouts(_state, action: PayloadAction<Workout[]>) {
            return action.payload;
        },
    }
});

const initialCurrentWorkout: Workout | null = loadCurrentWorkout();

const currentWorkoutSlice = createSlice({
    name: 'currentWorkout',
    initialState: initialCurrentWorkout as Workout | null,
    reducers: {
        setCurrentWorkout(_state, action: PayloadAction<Workout | null>) {
            return action.payload;
        },
        updateWorkoutName(state, action: PayloadAction<string>) {
            if (state) {
                state.name = action.payload;
            }
        },
        addSet(state, action: PayloadAction<{ exerciseId: string; set: Set }>) {
            if (!state) return;
            const { exerciseId, set } = action.payload;
            const exercise = state.exercises.find((ex) => ex.id === exerciseId);
            if (exercise) {
                exercise.sets.push(set);
            }
        },
        updateSet(state, action: PayloadAction<{ exerciseId: string; setId: string; set: Set }>) {
            if (!state) return;
            const { exerciseId, setId, set } = action.payload;
            const exercise = state.exercises.find((ex) => ex.id === exerciseId);
            if (exercise) {
                const setIndex = exercise.sets.findIndex((s) => s.id === setId);
                if (setIndex !== -1) {
                    exercise.sets[setIndex] = set;
                }
            }
        },
        deleteSet(state, action: PayloadAction<{ exerciseId: string; setId: string }>) {
            if (!state) return;
            const { exerciseId, setId } = action.payload;
            const exercise = state.exercises.find((ex) => ex.id === exerciseId);
            if (exercise) {
                exercise.sets = exercise.sets.filter((s) => s.id !== setId);
            }
        },
    }
});

const initialExercises: Exercise[] = [];

const exercisesSlice = createSlice({
    name: 'exercise',
    initialState: initialExercises,
    reducers: {
        setExercises(_state, action: PayloadAction<Exercise[]>) {
            return action.payload;
        },
    }
});

// Middleware для автоматического сохранения currentWorkout в localStorage
const saveWorkoutMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    
    // Сохраняем currentWorkout после любых действий, которые могут его изменить
    if (
        currentWorkoutSlice.actions.setCurrentWorkout.match(action) ||
        currentWorkoutSlice.actions.updateWorkoutName.match(action) ||
        currentWorkoutSlice.actions.addSet.match(action) ||
        currentWorkoutSlice.actions.updateSet.match(action) ||
        currentWorkoutSlice.actions.deleteSet.match(action)
    ) {
        const state = store.getState();
        const currentWorkout = state.currentWorkout;
        saveCurrentWorkout(currentWorkout);
    }
    
    return result;
};

const store = configureStore({
    reducer: {
        workouts: workoutsSlice.reducer,
        currentWorkout: currentWorkoutSlice.reducer,
        exercises: exercisesSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(saveWorkoutMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {store};

export const {setWorkouts} = workoutsSlice.actions;
export const {setExercises} = exercisesSlice.actions;
export const {setCurrentWorkout, updateWorkoutName, addSet, updateSet, deleteSet} = currentWorkoutSlice.actions;