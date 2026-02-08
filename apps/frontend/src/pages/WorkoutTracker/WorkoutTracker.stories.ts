import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { Box } from '@mui/material';
import { store, setWorkouts, setCurrentWorkout } from '../../store/index';
import { Workout, ExerciseType } from '@training-day/shared';
import WorkoutTracker from './WorkoutTracker';
import BottomNavigation from '../../components/NavigationLayout/BottomNavigation';

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
    duration: 0,
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

      return React.createElement(
        Box,
        { sx: { paddingBottom: '64px', minHeight: '100vh', position: 'relative' } },
        React.createElement(Story),
        React.createElement(BottomNavigation)
      );
    },
  ],
} satisfies Meta<typeof WorkoutTracker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithContinueWorkout: Story = {
  args: {
    workouts: [
      createMockWorkout('Morning Workout', 3),
      createMockWorkout('Evening Workout', 5),
    ],
    currentWorkout: createMockWorkout('Current Workout', 2),
  },
};