import { useFirstWorkoutContext } from "./FirstWorkoutProvider";

export const useFirstWorkoutEvents = () => {
    const { setState } = useFirstWorkoutContext();

    const setWorkoutStarted = () =>
        setState(s => ({ ...s, workoutStarted: true }));

    const setExercisesSelected = () =>
        setState(s => ({ ...s, exercisesSelected: true }));

    const setWorkoutTimerStarted = () =>
        setState(s => ({ ...s, workoutTimerStarted: true }));

    const setOpened = () =>
        setState(s => ({ ...s, setOpened: true }));

    const setStarted = () =>
        setState(s => ({ ...s, setStarted: true }));

    const setLogged = () =>
        setState(s => ({ ...s, setLogged: true }));

    const setExerciseFinished = () =>
        setState(s => ({ ...s, exerciseFinished: true }));

    const setWorkoutFinished = () =>
        setState(s => ({ ...s, workoutFinished: true }));

    const setWorkoutShowed = () =>
        setState(s => ({ ...s, workoutShowed: true }));

    return {
        setWorkoutStarted,
        setExercisesSelected,
        setWorkoutTimerStarted,
        setOpened,
        setStarted,
        setLogged,
        setExerciseFinished,
        setWorkoutFinished,
        setWorkoutShowed,
    };
};



// startWorkout -> exerciseSelected -> startWorkoutTimer -> clickAddSet -> setAdd ?
