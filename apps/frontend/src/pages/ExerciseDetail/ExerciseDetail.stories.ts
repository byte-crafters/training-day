import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { store, setCurrentWorkout } from '../../store/index';
import { Workout, ExerciseType } from '@training-day/shared';
import ExerciseDetail from './ExerciseDetail';

const meta = {
  component: ExerciseDetail,
  decorators: [
    (Story): ReactElement => {
      const exercise = {
        id: '1',
        name: 'Bench Press',
        icon: '💪',
        totalSets: 4,
        completedSets: 0,
        currentSet: 1,
      };

      // Инициализируем currentWorkout в store с Activity, который имеет такой же id
      store.dispatch(
        setCurrentWorkout({
          id: 'workout-1',
          name: 'My Workout',
          date: new Date().toISOString(),
          duration: '0',
          exercises: [
            {
              id: '1', // Важно: id должен совпадать с exercise.id
              name: 'Bench Press',
              strength: true,
              type: ExerciseType.CHEST,
              sets: [], // Можно добавить предзаполненные сеты для разных stories
            },
          ],
        } as Workout)
      );

      return React.createElement(
        MemoryRouter,
        {
          initialEntries: [
            {
              pathname: '/exercise-detail',
              state: { exercise },
            },
          ],
        },
        React.createElement(Story)
      );
    },
  ],
} satisfies Meta<typeof ExerciseDetail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '1',
      name: 'Bench Press',
      icon: '💪',
      totalSets: 4,
      completedSets: 0,
      currentSet: 1,
    },
  },
};
