export type FirstWorkoutState = {
    workoutStarted: boolean
    exercisesSelected: boolean
    workoutTimerStarted: boolean
    setOpened: boolean
    setStarted: boolean
    setLogged: boolean
    exerciseFinished: boolean
    workoutFinished: boolean
    workoutShowed: boolean
}

const KEY = "first-workout"

export const loadState = (): FirstWorkoutState => {
    const raw = localStorage.getItem(KEY)
    return raw
        ? JSON.parse(raw)
        : {
            workoutStarted: false,
            exercisesSelected: false,
            workoutTimerStarted: false,
            setOpened: false,
            setStarted: false,
            setLogged: false,
            exerciseFinished: false,
            workoutFinished: false,
            workoutShowed: false,
        }
}

export const saveState = (state: FirstWorkoutState) => {
    localStorage.setItem(KEY, JSON.stringify(state))
}

export const deleteState = () => {
    localStorage.removeItem(KEY);
}
