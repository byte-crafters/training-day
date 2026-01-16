import type { Meta, StoryObj } from '@storybook/react-vite';
import ContinueWorkoutCard from './ContinueWorkoutCard';
import type { Workout } from '@training-day/shared';
import { ExerciseType } from '@training-day/shared';

const meta = {
  component: ContinueWorkoutCard,
} satisfies Meta<typeof ContinueWorkoutCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// Вспомогательная функция для создания workout
const createWorkout = (name: string, exerciseCount: number): Workout => {
  const exerciseNames = ['Bench Press', 'Squats', 'Deadlift', 'Overhead Press', 'Barbell Row'];
  const exercises = [];
  
  for (let i = 0; i < exerciseCount; i++) {
    exercises.push({
      id: `exercise-${i + 1}`,
      name: exerciseNames[i] || `Exercise ${i + 1}`,
      strength: true,
      type: ExerciseType.CHEST,
      sets: [],
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

export const Default: Story = {
  args: {
    workout: createWorkout('Morning Workout', 3),
    onDismiss: () => console.log('Workout dismissed'),
    onDelete: () => console.log('Workout deleted'),
  },
};

export const SingleExercise: Story = {
  args: {
    workout: createWorkout('Quick Workout', 1),
    onDismiss: () => console.log('Workout dismissed'),
    onDelete: () => console.log('Workout deleted'),
  },
};

export const ManyExercises: Story = {
  args: {
    workout: createWorkout('Full Body Workout', 5),
    onDismiss: () => console.log('Workout dismissed'),
    onDelete: () => console.log('Workout deleted'),
  },
};

export const LongName: Story = {
  args: {
    workout: {
      ...createWorkout('Very Long Workout Name That Might Wrap', 2),
      name: 'Very Long Workout Name That Might Wrap',
    },
    onDismiss: () => console.log('Workout dismissed'),
    onDelete: () => console.log('Workout deleted'),
  },
};
