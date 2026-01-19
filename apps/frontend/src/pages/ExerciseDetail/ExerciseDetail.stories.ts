import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { store, setCurrentWorkout } from '../../store/index';
import { Workout, ExerciseType } from '@training-day/shared';
import ExerciseDetail from './ExerciseDetail';

const defaultExercise = {
  id: '1',
  name: 'Bench Press',
  icon: '💪',
  totalSets: 4,
  completedSets: 0,
  currentSet: 1,
};

const meta = {
  component: ExerciseDetail,
  decorators: [
    (Story, context): ReactElement => {
      // Получаем exercise из args story, если есть
      const exercise = (context.args as { exercise?: any })?.exercise || defaultExercise;

      // Инициализируем currentWorkout в store с Activity, который имеет такой же id
      store.dispatch(
        setCurrentWorkout({
          id: 'workout-1',
          name: 'My Workout',
          date: new Date().toISOString(),
          duration: '0',
          exercises: [
            {
              id: exercise.id,
              name: exercise.name,
              strength: true,
              type: ExerciseType.CHEST,
              sets: [],
            },
          ],
        } as Workout)
      );

      return React.createElement(Story);
    },
  ],
  parameters: {
    router: {
      initialEntries: [
        {
          pathname: '/exercise-detail',
          state: { exercise: defaultExercise },
        },
      ],
    },
  },
} satisfies Meta<typeof ExerciseDetail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: defaultExercise,
  },
  parameters: {
    router: {
      initialEntries: [
        {
          pathname: '/exercise-detail',
          state: { exercise: defaultExercise },
        },
      ],
    },
  },
};
