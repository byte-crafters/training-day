import type { Meta, StoryObj } from '@storybook/react-vite';
import WorkoutCard from './WorkoutCard';

const meta = {
  component: WorkoutCard,
} satisfies Meta<typeof WorkoutCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Morning Workout',
    index: 0,
    date: new Date().toISOString(),
    duration: 0,
  },
};

