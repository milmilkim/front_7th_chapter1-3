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
import { formatDate, formatMonth, getEventsForDay, getWeeksAtMonth } from '../utils/dateUtils';
interface MonthViewProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  holidays: Record<string, string>;
  weekDays: string[];
  onDateCellClick: (dateString: string) => void;
}

const MonthView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  holidays,
  weekDays,
  onDateCellClick,
}: MonthViewProps) => {
  const weeks = getWeeksAtMonth(currentDate);

  return (
    <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatMonth(currentDate)}</Typography>
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
            {weeks.map((week, weekIndex) => (
              <TableRow key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dateString = day ? formatDate(currentDate, day) : '';
                  const holiday = holidays[dateString];
                  const eventsForDay = day ? getEventsForDay(filteredEvents, day) : [];

                  return (
                    <TableCell
                      key={dayIndex}
                      onClick={() => day && onDateCellClick(dateString)}
                      sx={{
                        height: '120px',
                        verticalAlign: 'top',
                        width: '14.28%',
                        padding: 1,
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: day ? 'pointer' : 'default',
                        '&:hover': day
                          ? {
                              backgroundColor: '#f5f5f5',
                            }
                          : {},
                      }}
                    >
                      {day && (
                        <>
                          <Typography variant="body2" fontWeight="bold">
                            {day}
                          </Typography>
                          {holiday && (
                            <Typography variant="body2" color="error">
                              {holiday}
                            </Typography>
                          )}
                          <Droppable droppableId={dateString}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                  minHeight: '60px',
                                  backgroundColor: snapshot.isDraggingOver
                                    ? '#e3f2fd'
                                    : 'transparent',
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
                        </>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default MonthView;
