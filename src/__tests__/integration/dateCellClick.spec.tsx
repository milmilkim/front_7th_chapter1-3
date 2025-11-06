import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';

import { setupMockHandlerCreation, setupMockHandlerUpdating } from '../../__mocks__/handlersUtils';
import App from '../../App';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('날짜 셀 클릭 통합 테스트', () => {
  it('월간 뷰에서 빈 날짜 셀을 클릭하면 폼의 날짜 필드가 해당 날짜로 채워진다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    const monthView = screen.getByTestId('month-view');
    const dateCell = within(monthView).getByText('15').closest('td');
    await user.click(dateCell!);

    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-10-15');
  });

  it('주간 뷰에서 빈 날짜 셀을 클릭하면 폼의 날짜 필드가 해당 날짜로 채워진다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    const weekView = screen.getByTestId('week-view');
    const dateCell = within(weekView).getByText('2').closest('td');
    await user.click(dateCell!);

    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-10-02');
  });

  it('날짜 셀 클릭 후 바로 일정을 작성하고 제출하면 해당 날짜에 일정이 생성된다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    const monthView = screen.getByTestId('month-view');
    const dateCell = within(monthView).getByText('15').closest('td');
    await user.click(dateCell!);

    await user.type(screen.getByLabelText('제목'), '셀 클릭 테스트');
    await user.type(screen.getByLabelText('시작 시간'), '10:00');
    await user.type(screen.getByLabelText('종료 시간'), '11:00');
    await user.type(screen.getByLabelText('설명'), '셀 클릭으로 생성된 일정');
    await user.type(screen.getByLabelText('위치'), '회의실 A');

    await user.click(screen.getByLabelText('카테고리'));
    await user.click(within(screen.getByLabelText('카테고리')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '업무-option' }));

    await user.click(screen.getByTestId('event-submit-button'));

    await screen.findByText('일정이 추가되었습니다');

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('셀 클릭 테스트')).toBeInTheDocument();
    expect(eventList.getByText('2025-10-15')).toBeInTheDocument();
  });

  it('수정 모드에서 다른 날짜 셀을 클릭하면 수정이 취소되고 폼이 리셋되며 새 날짜가 설정된다', async () => {
    setupMockHandlerUpdating();

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);

    const titleInput = screen.getByLabelText('제목') as HTMLInputElement;
    expect(titleInput.value).toBe('기존 회의');
    expect(screen.getByText('일정 수정', { selector: 'h4' })).toBeInTheDocument();

    const monthView = screen.getByTestId('month-view');
    const dateCell = within(monthView).getByText('20').closest('td');
    await user.click(dateCell!);

    expect(screen.getByText('일정 추가', { selector: 'h4' })).toBeInTheDocument();
    expect(titleInput.value).toBe('');

    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-10-20');
  });

  it('신규 등록 중 폼에 내용이 있을 때 셀을 클릭하면 날짜만 변경되고 다른 내용은 유지된다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    const titleInput = screen.getByLabelText('제목');
    await user.type(titleInput, '새 회의');
    await user.type(screen.getByLabelText('시작 시간'), '14:00');
    await user.type(screen.getByLabelText('종료 시간'), '15:00');
    await user.type(screen.getByLabelText('설명'), '중요한 회의');

    expect((titleInput as HTMLInputElement).value).toBe('새 회의');
    expect((screen.getByLabelText('설명') as HTMLInputElement).value).toBe('중요한 회의');

    const monthView = screen.getByTestId('month-view');
    const dateCell = within(monthView).getByText('25').closest('td');
    await user.click(dateCell!);

    expect((titleInput as HTMLInputElement).value).toBe('새 회의');
    expect((screen.getByLabelText('설명') as HTMLInputElement).value).toBe('중요한 회의');
    expect((screen.getByLabelText('시작 시간') as HTMLInputElement).value).toBe('14:00');
    expect((screen.getByLabelText('종료 시간') as HTMLInputElement).value).toBe('15:00');

    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-10-25');
  });

  it('폼에 내용이 있을 때 이미 존재하는 이벤트의 수정 버튼을 클릭하면 수정 상태로 변경된다', async () => {
    setupMockHandlerUpdating();

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    await user.type(screen.getByLabelText('제목'), '입력 중인 일정');
    await user.type(screen.getByLabelText('설명'), '입력 중인 설명');

    const titleInput = screen.getByLabelText('제목') as HTMLInputElement;
    expect(titleInput.value).toBe('입력 중인 일정');

    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);

    expect(screen.getByText('일정 수정', { selector: 'h4' })).toBeInTheDocument();

    expect(titleInput.value).toBe('기존 회의');
    expect((screen.getByLabelText('설명') as HTMLInputElement).value).toBe('기존 팀 미팅');
  });

  it('EventBox를 클릭해도 날짜 셀 클릭 이벤트가 발생하지 않는다 (stopPropagation)', async () => {
    setupMockHandlerUpdating();

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    const dateInputBefore = screen.getByLabelText('날짜') as HTMLInputElement;
    const dateValueBefore = dateInputBefore.value;

    const monthView = screen.getByTestId('month-view');
    const eventBox = within(monthView).getByText('기존 회의').closest('div');

    await user.click(eventBox!);

    const dateInputAfter = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInputAfter.value).toBe(dateValueBefore);

    expect(screen.getByText('일정 추가', { selector: 'h4' })).toBeInTheDocument();
  });
});
