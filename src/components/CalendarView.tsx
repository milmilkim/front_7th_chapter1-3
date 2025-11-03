import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

import { Event } from '../types';
import MonthView from './MonthView';
import RecurringEventDialog from './RecurringEventDialog';
import WeekView from './WeekView';
import { findOverlappingEvents } from '../utils/eventOverlap';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarViewProps {
  view: 'week' | 'month';
  setView: (value: 'week' | 'month') => void;
  currentDate: Date;
  filteredEvents: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  notifiedEvents: string[];
  holidays: Record<string, string>;
  navigate: (direction: 'prev' | 'next') => void;
  updateEvent: (eventData: Event) => Promise<void>;
  events: Event[];
  onDateCellClick: (dateString: string) => void;
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
  updateEvent,
  events,
  onDateCellClick,
}: CalendarViewProps) {
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
  const [pendingDragEvent, setPendingDragEvent] = useState<{
    event: Event;
    newDate: string;
    originalDate: string; // 롤백용
  } | null>(null);

  // 낙관적 업데이트 + 실제 업데이트를 한번에 처리
  const applyEventUpdate = async (event: Event, newDate: string, clearRepeat = false) => {
    const updatedEvent = {
      ...event,
      date: newDate,
      // 반복 일정에서 하나만 분리할 때는 repeat 정보 제거
      ...(clearRepeat && {
        repeat: {
          type: 'none' as const,
          interval: 0,
        },
      }),
    };

    // 낙관적 업데이트
    setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? updatedEvent : e)));

    // 실제로 업데이트
    await updateEvent(updatedEvent);
  };

  const handleRecurringDragConfirm = async () => {
    if (!pendingDragEvent) return;

    const { event, newDate } = pendingDragEvent;
    setIsRecurringDialogOpen(false);

    // "예" 선택 - 이미 낙관적으로 이동되어 있으므로 서버만 업데이트
    // 반복 정보는 제거해야 함
    const updatedEvent = {
      ...event,
      date: newDate,
      repeat: {
        type: 'none' as const,
        interval: 0,
      },
    };
    await updateEvent(updatedEvent);

    setPendingDragEvent(null);
  };

  const handleRecurringDragCancel = () => {
    if (!pendingDragEvent) return;

    const { event, originalDate } = pendingDragEvent;
    setIsRecurringDialogOpen(false);

    // "취소" 선택 - 원래 위치로 롤백
    const revertedEvent = { ...event, date: originalDate };
    setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? revertedEvent : e)));

    setPendingDragEvent(null);
  };

  const handleOverlapDragConfirm = async () => {
    if (!pendingDragEvent) return;

    const { event, newDate } = pendingDragEvent;
    setIsOverlapDialogOpen(false);

    // "예" 선택 - 이미 낙관적으로 이동되어 있으므로 서버만 업데이트
    const updatedEvent = { ...event, date: newDate };
    await updateEvent(updatedEvent);

    setPendingDragEvent(null);
  };

  const handleOverlapDragCancel = () => {
    if (!pendingDragEvent) return;

    const { event, originalDate } = pendingDragEvent;
    setIsOverlapDialogOpen(false);

    // "취소" 선택 - 원래 위치로 롤백
    const revertedEvent = { ...event, date: originalDate };
    setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? revertedEvent : e)));

    setPendingDragEvent(null);
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

    const toDate = destination.droppableId;

    const currentEvent = filteredEvents.find((event) => event.id === draggableId);

    if (!currentEvent) {
      console.error('Event not found');
      return;
    }

    const isRecurring = currentEvent?.repeat.type !== 'none' && currentEvent?.repeat.interval > 0;

    const newEvent = {
      ...currentEvent,
      date: toDate,
    };

    // 먼저 낙관적 업데이트 (UI에서 바로 이동)
    setEvents((prevEvents) => prevEvents.map((e) => (e.id === currentEvent.id ? newEvent : e)));

    if (isRecurring) {
      // 반복 일정인 경우, 이 일정 하나만 변경할지 물어본다.
      // 예 -> 확정 (repeat 제거하고 서버 업데이트)
      // 취소 -> 원래 위치로 롤백
      setPendingDragEvent({
        event: currentEvent,
        newDate: toDate,
        originalDate: currentEvent.date,
      });
      setIsRecurringDialogOpen(true);
    } else {
      // 일반 일정인 경우, 겹침 여부를 확인한다
      const overlapping = findOverlappingEvents(newEvent, events);

      if (overlapping.length > 0) {
        // 겹침 -> 겹침 경고 띄우고 예/취소
        setPendingDragEvent({
          event: currentEvent,
          newDate: toDate,
          originalDate: currentEvent.date,
        });
        setOverlappingEvents(overlapping);
        setIsOverlapDialogOpen(true);
      } else {
        // 겹침 없으면 바로 서버 업데이트
        applyEventUpdate(currentEvent, toDate);
      }
    }
  };

  return (
    <>
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
              onDateCellClick={onDateCellClick}
            />
          )}
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              holidays={holidays}
              weekDays={weekDays}
              onDateCellClick={onDateCellClick}
            />
          )}
        </Stack>
      </DragDropContext>

      <Dialog open={isOverlapDialogOpen} onClose={handleOverlapDragCancel}>
        <DialogTitle>일정 겹침 경고</DialogTitle>
        <DialogContent>
          <DialogContentText>다음 일정과 겹칩니다:</DialogContentText>
          {overlappingEvents.map((event) => (
            <Typography key={event.id} sx={{ ml: 1, mb: 1 }}>
              {event.title} ({event.date} {event.startTime}-{event.endTime})
            </Typography>
          ))}
          <DialogContentText>계속 진행하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOverlapDragCancel}>취소</Button>
          <Button color="error" onClick={handleOverlapDragConfirm}>
            계속 진행
          </Button>
        </DialogActions>
      </Dialog>

      <RecurringEventDialog
        open={isRecurringDialogOpen}
        onClose={handleRecurringDragCancel}
        onConfirm={handleRecurringDragConfirm}
        event={pendingDragEvent?.event || null}
        mode="drag"
      />
    </>
  );
}
