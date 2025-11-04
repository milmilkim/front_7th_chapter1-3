import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import EventBox from '../components/EventBox';
import { Event } from '../types';

const EventBoxWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ width: 200, border: '1px dashed #ccc', p: 1 }}>{children}</Box>
);

const meta = {
  title: '2. 일정 상태별 시각적 표현/일정 박스 상태',
  component: EventBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <EventBoxWrapper>
        <Story />
      </EventBoxWrapper>
    ),
  ],
} satisfies Meta<typeof EventBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const normalEvent: Event = {
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

export const Normal: Story = {
  name: '일반 일정',
  args: {
    event: normalEvent,
    isNotified: false,
  },
};

export const WithNotification: Story = {
  name: '알림 표시',
  args: {
    event: normalEvent,
    isNotified: true,
  },
};

export const DailyRepeat: Story = {
  name: '반복 일정 - 매일',
  args: {
    event: {
      ...normalEvent,
      title: '아침 스크럼',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: false,
  },
};

export const WeeklyRepeat: Story = {
  name: '반복 일정 - 매주',
  args: {
    event: {
      ...normalEvent,
      title: '주간 회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: false,
  },
};

export const MonthlyRepeat: Story = {
  name: '반복 일정 - 매월',
  args: {
    event: {
      ...normalEvent,
      title: '월례 보고',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: false,
  },
};

export const YearlyRepeat: Story = {
  name: '반복 일정 - 매년',
  args: {
    event: {
      ...normalEvent,
      title: '생일',
      repeat: {
        type: 'yearly',
        interval: 1,
      },
    },
    isNotified: false,
  },
};

export const NotificationAndRepeat: Story = {
  name: '알림 + 반복',
  args: {
    event: {
      ...normalEvent,
      title: '중요 회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: true,
  },
};

export const BiWeeklyRepeat: Story = {
  name: '2주마다 반복',
  args: {
    event: {
      ...normalEvent,
      title: '스프린트 리뷰',
      repeat: {
        type: 'weekly',
        interval: 2,
        endDate: '2024-12-31',
      },
    },
    isNotified: false,
  },
};
