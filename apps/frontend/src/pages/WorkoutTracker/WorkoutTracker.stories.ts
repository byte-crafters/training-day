import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { store, setWorkouts, setCurrentWorkout } from '../../store/index';
import { Workout, ExerciseType } from '@training-day/shared';
import WorkoutTracker from './WorkoutTracker';

const createMockWorkout = (name: string, exerciseCount: number): Workout => {
  const exercises = [];
  for (let i = 0; i < exerciseCount; i++) {
    exercises.push({
      id: `exercise-${i + 1}`,
      name: `Exercise ${i + 1}`,
      strength: true,
      type: ExerciseType.CHEST,
      sets: [],
    });
  }
  return {
    id: `workout-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    date: new Date().toISOString(),
    duration: '0',
    exercises,
  };
};

const meta = {
  component: WorkoutTracker,
  decorators: [
    (Story, context): ReactElement => {
      const { workouts = [], currentWorkout = null } = (context.args as {
        workouts?: Workout[];
        currentWorkout?: Workout | null;
      }) || {};

      // Инициализируем store
      store.dispatch(setWorkouts(workouts));
      if (currentWorkout) {
        store.dispatch(setCurrentWorkout(currentWorkout));
      } else {
        store.dispatch(setCurrentWorkout(null));
      }

      return React.createElement(Story);
    },
  ],
} satisfies Meta<typeof WorkoutTracker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithWorkouts: Story = {
  args: {
    workouts: [
      createMockWorkout('Morning Workout', 3),
      createMockWorkout('Evening Workout', 5),
    ],
    currentWorkout: null,
  },
};

export const WithContinueWorkout: Story = {
  args: {
    workouts: [
      createMockWorkout('Morning Workout', 3),
      createMockWorkout('Evening Workout', 5),
    ],
    currentWorkout: createMockWorkout('Current Workout', 2),
  },
};