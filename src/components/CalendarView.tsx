import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';

import { Event } from '../types';
import MonthView from './MonthView';
import WeekView from './WeekView';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarViewProps {
  view: 'week' | 'month';
  setView: (value: 'week' | 'month') => void;
  currentDate: Date;
  filteredEvents: Event[];
  setEvents: (events: Event[]) => void;
  notifiedEvents: string[];
  holidays: Record<string, string>;
  navigate: (direction: 'prev' | 'next') => void;
  onUpdateEvent: (event: Event, newDate: string) => void;
}

export default function CalendarView({
  view,
  setView,
  currentDate,
  filteredEvents,
  setEvents,
  notifiedEvents,
  holidays,
  navigate,
  onUpdateEvent,
}: CalendarViewProps) {
  const updateEvent = (event: Event, from: string, to: string) => {
    // from, to는 'YYYY-MM-DD' 형식의 날짜 문자열
    onUpdateEvent(event, to);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // 드롭 위치가 없으면 취소
    if (!destination) {
      return;
    }

    // 같은 위치면 취소
    if (source.droppableId === destination.droppableId) {
      return;
    }

    console.log('드래그 완료:', {
      eventId: draggableId,
      from: source.droppableId,
      to: destination.droppableId,
    });

    // 낙관적 업데이트
    const currentEvent = filteredEvents.find((event) => event.id === draggableId);

    if (!currentEvent) {
      console.error('Event not found');
      return;
    }
    const newFilteredEvents = filteredEvents.filter((event) => event.id !== draggableId);
    setEvents([...newFilteredEvents, { ...currentEvent, date: destination.droppableId }]);

    // TODO:
    updateEvent(currentEvent, source.droppableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack flex={1} spacing={5}>
        <Typography variant="h4">일정 보기</Typography>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
            <ChevronLeft />
          </IconButton>
          <Select
            size="small"
            aria-label="뷰 타입 선택"
            value={view}
            onChange={(e) => setView(e.target.value as 'week' | 'month')}
          >
            <MenuItem value="week" aria-label="week-option">
              Week
            </MenuItem>
            <MenuItem value="month" aria-label="month-option">
              Month
            </MenuItem>
          </Select>
          <IconButton aria-label="Next" onClick={() => navigate('next')}>
            <ChevronRight />
          </IconButton>
        </Stack>
        {view === 'week' && (
          <WeekView
            weekDays={weekDays}
            currentDate={currentDate}
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
          />
        )}
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            holidays={holidays}
            weekDays={weekDays}
          />
        )}
      </Stack>
    </DragDropContext>
  );
}
