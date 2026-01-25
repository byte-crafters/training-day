import type { Meta, StoryObj } from '@storybook/react-vite';
import ExerciseListItem from './ExerciseListItem';
import { Exercise, ExerciseType } from '@training-day/shared';

const meta = {
    component: ExerciseListItem,
} satisfies Meta<typeof ExerciseListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockExercise: Exercise = {
    id: '1',
    name: 'Bench Press',
    type: ExerciseType.CHEST,
    strength: true,
};

export const Default: Story = {
    args: {
        exercise: mockExercise,
        isSelected: false,
        onClick: () => console.log('Clicked'),
    },
};

export const Selected: Story = {
    args: {
        exercise: mockExercise,
        isSelected: true,
        onClick: () => console.log('Clicked'),
    },
};
