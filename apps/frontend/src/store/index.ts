import { createSlice, configureStore, Middleware } from '@reduxjs/toolkit';
import { Workout } from '@training-day/shared';
import { saveCurrentWorkout, loadCurrentWorkout } from '../utils/storage';

const workoutsSlice = createSlice({
    name: 'workout',
    initialState: [] as Workout[],
    reducers: {
        setWorkouts(state, action) {
            return action.payload;
        },
        removeWorkout(state, action) {
            //
        },
    }
});

// Загружаем сохраненную тренировку из localStorage при инициализации
const savedWorkout = loadCurrentWorkout();

const currentWorkoutSlice = createSlice({
    name: 'currentWorkout',
    initialState: savedWorkout as Workout | null,
    reducers: {
        setCurrentWorkout(state, action) {
            return action.payload;
        },
        updateWorkoutName(state, action) {
            if (state) {
                state.name = action.payload;
            }
        },
        removeWorkout(state, action) {
            //
        },
        addSet(state, action) {
            if (!state) return;
            const { exerciseId, set } = action.payload;
            const exercise = state.exercises.find((ex) => ex.id === exerciseId);
            if (exercise) {
                exercise.sets.push(set);
            }
        },
    }
});

const exercisesSlice = createSlice({
    name: 'exercise',
    initialState: [],
    reducers: {
        setExercises(state, action) {
            return action.payload;
        },
    }
});

// Middleware для автоматического сохранения currentWorkout в localStorage
const saveWorkoutMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    
    // Сохраняем currentWorkout после любых действий, которые могут его изменить
    if (
        action.type === 'currentWorkout/setCurrentWorkout' ||
        action.type === 'currentWorkout/updateWorkoutName' ||
        action.type === 'currentWorkout/addSet'
    ) {
        const state = store.getState();
        saveCurrentWorkout(state.currentWorkout);
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
})

export {store};

export const {setWorkouts} = workoutsSlice.actions;
export const {setExercises} = exercisesSlice.actions;
export const {setCurrentWorkout, updateWorkoutName, addSet} = currentWorkoutSlice.actions;