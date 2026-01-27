import type { Meta, StoryObj } from '@storybook/react-vite';
import FeedbackButton from './FeedbackButton';

const meta = {
  component: FeedbackButton,
} satisfies Meta<typeof FeedbackButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: () => {
      console.log('FeedbackButton clicked');
    },
  },
};
