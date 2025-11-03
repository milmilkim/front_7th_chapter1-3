import { Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import EventBox from './EventBox';
import { Event } from '../types';
import { formatWeek, getWeekDates } from '../utils/dateUtils';

interface WeekViewProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  weekDays: string[];
  onDateCellClick: (dateString: string) => void;
}

const WeekView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  weekDays,
  onDateCellClick,
}: WeekViewProps) => {
  const weekDates = getWeekDates(currentDate);

  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDates.map((date) => {
                const dateString = date.toISOString().split('T')[0];
                const eventsForDay = filteredEvents.filter(
                  (event) => new Date(event.date).toDateString() === date.toDateString()
                );

                return (
                  <TableCell
                    key={date.toISOString()}
                    onClick={() => onDateCellClick(dateString)}
                    sx={{
                      height: '120px',
                      verticalAlign: 'top',
                      width: '14.28%',
                      padding: 1,
                      border: '1px solid #e0e0e0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {date.getDate()}
                    </Typography>
                    <Droppable droppableId={dateString}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: '80px',
                            backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                            transition: 'background-color 0.2s',
                          }}
                        >
                          {eventsForDay.map((event, index) => (
                            <Draggable key={event.id} draggableId={event.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.5 : 1,
                                  }}
                                >
                                  <EventBox
                                    event={event}
                                    isNotified={notifiedEvents.includes(event.id)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default WeekView;
