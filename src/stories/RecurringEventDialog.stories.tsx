import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import RecurringEventDialog from '../components/RecurringEventDialog';
import { Event } from '../types';

const mockEvent: Event = {
  id: '1',
  title: '주간 회의',
  date: '2024-01-15',
  startTime: '10:00',
  endTime: '11:00',
  description: '매주 월요일 팀 회의',
  location: '회의실 A',
  category: '업무',
  repeat: {
    type: 'weekly',
    interval: 1,
    endDate: '2024-12-31',
  },
  notificationTime: 10,
};

const meta = {
  title: '3. 다이얼로그 및 모달/반복 일정 다이얼로그',
  component: RecurringEventDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['edit', 'delete', 'drag'],
      description: '다이얼로그 타입',
    },
  },
} satisfies Meta<typeof RecurringEventDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditMode: Story = {
  name: '편집 다이얼로그',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    event: mockEvent,
    mode: 'edit',
  },
};

export const DeleteMode: Story = {
  name: '삭제 다이얼로그',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    event: mockEvent,
    mode: 'delete',
  },
};

export const DragMode: Story = {
  name: 'Dnd 다이얼로그',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    event: mockEvent,
    mode: 'drag',
  },
};
