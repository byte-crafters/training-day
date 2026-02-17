import { createSlice, configureStore, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { Exercise, Set, Timer, Workout } from '@training-day/shared';
import { saveCurrentWorkout, loadCurrentWorkout } from '../utils/storage';

function getElapsedMs(timer: { accumulated: number; startedAt: number | null }): number {
    return timer.accumulated + (timer.startedAt ? Date.now() - timer.startedAt : 0);
}
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

const initialTimer: Timer = {
    startedAt: null as number | null,
    accumulated: 0,
};

const timerSlice = createSlice({
    name: 'timer',
    initialState: initialTimer,
    reducers: {
        startTimer(state) {
            console.log('started')
            if (!state.startedAt) {
                state.startedAt = Date.now();
            }
        },
        resetTimer(state) {
            state.startedAt = null;
            state.accumulated = 0;
        },
        pauseTimer(state) {
            if (state.startedAt) {
                state.accumulated += Date.now() - state.startedAt;
                state.startedAt = null;
            }
        },
        /** Восстановить накопленное время из тренировки (только при нажатии Continue) */
        setTimerFromWorkout(state, action: PayloadAction<Workout>) {
            state.accumulated = action.payload.elapsedMs ?? 0;
            state.startedAt = null;
        }
    }
})

// Middleware: сохраняем currentWorkout в localStorage, всегда подставляя elapsedMs из таймера
const persistMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    const shouldSaveWorkout =
        currentWorkoutSlice.actions.setCurrentWorkout.match(action) ||
        currentWorkoutSlice.actions.updateWorkoutName.match(action) ||
        currentWorkoutSlice.actions.addSet.match(action) ||
        currentWorkoutSlice.actions.updateSet.match(action) ||
        currentWorkoutSlice.actions.deleteSet.match(action) ||
        timerSlice.actions.startTimer.match(action) ||
        timerSlice.actions.pauseTimer.match(action) ||
        timerSlice.actions.resetTimer.match(action);

    if (shouldSaveWorkout) {
        if (state.currentWorkout) {
            const elapsedMs = getElapsedMs(state.timer);
            saveCurrentWorkout(
                elapsedMs > 0
                    ? { ...state.currentWorkout, elapsedMs }
                    : state.currentWorkout
            );
        } else {
            saveCurrentWorkout(null);
        }
    }

    return result;
};

const store = configureStore({
    reducer: {
        workouts: workoutsSlice.reducer,
        currentWorkout: currentWorkoutSlice.reducer,
        exercises: exercisesSlice.reducer,
        timer: timerSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store };

export const { setWorkouts } = workoutsSlice.actions;
export const { setExercises } = exercisesSlice.actions;
export const { setCurrentWorkout, updateWorkoutName, addSet, updateSet, deleteSet } = currentWorkoutSlice.actions;
export const { startTimer, resetTimer, pauseTimer, setTimerFromWorkout } = timerSlice.actions;