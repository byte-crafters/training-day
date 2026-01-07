import { createStore, createSlice, configureStore } from '@reduxjs/toolkit';

const workoutsSlice = createSlice({
    name: 'workout',
    initialState: [],
    reducers: {
        setWorkouts(state, action) {
            return action.payload;
        },
        // addWorkout(state, action){
        //     state.push(action.payload);
        // },
        removeWorkout(state, action) {
            //
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
        exercises: exercisesSlice.reducer,
    },
})

export {store};

export const {setWorkouts} = workoutsSlice.actions;
export const {setExercises} = exercisesSlice.actions;