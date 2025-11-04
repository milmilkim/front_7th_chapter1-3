import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import EventForm from '../components/EventForm';
import { Event } from '../types';

const mockEditingEvent: Event = {
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
  title: '4. 폼 컨트롤 상태/일정 폼',
  component: EventForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <Box sx={{ '& > *': { width: '100% !important' } }}>
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof EventForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: '빈 폼 (신규 추가)',
  args: {
    title: '',
    setTitle: fn(),
    date: '',
    setDate: fn(),
    startTime: '',
    endTime: '',
    description: '',
    setDescription: fn(),
    location: '',
    setLocation: fn(),
    category: '업무',
    setCategory: fn(),
    isRepeating: false,
    setIsRepeating: fn(),
    repeatType: 'none',
    setRepeatType: fn(),
    repeatInterval: 1,
    setRepeatInterval: fn(),
    repeatEndDate: '',
    setRepeatEndDate: fn(),
    notificationTime: 10,
    setNotificationTime: fn(),
    startTimeError: null,
    endTimeError: null,
    editingEvent: null,
    handleStartTimeChange: fn(),
    handleEndTimeChange: fn(),
    addOrUpdateEvent: fn(),
  },
};

export const Filled: Story = {
  name: '입력된 폼 (신규 추가)',
  args: {
    ...Empty.args,
    title: '새 회의',
    date: '2024-01-20',
    startTime: '14:00',
    endTime: '15:00',
    description: '프로젝트 논의',
    location: '회의실 B',
    category: '업무',
    notificationTime: 60,
  },
};

export const EditMode: Story = {
  name: '수정 모드',
  args: {
    ...Filled.args,
    title: mockEditingEvent.title,
    date: mockEditingEvent.date,
    startTime: mockEditingEvent.startTime,
    endTime: mockEditingEvent.endTime,
    description: mockEditingEvent.description,
    location: mockEditingEvent.location,
    category: mockEditingEvent.category,
    notificationTime: mockEditingEvent.notificationTime,
    editingEvent: mockEditingEvent,
  },
};

export const WithDailyRepeat: Story = {
  name: '반복 일정 - 매일',
  args: {
    ...Filled.args,
    isRepeating: true,
    repeatType: 'daily',
    repeatInterval: 1,
    repeatEndDate: '2024-12-31',
  },
};

export const WithWeeklyRepeat: Story = {
  name: '반복 일정 - 매주',
  args: {
    ...Filled.args,
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 1,
    repeatEndDate: '2024-12-31',
  },
};

export const WithBiWeeklyRepeat: Story = {
  name: '반복 일정 - 2주마다',
  args: {
    ...Filled.args,
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 2,
    repeatEndDate: '2024-12-31',
  },
};

// 7. 시작 시간 에러
export const WithStartTimeError: Story = {
  name: '시작 시간 에러',
  args: {
    ...Filled.args,
    startTime: '15:00',
    endTime: '14:00', // 종료가 시작보다 빠름
    startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
  },
};

export const WithEndTimeError: Story = {
  name: '종료 시간 에러',
  args: {
    ...Filled.args,
    startTime: '15:00',
    endTime: '14:00',
    endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
  },
};

export const PersonalCategory: Story = {
  name: '개인 카테고리',
  args: {
    ...Filled.args,
    title: '치과 예약',
    category: '개인',
    location: '강남 치과',
  },
};

export const FamilyCategory: Story = {
  name: '가족 카테고리',
  args: {
    ...Filled.args,
    title: '가족 여행',
    category: '가족',
    location: '제주도',
  },
};

export const OneDayBeforeNotification: Story = {
  name: '알림 - 1일 전',
  args: {
    ...Filled.args,
    notificationTime: 1440,
  },
};
