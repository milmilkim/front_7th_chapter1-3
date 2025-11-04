import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import CalendarView from '../components/CalendarView';
import { Event } from '../types';
import { generateRepeatEvents } from '../utils/generateRepeatEvents';

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

const baseArgs = {
  view: 'month' as const,
  setView: fn(),
  currentDate: new Date(2024, 0, 15),
  filteredEvents: [],
  setEvents: fn(),
  notifiedEvents: [],
  holidays: {},
  navigate: fn(),
  updateEvent: fn(),
  events: [],
  onDateCellClick: fn(),
};

const meta = {
  title: '2. 일정 상태별 시각적 표현/캘린더 뷰 상태',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHolidays: Story = {
  name: '공휴일 표시',
  args: {
    ...baseArgs,
    holidays: {
      '2024-01-01': '신정',
      '2024-01-15': '임시공휴일',
      '2024-01-20': '설날 연휴',
    },
  },
};

export const WithNotifications: Story = {
  name: '알림 표시',
  args: {
    ...baseArgs,
    filteredEvents: mockEvents,
    events: mockEvents,
    notifiedEvents: ['1'],
  },
};

export const WithOverlappingEvents: Story = {
  name: '겹치는 일정',
  args: {
    ...baseArgs,
    view: 'week',
    filteredEvents: [
      {
        id: '1',
        title: '회의 A',
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '첫 번째 회의',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '회의 B',
        date: '2024-01-15',
        startTime: '10:30',
        endTime: '11:30',
        description: '겹치는 회의',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '회의 C',
        date: '2024-01-15',
        startTime: '10:45',
        endTime: '11:15',
        description: '또 겹치는 회의',
        location: '회의실 C',
        category: '개인',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ],
    events: [
      {
        id: '1',
        title: '회의 A',
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '첫 번째 회의',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '회의 B',
        date: '2024-01-15',
        startTime: '10:30',
        endTime: '11:30',
        description: '겹치는 회의',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '회의 C',
        date: '2024-01-15',
        startTime: '10:45',
        endTime: '11:15',
        description: '또 겹치는 회의',
        location: '회의실 C',
        category: '개인',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ],
  },
};

export const WithMultipleDays: Story = {
  name: '여러 날짜에 일정 분산',
  args: {
    ...baseArgs,
    filteredEvents: [
      {
        id: '1',
        title: '프로젝트 시작',
        date: '2024-01-05',
        startTime: '09:00',
        endTime: '10:00',
        description: '새 프로젝트 킥오프',
        location: '본사',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '중간 점검',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '15:00',
        description: '프로젝트 진행 상황 점검',
        location: '회의실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '최종 발표',
        date: '2024-01-25',
        startTime: '16:00',
        endTime: '17:00',
        description: '프로젝트 최종 발표',
        location: '대회의실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ],
    events: [
      {
        id: '1',
        title: '프로젝트 시작',
        date: '2024-01-05',
        startTime: '09:00',
        endTime: '10:00',
        description: '새 프로젝트 킥오프',
        location: '본사',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '중간 점검',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '15:00',
        description: '프로젝트 진행 상황 점검',
        location: '회의실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '최종 발표',
        date: '2024-01-25',
        startTime: '16:00',
        endTime: '17:00',
        description: '프로젝트 최종 발표',
        location: '대회의실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ],
  },
};

export const BusyDay: Story = {
  name: '바쁜 하루',
  args: {
    ...baseArgs,
    view: 'week',
    filteredEvents: [
      {
        id: '1',
        title: '아침 미팅',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '일일 스탠드업',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기획 회의',
        date: '2024-01-15',
        startTime: '11:00',
        endTime: '12:00',
        description: '신규 기능 기획',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '점심',
        date: '2024-01-15',
        startTime: '12:00',
        endTime: '13:00',
        description: '팀 점심',
        location: '식당',
        category: '개인',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '개발',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '16:00',
        description: '코딩 시간',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '5',
        title: '데일리 리뷰',
        date: '2024-01-15',
        startTime: '17:00',
        endTime: '18:00',
        description: '오늘 작업 리뷰',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ],
    events: [
      {
        id: '1',
        title: '아침 미팅',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '일일 스탠드업',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기획 회의',
        date: '2024-01-15',
        startTime: '11:00',
        endTime: '12:00',
        description: '신규 기능 기획',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '점심',
        date: '2024-01-15',
        startTime: '12:00',
        endTime: '13:00',
        description: '팀 점심',
        location: '식당',
        category: '개인',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '개발',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '16:00',
        description: '코딩 시간',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '5',
        title: '데일리 리뷰',
        date: '2024-01-15',
        startTime: '17:00',
        endTime: '18:00',
        description: '오늘 작업 리뷰',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ],
  },
};

// 6. 반복 일정 - 매주
export const WithWeeklyRepeat: Story = {
  name: '반복 일정 (매주)',
  args: (() => {
    const weeklyEvent = {
      id: '1',
      title: '주간 회의',
      date: '2024-01-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '매주 월요일 팀 회의',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'weekly' as const,
        interval: 1,
        endDate: '2024-01-31',
      },
      notificationTime: 10,
    };

    const expandedEvents = generateRepeatEvents(weeklyEvent).map((e, idx) => ({
      ...e,
      id: `weekly-${idx}`,
    }));

    return {
      ...baseArgs,
      filteredEvents: expandedEvents,
      events: expandedEvents,
    };
  })(),
};

export const WithDailyRepeat: Story = {
  name: '반복 일정 (매일)',
  args: (() => {
    const dailyEvent = {
      id: '1',
      title: '아침 스탠드업',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '09:30',
      description: '매일 아침 스탠드업 미팅',
      location: '사무실',
      category: '업무',
      repeat: {
        type: 'daily' as const,
        interval: 1,
        endDate: '2024-01-21',
      },
      notificationTime: 10,
    };

    const expandedEvents = generateRepeatEvents(dailyEvent).map((e, idx) => ({
      ...e,
      id: `daily-${idx}`,
    }));

    return {
      ...baseArgs,
      view: 'week',
      filteredEvents: expandedEvents,
      events: expandedEvents,
    };
  })(),
};

export const ComplexScenario: Story = {
  name: '복합 (공휴일 + 일정 + 알림)',
  args: {
    ...baseArgs,
    filteredEvents: [
      {
        id: '1',
        title: '중요한 회의',
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '꼭 참석해야 함',
        location: '본사',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '생일 파티',
        date: '2024-01-20',
        startTime: '18:00',
        endTime: '20:00',
        description: '친구 생일',
        location: '레스토랑',
        category: '개인',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 60,
      },
    ],
    events: [
      {
        id: '1',
        title: '중요한 회의',
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '꼭 참석해야 함',
        location: '본사',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '생일 파티',
        date: '2024-01-20',
        startTime: '18:00',
        endTime: '20:00',
        description: '친구 생일',
        location: '레스토랑',
        category: '개인',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 60,
      },
    ],
    notifiedEvents: ['1'],
    holidays: {
      '2024-01-01': '신정',
      '2024-01-20': '설날',
    },
  },
};
