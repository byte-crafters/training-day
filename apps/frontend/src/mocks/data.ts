import { Workout, Exercise, ExerciseType } from "@training-day/shared";

export const workouts: Workout[] = [
    {
        id: "workout-1",
        name: "Full Body Workout",
        date: "Mon, Apr 20",
        duration: "45 mins",
        exercises: [
            {
                id: "exercise-1-1",
                name: "Bench Press",
                sets: [
                    { id: "set-1-1-1", reps: 10, weight: 80 },
                    { id: "set-1-1-2", reps: 8, weight: 85 },
                    { id: "set-1-1-3", reps: 6, weight: 90 },
                ],
            },
            {
                id: "exercise-1-2",
                name: "Squats",
                sets: [
                    { id: "set-1-2-1", reps: 12, weight: 100 },
                    { id: "set-1-2-2", reps: 10, weight: 110 },
                    { id: "set-1-2-3", reps: 8, weight: 120 },
                ],
            },
            {
                id: "exercise-1-3",
                name: "Deadlift",
                sets: [
                    { id: "set-1-3-1", reps: 8, weight: 120 },
                    { id: "set-1-3-2", reps: 6, weight: 130 },
                    { id: "set-1-3-3", reps: 5, weight: 140 },
                ],
            },
        ],
    },
    {
        id: "workout-2",
        name: "Cardio Session",
        date: "Sat, Apr 18",
        duration: "30 mins",
        exercises: [
            {
                id: "exercise-2-1",
                name: "Running",
                sets: [
                    { id: "set-2-1-1", reps: 1, weight: 0 },
                ],
            },
            {
                id: "exercise-2-2",
                name: "Jump Rope",
                sets: [
                    { id: "set-2-2-1", reps: 100, weight: 0 },
                    { id: "set-2-2-2", reps: 100, weight: 0 },
                    { id: "set-2-2-3", reps: 100, weight: 0 },
                ],
            },
        ],
    },
    {
        id: "workout-3",
        name: "Upper Body",
        date: "Wed, Apr 16",
        duration: "50 mins",
        exercises: [
            {
                id: "exercise-3-1",
                name: "Pull-ups",
                sets: [
                    { id: "set-3-1-1", reps: 12, weight: 0 },
                    { id: "set-3-1-2", reps: 10, weight: 0 },
                    { id: "set-3-1-3", reps: 8, weight: 0 },
                ],
            },
            {
                id: "exercise-3-2",
                name: "Dumbbell Rows",
                sets: [
                    { id: "set-3-2-1", reps: 12, weight: 25 },
                    { id: "set-3-2-2", reps: 10, weight: 30 },
                    { id: "set-3-2-3", reps: 8, weight: 35 },
                ],
            },
            {
                id: "exercise-3-3",
                name: "Shoulder Press",
                sets: [
                    { id: "set-3-3-1", reps: 10, weight: 20 },
                    { id: "set-3-3-2", reps: 8, weight: 22.5 },
                    { id: "set-3-3-3", reps: 6, weight: 25 },
                ],
            },
            {
                id: "exercise-3-4",
                name: "Bicep Curls",
                sets: [
                    { id: "set-3-4-1", reps: 15, weight: 12.5 },
                    { id: "set-3-4-2", reps: 12, weight: 15 },
                    { id: "set-3-4-3", reps: 10, weight: 17.5 },
                ],
            },
        ],
    },
    {
        id: "workout-4",
        name: "Leg Day",
        date: "Mon, Apr 14",
        duration: "55 mins",
        exercises: [
            {
                id: "exercise-4-1",
                name: "Barbell Squats",
                sets: [
                    { id: "set-4-1-1", reps: 12, weight: 100 },
                    { id: "set-4-1-2", reps: 10, weight: 110 },
                    { id: "set-4-1-3", reps: 8, weight: 120 },
                    { id: "set-4-1-4", reps: 6, weight: 130 },
                ],
            },
            {
                id: "exercise-4-2",
                name: "Leg Press",
                sets: [
                    { id: "set-4-2-1", reps: 15, weight: 150 },
                    { id: "set-4-2-2", reps: 12, weight: 170 },
                    { id: "set-4-2-3", reps: 10, weight: 190 },
                ],
            },
            {
                id: "exercise-4-3",
                name: "Romanian Deadlift",
                sets: [
                    { id: "set-4-3-1", reps: 10, weight: 80 },
                    { id: "set-4-3-2", reps: 8, weight: 90 },
                    { id: "set-4-3-3", reps: 6, weight: 100 },
                ],
            },
            {
                id: "exercise-4-4",
                name: "Leg Curls",
                sets: [
                    { id: "set-4-4-1", reps: 12, weight: 40 },
                    { id: "set-4-4-2", reps: 10, weight: 45 },
                    { id: "set-4-4-3", reps: 8, weight: 50 },
                ],
            },
        ],
    },
    {
        id: "workout-5",
        name: "Push Day",
        date: "Fri, Apr 12",
        duration: "40 mins",
        exercises: [
            {
                id: "exercise-5-1",
                name: "Incline Bench Press",
                sets: [
                    { id: "set-5-1-1", reps: 10, weight: 70 },
                    { id: "set-5-1-2", reps: 8, weight: 75 },
                    { id: "set-5-1-3", reps: 6, weight: 80 },
                ],
            },
            {
                id: "exercise-5-2",
                name: "Overhead Press",
                sets: [
                    { id: "set-5-2-1", reps: 10, weight: 50 },
                    { id: "set-5-2-2", reps: 8, weight: 55 },
                    { id: "set-5-2-3", reps: 6, weight: 60 },
                ],
            },
            {
                id: "exercise-5-3",
                name: "Tricep Dips",
                sets: [
                    { id: "set-5-3-1", reps: 12, weight: 0 },
                    { id: "set-5-3-2", reps: 10, weight: 0 },
                    { id: "set-5-3-3", reps: 8, weight: 0 },
                ],
            },
        ],
    },
];



export const exercises: Exercise[] = [
    {
        id: "exercise-1",
        name: "Bench Press",
        strength: true,
        type: ExerciseType.CHEST,
    },
    {
        id: "exercise-2",
        name: "Squats",
        strength: true,
        type: ExerciseType.LEGS,
    },
    {
        id: "exercise-3",
        name: "Deadlift",
        strength: true,
        type: ExerciseType.BACK,
    },
    {
        id: "exercise-4",
        name: "Running",
        strength: false,
        type: ExerciseType.CARDIO,
    },
];
