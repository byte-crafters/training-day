import { http, HttpResponse } from 'msw';
import { workouts, exercises } from './data';
 
export const handlers = [
  http.get('http://localhost:3000/workouts', () => {
    return HttpResponse.json(workouts);
  }),
  
  // http.get('http://localhost:3000/workouts/:id', ({ params }) => {
  //   const workout = workouts.find(w => w.id === params.id);
  //   if (!workout) {
  //     return HttpResponse.json(
  //       { error: 'Workout not found' },
  //       { status: 404 }
  //     );
  //   }
  //   return HttpResponse.json(workout);
  // }),

  http.get('http://localhost:3000/exercises', () => {
    return HttpResponse.json(exercises);
  }),
]