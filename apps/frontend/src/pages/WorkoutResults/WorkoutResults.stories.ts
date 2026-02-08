import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { store, setCurrentWorkout } from '../../store/index';
import { Workout, ExerciseType } from '@training-day/shared';
import WorkoutResults from './WorkoutResults';

const createMockWorkout = (name: string, exerciseCount: number, setsPerExercise: number = 2): Workout => {
  const exercises = [];
  
  const exerciseNames = ['Bench Press', 'Deadlift', 'Barbell Row', 'Squats', 'Overhead Press'];
  const exerciseTypes = [ExerciseType.CHEST, ExerciseType.BACK, ExerciseType.BACK, ExerciseType.LEGS, ExerciseType.SHOULDERS];
  
  for (let i = 0; i < exerciseCount; i++) {
    const sets = [];
    for (let j = 0; j < setsPerExercise; j++) {
      sets.push({
        id: `set-${i}-${j}`,
        reps: 10 + j,
        weight: 80 + j * 5,
        note: null,
      });
    }
    exercises.push({
      id: `exercise-${i + 1}`,
      name: exerciseNames[i] || `Exercise ${i + 1}`,
      strength: true,
      type: exerciseTypes[i] || ExerciseType.CHEST,
      sets,
    });
  }
  
  // Создаем дату для времени начала (08:30 AM)
  const date = new Date();
  date.setHours(8, 30, 0, 0);
  
  return {
    id: 'workout-1',
    name,
    date: date.toISOString(),
    duration: 45 * 60,
    exercises,
  };
};

const meta = {
  component: WorkoutResults,
  decorators: [
    (Story, context): ReactElement => {
      const { workout = null } = (context.args as {
        workout?: Workout | null;
      }) || {};

      // Инициализируем store
      if (workout) {
        store.dispatch(setCurrentWorkout(workout));
      } else {
        store.dispatch(setCurrentWorkout(null));
      }

      return React.createElement(Story);
    },
  ],
  parameters: {
    router: {
      initialEntries: [
        {
          pathname: '/workout-results',
          state: { workout: null },
        },
      ],
    },
  },
} satisfies Meta<typeof WorkoutResults>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    workout: createMockWorkout('Full Body Power', 5, 2),
  },
  parameters: {
    router: {
      initialEntries: [
        {
          pathname: '/workout-results',
          state: { workout: createMockWorkout('Full Body Power', 5, 2) },
        },
      ],
    },
  },
};
