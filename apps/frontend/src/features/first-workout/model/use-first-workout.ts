import { useFirstWorkoutContext } from "./FirstWorkoutProvider";

export type OnboardingMode =
    | "disabled"         // Onboarding завершён
    | "start_workout"
    | "select_exercises"
    | "start_workout_timer"
    | "set_opened"
    | "set_started"
    | "set_logged"
    | "exercise_finished"
    | "workout_finished"
    | "workout_showed"

export const useFirstWorkout = () => {
    const { state } = useFirstWorkoutContext();

    if (!state.workoutStarted) return { mode: "start_workout" as const };
    if (!state.exercisesSelected) return { mode: "select_exercises" as const };
    if (!state.workoutTimerStarted) return { mode: "start_workout_timer" as const };
    if (!state.setOpened) return { mode: "set_opened" as const };
    if (!state.setStarted) return { mode: "set_started" as const };
    if (!state.setLogged) return { mode: "set_logged" as const };
    if (!state.exerciseFinished) return { mode: "exercise_finished" as const };
    if (!state.workoutFinished) return { mode: "workout_finished" as const };
    if (!state.workoutShowed) return { mode: "workout_showed" as const };
    // По умолчанию
    return { mode: "disabled" as const }
}
