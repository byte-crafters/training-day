import type { Meta, StoryObj } from '@storybook/react-vite';
import FeedBackPage from './FeedBackPage';

const meta = {
  component: FeedBackPage,
} satisfies Meta<typeof FeedBackPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
