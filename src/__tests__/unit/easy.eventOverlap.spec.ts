import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2025-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const result = parseDateTime('2025-07-01', '14:30');
    expect(result).toEqual(new Date('2025-07-01T14:30:00'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2025/07/01', '14:30');
    expect(result.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2025-07-01', '25:00');
    expect(result.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('', '14:30');
    expect(result.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const event: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
      title: '테스트 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = convertEventToDateRange(event);
    expect(result.start).toEqual(new Date('2025-07-01T14:30:00'));
    expect(result.end).toEqual(new Date('2025-07-01T15:30:00'));
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      id: '5',
      date: '2025/07/01', // 잘못된 형식
      startTime: '14:30',
      endTime: '15:30',
      title: '잘못된 날짜 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = convertEventToDateRange(event);
    expect(result.start.toString()).toBe('Invalid Date');
    expect(result.end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      id: '6',
      date: '2025-07-01',
      startTime: '25:00', // 잘못된 형식
      endTime: '26:00', // 잘못된 형식
      title: '잘못된 시간 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = convertEventToDateRange(event);
    expect(result.start.toString()).toBe('Invalid Date');
    expect(result.end.toString()).toBe('Invalid Date');
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '이벤트 1',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '15:00',
      endTime: '17:00',
      title: '이벤트 2',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '이벤트 1',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '16:00',
      endTime: '18:00',
      title: '이벤트 2',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(false);
  });

  it('이벤트1이 이벤트2를 완전히 포함하는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '10:00',
      endTime: '18:00',
      title: '긴 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '짧은 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('이벤트2가 이벤트1을 완전히 포함하는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '짧은 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '10:00',
      endTime: '18:00',
      title: '긴 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('자정(00:00)을 포함하는 이벤트도 정확히 겹침을 판단한다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '00:00',
      endTime: '02:00',
      title: '자정 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '01:00',
      endTime: '03:00',
      title: '새벽 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('23:59를 포함하는 이벤트도 정확히 겹침을 판단한다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '22:00',
      endTime: '23:59',
      title: '밤 늦은 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '23:00',
      endTime: '23:59',
      title: '자정 직전 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('시작 시간이 동일한 이벤트는 겹친다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '15:00',
      title: '이벤트 1',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '이벤트 2',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('종료 시간이 동일한 이벤트는 겹친다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '이벤트 1',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '15:00',
      endTime: '16:00',
      title: '이벤트 2',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('완전히 동일한 시간대의 이벤트는 겹친다', () => {
    const event1: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '이벤트 1',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const event2: Event = {
      id: '2',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '16:00',
      title: '이벤트 2',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });
});

describe('findOverlappingEvents', () => {
  const baseEvents: Event[] = [
    {
      id: '1',
      date: '2025-07-01',
      startTime: '10:00',
      endTime: '12:00',
      title: '이벤트 1',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '2',
      date: '2025-07-01',
      startTime: '11:00',
      endTime: '13:00',
      title: '이벤트 2',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '3',
      date: '2025-07-01',
      startTime: '15:00',
      endTime: '16:00',
      title: '이벤트 3',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: '4',
      date: '2025-07-01',
      startTime: '11:30',
      endTime: '14:30',
      title: '새 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = findOverlappingEvents(newEvent, baseEvents);
    expect(result).toEqual([baseEvents[0], baseEvents[1]]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '4',
      date: '2025-07-01',
      startTime: '13:00',
      endTime: '15:00',
      title: '새 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = findOverlappingEvents(newEvent, baseEvents);
    expect(result).toHaveLength(0);
  });

  it('자기 자신과 같은 ID를 가진 이벤트는 제외한다', () => {
    const draggedEvent: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '10:30',
      endTime: '12:30',
      title: '드래그된 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = findOverlappingEvents(draggedEvent, baseEvents);
    expect(result).toEqual([baseEvents[1]]);
  });

  it('빈 이벤트 배열에서는 항상 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '1',
      date: '2025-07-01',
      startTime: '10:00',
      endTime: '12:00',
      title: '새 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = findOverlappingEvents(newEvent, []);
    expect(result).toEqual([]);
  });

  it('여러 개의 겹치는 이벤트를 모두 찾는다', () => {
    const manyEvents: Event[] = [
      {
        id: '1',
        date: '2025-07-01',
        startTime: '10:00',
        endTime: '11:00',
        title: '이벤트 1',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      {
        id: '2',
        date: '2025-07-01',
        startTime: '10:30',
        endTime: '11:30',
        title: '이벤트 2',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      {
        id: '3',
        date: '2025-07-01',
        startTime: '11:00',
        endTime: '12:00',
        title: '이벤트 3',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      {
        id: '4',
        date: '2025-07-01',
        startTime: '13:00',
        endTime: '14:00',
        title: '이벤트 4',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ];
    const newEvent: Event = {
      id: '5',
      date: '2025-07-01',
      startTime: '10:15',
      endTime: '11:45',
      title: '새 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = findOverlappingEvents(newEvent, manyEvents);
    expect(result).toHaveLength(3);
    expect(result).toEqual([manyEvents[0], manyEvents[1], manyEvents[2]]);
  });

  it('다른 날짜의 이벤트는 겹침 검사에서 제외된다', () => {
    const multiDateEvents: Event[] = [
      {
        id: '1',
        date: '2025-07-01',
        startTime: '10:00',
        endTime: '12:00',
        title: '7월 1일 이벤트',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      {
        id: '2',
        date: '2025-07-02',
        startTime: '10:00',
        endTime: '12:00',
        title: '7월 2일 이벤트',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ];
    const newEvent: Event = {
      id: '3',
      date: '2025-07-01',
      startTime: '11:00',
      endTime: '13:00',
      title: '7월 1일 새 이벤트',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = findOverlappingEvents(newEvent, multiDateEvents);
    expect(result).toEqual([multiDateEvents[0]]);
  });
});
