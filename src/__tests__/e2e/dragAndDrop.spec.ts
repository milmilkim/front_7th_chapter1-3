import { test, expect } from './fixtures';
import { dragAndDrop } from './helpers';

test.describe('드래그 앤 드롭 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('월간 뷰에서 일반 일정을 다른 날짜로 드래그하면 날짜가 변경된다', async ({ page }) => {
    await page.getByLabel('제목').fill('이동할 일정');
    await page.getByLabel('날짜').fill('2025-11-05');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const monthView = page.getByTestId('month-view');
    const sourceEvent = monthView.getByText('이동할 일정');
    const targetCell = page.locator('[data-rfd-droppable-id="2025-11-10"]');

    await dragAndDrop(page, sourceEvent, targetCell);

    await page.getByText('일정이 수정되었습니다').waitFor({ timeout: 5000 });

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('이동할 일정')).toBeVisible();
    await expect(eventList.getByText('2025-11-10')).toBeVisible();

    const nov5Cell = page.locator('[data-rfd-droppable-id="2025-11-05"]');
    await expect(nov5Cell.getByText('이동할 일정')).not.toBeVisible();

    const nov10Cell = page.locator('[data-rfd-droppable-id="2025-11-10"]');
    await expect(nov10Cell.getByText('이동할 일정')).toBeVisible();
  });

  test('주간 뷰에서 일반 일정을 다른 날짜로 드래그하면 날짜가 변경된다', async ({ page }) => {
    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    await page.getByLabel('제목').fill('주간 이동 테스트');
    await page.getByLabel('날짜').fill('2025-11-04');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const weekView = page.getByTestId('week-view');
    const sourceEvent = weekView.getByText('주간 이동 테스트');
    const targetCell = page.locator('[data-rfd-droppable-id="2025-11-06"]');

    await dragAndDrop(page, sourceEvent, targetCell);

    await page.getByText('일정이 수정되었습니다').waitFor({ timeout: 5000 });

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('주간 이동 테스트')).toBeVisible();
    await expect(eventList.getByText('2025-11-06')).toBeVisible();
  });

  test('반복 일정 드래그 시 확인 다이얼로그가 표시되고 단일 이동된다', async ({ page }) => {
    await page.getByLabel('제목').fill('반복 회의');
    await page.getByLabel('날짜').fill('2025-11-04');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'daily-option' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-10');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const firstEvent = page.getByText('반복 회의').first();
    const targetCell = page.locator('[data-rfd-droppable-id="2025-11-12"]');

    await dragAndDrop(page, firstEvent, targetCell);

    await expect(page.getByText('반복 일정 이동')).toBeVisible();
    await expect(page.getByText('해당 일정만 이동하시겠어요?')).toBeVisible();

    await page.getByRole('button', { name: '예' }).click();

    await page.getByText('일정이 수정되었습니다').waitFor({ timeout: 5000 });

    const eventList = page.getByTestId('event-list');
    const events = eventList.getByText('반복 회의');
    await expect(events.first()).toBeVisible();

    await expect(eventList.getByText('2025-11-12')).toBeVisible();
  });

  test('드래그 중 겹침이 발생하면 경고 다이얼로그가 표시되고 계속 진행 가능', async ({ page }) => {
    await page.getByLabel('제목').fill('고정 일정');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('제목').fill('이동할 일정');
    await page.getByLabel('날짜').fill('2025-11-05');
    await page.getByLabel('시작 시간').fill('10:30');
    await page.getByLabel('종료 시간').fill('11:30');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const monthView = page.getByTestId('month-view');
    const sourceEvent = monthView.getByText('이동할 일정');
    const targetCell = page.locator('[data-rfd-droppable-id="2025-11-10"]');

    await dragAndDrop(page, sourceEvent, targetCell);

    await page.getByText('일정 겹침 경고').waitFor({ timeout: 5000 });
    await expect(page.getByText('계속 진행하시겠습니까?')).toBeVisible();

    await page.getByRole('button', { name: '계속 진행' }).click();

    await page.getByText('일정이 수정되었습니다').waitFor({ timeout: 5000 });

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('고정 일정')).toBeVisible();
    await expect(eventList.getByText('이동할 일정')).toBeVisible();

    const nov10Dates = eventList.getByText('2025-11-10');
    await expect(nov10Dates.first()).toBeVisible();
  });
});
