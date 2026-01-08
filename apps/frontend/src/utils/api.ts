export const getWorkouts = async () => {
    const response = await fetch('http://localhost:3000/workouts');
    return response.json();
}

export const getExercises = async () => {
    const response = await fetch('http://localhost:3000/exercises');
    return response.json();
}