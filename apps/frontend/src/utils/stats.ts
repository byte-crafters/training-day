import { ExerciseType, Workout } from "@training-day/shared";
import { formatDuration } from "./time";

export type WorkoutRecord = {
    id: string;
    label: string;
    value: number | string;
};

function calculateWorkoutStats(workout: Workout) {
    let totalVolume = 0,
        totalSets = 0,
        maxWeight = 0;

    workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
            totalSets++;
            totalVolume += set.weight * set.reps;

            if (maxWeight < set.weight)
                maxWeight = set.weight;
        })
    })

    const density = workout.duration > 0 ? (totalVolume / workout.duration).toFixed(2) : 0;

    return { totalVolume, density, totalSets, maxWeight }
}

function getWorkoutRecords(workout: Workout): WorkoutRecord[] {
    const stats = calculateWorkoutStats(workout);
    const duration = formatDuration(workout.duration);

    const records: WorkoutRecord[] = [
        { id: 'duration', label: 'Duration', value: duration },
        { id: 'volume', label: 'Total Volume', value: stats.totalVolume },
        { id: 'density', label: 'Density', value: stats.density },
        { id: 'sets', label: 'Total Sets', value: stats.totalSets },
        { id: 'maxWeight', label: 'Max Weight', value: stats.maxWeight }
    ];

    return records;
}

export interface MusclePercentage {
    muscle: ExerciseType;
    percent: number;
}

function calculateWorkoutMuscleDistribution(workout: Workout) {
    const muscleLoad: Record<ExerciseType, number> = {
        chest: 0, legs: 0, back: 0, cardio: 0,
        shoulders: 0, abs: 0, triceps: 0,
        biceps: 0, forearms: 0, calves: 0,
    };

    workout.exercises.forEach((activity) => {
        const load = activity.sets.reduce(
            (sum, set) => sum + set.reps * (set.weight || 1),
            0
        );
        muscleLoad[activity.type] += load;
    });

    const totalLoad = Object.values(muscleLoad).reduce((sum, v) => sum + v, 0);

    const entries = Object.entries(muscleLoad)
        .filter(([_, load]) => load > 0);

    const metrics = entries.map(([muscle]) => muscle);
    const data = entries.map(([_, load]) =>
        totalLoad ? (load / totalLoad) * 100 : 0
    );

    return { metrics, data };
}

export { getWorkoutRecords, calculateWorkoutMuscleDistribution };