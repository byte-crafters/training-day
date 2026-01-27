import type { Meta, StoryObj } from '@storybook/react-vite';
import FeedbackPage from './FeedBackPage';

const meta = {
  component: FeedbackPage,
} satisfies Meta<typeof FeedbackPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
