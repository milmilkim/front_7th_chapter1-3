import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import OverlapDialog from '../components/OverlapDialog';
import { Event } from '../types';

const mockOverlappingEvents: Event[] = [
  {
    id: '1',
    title: '팀 회의',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 회의',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 1 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '프로젝트 미팅',
    date: '2024-01-15',
    startTime: '10:30',
    endTime: '11:30',
    description: '프로젝트 논의',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 1 },
    notificationTime: 10,
  },
];

const meta = {
  title: '3. 다이얼로그 및 모달/일정 겹침 경고',
  component: OverlapDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OverlapDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleOverlap: Story = {
  name: '일정 1개와 겹침',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    overlappingEvents: [mockOverlappingEvents[0]],
  },
};

export const MultipleOverlap: Story = {
  name: '일정 2개와 겹침',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    overlappingEvents: mockOverlappingEvents,
  },
};

export const ManyOverlap: Story = {
  name: '일정 3개와 겹침',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    overlappingEvents: [
      ...mockOverlappingEvents,
      {
        id: '3',
        title: '개인 약속',
        date: '2024-01-15',
        startTime: '10:15',
        endTime: '11:15',
        description: '개인 일정',
        location: '외부',
        category: '개인',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ],
  },
};
