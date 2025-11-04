import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { Event } from '../types';

const mockEvent: Event = {
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
};

const meta = {
  title: '3. 다이얼로그 및 모달/일정 삭제 확인',
  component: DeleteConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeleteConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NormalEvent: Story = {
  name: '일반 일정 삭제',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    event: mockEvent,
  },
};

export const RecurringEvent: Story = {
  name: '반복 일정 삭제',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    event: {
      ...mockEvent,
      title: '주간 회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
  },
};

export const LongTitleEvent: Story = {
  name: '긴 제목 일정 삭제',
  args: {
    open: true,
    onClose: fn(),
    onConfirm: fn(),
    event: {
      ...mockEvent,
      title: '2024년 1분기 프로젝트 최종 발표 및 리뷰 미팅',
    },
  },
};

export const Closed: Story = {
  name: '닫힌 상태',
  args: {
    open: false,
    onClose: fn(),
    onConfirm: fn(),
    event: mockEvent,
  },
};
