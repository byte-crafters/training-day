import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { store, setExercises, setCurrentWorkout } from '../../store/index';
import { Exercise, ExerciseType, Workout } from '@training-day/shared';
import SelectExercises from './SelectExercises';

const createMockExercise = (id: string, name: string, type: ExerciseType): Exercise => ({
  id,
  name,
  strength: true,
  type,
});

const createMockExercises = (): Exercise[] => [
  createMockExercise('1', 'Bench Press', ExerciseType.CHEST),
  createMockExercise('2', 'Squats', ExerciseType.LEGS),
  createMockExercise('3', 'Deadlift', ExerciseType.BACK),
  createMockExercise('4', 'Overhead Press', ExerciseType.SHOULDERS),
  createMockExercise('5', 'Barbell Row', ExerciseType.BACK),
  createMockExercise('6', 'Pull-ups', ExerciseType.BACK),
  createMockExercise('7', 'Leg Press', ExerciseType.LEGS),
  createMockExercise('8', 'Chest Fly', ExerciseType.CHEST),
];

const meta = {
  component: SelectExercises,
  decorators: [
    (Story, context): ReactElement => {
      const { exercises = createMockExercises(), currentWorkout = null } = (context.args as {
        exercises?: Exercise[];
        currentWorkout?: Workout | null;
      }) || {};

      // Инициализируем store
      store.dispatch(setExercises(exercises));
      if (currentWorkout) {
        store.dispatch(setCurrentWorkout(currentWorkout));
      } else {
        store.dispatch(setCurrentWorkout(null));
      }

      return React.createElement(Story);
    },
  ],
} satisfies Meta<typeof SelectExercises>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercises: createMockExercises(),
    currentWorkout: null,
  },
};
