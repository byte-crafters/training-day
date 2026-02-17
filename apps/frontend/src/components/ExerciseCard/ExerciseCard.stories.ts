import type { Meta, StoryObj } from "@storybook/react-vite";
import ExerciseCard from "./ExerciseCard";

const meta = {
    component: ExerciseCard,
} satisfies Meta<typeof ExerciseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        exercise: {
            id: "1",
            name: "Bench Press",
            icon: "",
            totalSets: 4,
            completedSets: 0,
            currentSet: 1,
        },
        index: 0,
    },
};
