export const getWorkouts = async () => {
    const response = await fetch('http://localhost:3001/api/workouts');
    return response.json();
}

export const getExercises = async () => {
    const response = await fetch('http://localhost:3001/api/exercises');
    return response.json();
}