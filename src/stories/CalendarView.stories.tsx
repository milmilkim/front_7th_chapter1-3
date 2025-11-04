import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import CalendarView from '../components/CalendarView';
import { Event } from '../types';

// Mock 데이터
const mockEvents: Event[] = [
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
    title: '점심 약속',
    date: '2024-01-15',
    startTime: '12:00',
    endTime: '13:00',
    description: '동료와 점심',
    location: '식당',
    category: '개인',
    repeat: { type: 'none', interval: 1 },
    notificationTime: 10,
  },
];

const meta = {
  title: '1. 타입별 캘린더 뷰 렌더링/캘린더 뷰',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    view: {
      control: 'radio',
      options: ['week', 'month'],
      description: '캘린더 뷰 타입',
    },
  },
} satisfies Meta<typeof CalendarView>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 월간 뷰 - 빈 상태
export const MonthViewEmpty: Story = {
  name: '월간 뷰 - 빈 상태',
  args: {
    view: 'month',
    setView: fn(),
    currentDate: new Date(2024, 0, 15), // 2024-01-15
    filteredEvents: [],
    setEvents: fn(),
    notifiedEvents: [],
    holidays: {},
    navigate: fn(),
    updateEvent: fn(),
    events: [],
    onDateCellClick: fn(),
  },
};

// 2. 월간 뷰 - 일정 있음
export const MonthViewWithEvents: Story = {
  name: '월간 뷰 - 일정 있음',
  args: {
    ...MonthViewEmpty.args,
    filteredEvents: mockEvents,
    events: mockEvents,
  },
};

// 3. 주간 뷰 - 빈 상태
export const WeekViewEmpty: Story = {
  name: '주간 뷰 - 빈 상태',
  args: {
    ...MonthViewEmpty.args,
    view: 'week',
  },
};

// 4. 주간 뷰 - 일정 있음
export const WeekViewWithEvents: Story = {
  name: '주간 뷰 - 일정 있음',
  args: {
    ...WeekViewEmpty.args,
    filteredEvents: mockEvents,
    events: mockEvents,
  },
};
