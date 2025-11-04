import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import EventBox from '../components/EventBox';
import { Event } from '../types';

const EventBoxWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ width: 200, border: '1px dashed #ccc', p: 1 }}>{children}</Box>
);

const meta = {
  title: '5. 텍스트 길이 처리/일정 박스 텍스트',
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

export const VeryShortTitle: Story = {
  name: '매우 짧은 제목 (1-2글자)',
  args: {
    event: {
      ...normalEvent,
      title: '회의',
    },
    isNotified: false,
  },
};

export const NormalTitle: Story = {
  name: '일반 제목 (5-10글자)',
  args: {
    event: {
      ...normalEvent,
      title: '팀 미팅',
    },
    isNotified: false,
  },
};

export const MediumTitle: Story = {
  name: '중간 길이 제목',
  args: {
    event: {
      ...normalEvent,
      title: '2024년 1분기 프로젝트 회의',
    },
    isNotified: false,
  },
};

export const LongTitle: Story = {
  name: '긴 제목 (overflow 발생)',
  args: {
    event: {
      ...normalEvent,
      title: '2024년 1분기 프로젝트 최종 발표 및 리뷰 미팅',
    },
    isNotified: false,
  },
};

export const VeryLongTitle: Story = {
  name: '매우 긴 제목',
  args: {
    event: {
      ...normalEvent,
      title:
        '2024년도 전사 통합 디지털 트랜스포메이션 프로젝트 1분기 최종 결과 발표 및 향후 계획 수립을 위한 전략 회의',
    },
    isNotified: false,
  },
};

export const LongTitleWithNotification: Story = {
  name: '긴 제목 + 알림 아이콘',
  args: {
    event: {
      ...normalEvent,
      title: '매주 진행되는 프로젝트 진행 상황 점검 및 이슈 논의 미팅',
    },
    isNotified: true,
  },
};

export const LongTitleWithRepeat: Story = {
  name: '긴 제목 + 반복 아이콘',
  args: {
    event: {
      ...normalEvent,
      title: '매주 진행되는 프로젝트 진행 상황 점검 및 이슈 논의 미팅',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: false,
  },
};

export const LongTitleWithBothIcons: Story = {
  name: '긴 제목 + 알림 + 반복 (텍스트 영역 최소)',
  args: {
    event: {
      ...normalEvent,
      title: '매주 진행되는 프로젝트 진행 상황 점검 및 이슈 논의 미팅',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: true,
  },
};

export const LongEnglishTitle: Story = {
  name: '영문 긴 제목',
  args: {
    event: {
      ...normalEvent,
      title: 'Q1 2024 Digital Transformation Project Final Presentation and Strategy Meeting',
    },
    isNotified: false,
  },
};

export const LongTitleWithNumbers: Story = {
  name: '숫자 포함 긴 제목',
  args: {
    event: {
      ...normalEvent,
      title: '2024년 1분기 실적 보고 및 2분기 목표 수립 회의 (참석자 15명)',
    },
    isNotified: false,
  },
};
