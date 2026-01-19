import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { store, setCurrentWorkout } from '../../store/index';
import { Workout, ExerciseType } from '@training-day/shared';
import MyWorkout from './MyWorkout';

const createMockWorkout = (name: string, exerciseCount: number, setsPerExercise: number = 0): Workout => {
  const exercises = [];
  for (let i = 0; i < exerciseCount; i++) {
    const sets = [];
    for (let j = 0; j < setsPerExercise; j++) {
      sets.push({
        id: `set-${i}-${j}`,
        reps: 10 + j,
        weight: 50 + j * 5,
        note: j === 0 ? 'First set' : null,
      });
    }
    exercises.push({
      id: `exercise-${i + 1}`,
      name: `Exercise ${i + 1}`,
      strength: true,
      type: ExerciseType.CHEST,
      sets,
    });
  }
  return {
    id: 'workout-1',
    name,
    date: new Date().toISOString(),
    duration: '0',
    exercises,
  };
};

const meta = {
  component: MyWorkout,
  decorators: [
    (Story, context): ReactElement => {
      const { currentWorkout = null } = (context.args as {
        currentWorkout?: Workout | null;
      }) || {};

      // Инициализируем store
      if (currentWorkout) {
        store.dispatch(setCurrentWorkout(currentWorkout));
      } else {
        store.dispatch(setCurrentWorkout(null));
      }

      return React.createElement(Story);
    },
  ],
} satisfies Meta<typeof MyWorkout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentWorkout: createMockWorkout('My Workout', 3, 0),
  },
};

