import type { Meta, StoryObj } from '@storybook/react-vite';
import WorkoutCard from './WorkoutCard';
import type { Workout } from '@training-day/shared';
import { ExerciseType } from '@training-day/shared';

const meta = {
  component: WorkoutCard,
} satisfies Meta<typeof WorkoutCard>;

export default meta;

type Story = StoryObj<typeof meta>;

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
    name: 'Morning Workout',
    date: new Date().toISOString(),
    duration: '0',
  },
};

