/**
 * Константы для Firebase Analytics.
 * Воронка: workout_start_clicked → workout_started → set_recorded → workout_completed.
 */

/** Имена событий */
export const ANALYTICS_EVENTS = {
    SCREEN_VIEW: "screen_view",
    LOGIN: "login",
    WORKOUT_START_CLICKED: "workout_start_clicked",
    WORKOUT_STARTED: "workout_started",
    SET_RECORDED: "set_recorded",
    WORKOUT_COMPLETED: "workout_completed",
    FEEDBACK_SENT: "feedback_sent",
} as const;

/** Имена экранов (параметр screen_name для screen_view) */
export const ANALYTICS_SCREENS = {
    WORKOUT_TRACKER: "workout_tracker",
    SELECT_EXERCISES: "select_exercises",
    MY_WORKOUT: "my_workout",
    EXERCISE_DETAIL: "exercise_detail",
    WORKOUT_RESULTS: "workout_results",
    FEEDBACK: "feedback",
    NOT_FOUND: "not_found",
} as const;

/** Имена параметров событий */
export const ANALYTICS_PARAMS = {
    SCREEN_NAME: "screen_name",
    EXERCISE_ID: "exercise_id",
    EXERCISE_NAME: "exercise_name",
    WORKOUT_ID: "workout_id",
    METHOD: "method",
    EXERCISES_COUNT: "exercises_count",
    SETS_COUNT: "sets_count",
    DURATION: "duration",
} as const;
