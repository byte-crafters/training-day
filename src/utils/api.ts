export const getWorkouts = async () => {
    const response = await fetch('http://localhost:3000/workouts');
    return response.json();
}

// function fetchQuery(query: string) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve({1: "workout 1", 2: "workout 2", 3: "workout 3"});
//         }, 1000);
//     });
// }