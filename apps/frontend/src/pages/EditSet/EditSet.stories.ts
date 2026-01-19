import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { Set, Exercise, ExerciseType } from '@training-day/shared';
import EditSet from './EditSet';

const createMockSet = (reps: number, weight: number, note: string | null = null): Set => ({
  id: 'set-1',
  reps,
  weight,
  note,
});

const createMockExercise = (name: string): Exercise => ({
  id: 'exercise-1',
  name,
  strength: true,
  type: ExerciseType.CHEST,
});

const meta = {
  component: EditSet,
  parameters: {
    router: {
      initialEntries: [
        {
          pathname: '/edit-set',
          state: {
            set: createMockSet(10, 50, 'First set'),
            exercise: createMockExercise('Bench Press'),
            onSave: (updatedSet: Set) => {
              console.log('Set saved:', updatedSet);
            },
          },
        },
      ],
    },
  },
} satisfies Meta<typeof EditSet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    set: createMockSet(10, 50, 'First set'),
    exercise: createMockExercise('Bench Press'),
  },
  parameters: {
    router: {
      initialEntries: [
        {
          pathname: '/edit-set',
          state: {
            set: createMockSet(10, 50, 'First set'),
            exercise: createMockExercise('Bench Press'),
            onSave: (updatedSet: Set) => {
              console.log('Set saved:', updatedSet);
            },
          },
        },
      ],
    },
  },
};
