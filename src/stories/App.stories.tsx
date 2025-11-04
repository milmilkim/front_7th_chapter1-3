import type { Meta, StoryObj } from '@storybook/react-vite';

import App from '../App';

const meta = {
  title: 'Example/App',
  component: App,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
