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
  notifiedEvents: string[];
  holidays: Record<string, string>;
  navigate: (direction: 'prev' | 'next') => void;
}

export default function CalendarView({
  view,
  setView,
  currentDate,
  filteredEvents,
  notifiedEvents,
  holidays,
  navigate,
}: CalendarViewProps) {
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

    // UI만 작동하도록 실제 업데이트는 하지 않음
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
