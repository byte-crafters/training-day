import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Workout } from '../types';

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

const currentWorkoutSlice = createSlice({
    name: 'currentWorkout',
    initialState: null as Workout | null,
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

const store = configureStore({
    reducer: {
        workouts: workoutsSlice.reducer,
        currentWorkout: currentWorkoutSlice.reducer,
        exercises: exercisesSlice.reducer,
    },
})

export {store};

export const {setWorkouts} = workoutsSlice.actions;
export const {setExercises} = exercisesSlice.actions;
export const {setCurrentWorkout, updateWorkoutName, addSet} = currentWorkoutSlice.actions;