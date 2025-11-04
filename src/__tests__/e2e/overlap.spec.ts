import { test, expect } from './fixtures';
import { dragAndDrop } from './helpers';

test.describe('일정 겹침 처리 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('일반 일정 생성 시 겹치면 경고 다이얼로그가 표시된다', async ({ page }) => {
    await page.getByLabel('제목').fill('기존 일정');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('제목').fill('겹치는 일정');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:30');
    await page.getByLabel('종료 시간').fill('11:30');
    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByText('일정 겹침 경고')).toBeVisible();
    await expect(page.getByText('다음 일정과 겹칩니다:')).toBeVisible();
    await expect(page.getByText(/기존 일정.*2025-11-10.*10:00-11:00/)).toBeVisible();
    await expect(page.getByText('계속 진행하시겠습니까?')).toBeVisible();
  });

  test('겹침 경고에서 계속 진행을 선택하면 일정이 추가된다', async ({ page }) => {
    await page.getByLabel('제목').fill('기존 일정');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('제목').fill('겹치는 일정');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:30');
    await page.getByLabel('종료 시간').fill('11:30');
    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByText('일정 겹침 경고')).toBeVisible();
    await page.getByRole('button', { name: '계속 진행' }).click();
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await expect(page.getByTestId('event-list').getByText('기존 일정')).toBeVisible();
    await expect(page.getByTestId('event-list').getByText('겹치는 일정')).toBeVisible();
  });

  test('반복 일정 생성 시에는 겹침 검사를 하지 않고 바로 등록된다', async ({ page }) => {
    await page.getByLabel('제목').fill('기존 일정');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('제목').fill('반복 일정');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'daily-option' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-12');
    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByText('일정 겹침 경고')).not.toBeVisible();
    await expect(page.getByTestId('event-list').getByText('반복 일정')).toHaveCount(3);
    await expect(page.getByTestId('event-list').getByText('기존 일정')).toBeVisible();
  });

  test('일반 일정 수정 시 겹치면 경고 다이얼로그가 표시된다', async ({ page }) => {
    await page.getByLabel('제목').fill('일정 A');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('제목').fill('일정 B');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('Edit event').first().click();
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByText('일정 겹침 경고')).toBeVisible();
  });

  test('일반 일정을 겹치는 날짜로 드래그하면 경고가 표시된다', async ({ page }) => {
    await page.getByLabel('제목').fill('고정 일정');
    await page.getByLabel('날짜').fill('2025-11-05');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('제목').fill('이동할 일정');
    await page.getByLabel('날짜').fill('2025-11-04');
    await page.getByLabel('시작 시간').fill('10:30');
    await page.getByLabel('종료 시간').fill('11:30');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const weekView = page.getByTestId('month-view');
    const sourceEvent = weekView.getByText('이동할 일정');
    const targetCell = page.locator('[data-rfd-droppable-id="2025-11-05"]');

    await dragAndDrop(page, sourceEvent, targetCell);

    await page.getByText('일정 겹침 경고').waitFor({ timeout: 3000 });

    await expect(page.getByText('계속 진행하시겠습니까?')).toBeVisible();
  });

  test('반복 일정을 드래그하면 수정 확인 다이얼로그가 표시된다', async ({ page }) => {
    await page.getByLabel('제목').fill('반복 회의');
    await page.getByLabel('날짜').fill('2025-11-04');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-18');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const recurringEvent = page.getByText('반복 회의').first();
    const nov5Cell = page.locator('[data-rfd-droppable-id="2025-11-05"]');

    await dragAndDrop(page, recurringEvent, nov5Cell);

    await expect(page.getByText('반복 일정 이동')).toBeVisible();
    await expect(page.getByText('해당 일정만 이동하시겠어요?')).toBeVisible();
  });

  test('일반 일정을 겹치지 않는 날짜로 드래그하면 바로 이동된다', async ({ page }) => {
    await page.getByLabel('제목').fill('이동 테스트');
    await page.getByLabel('날짜').fill('2025-11-04');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const weekView = page.getByTestId('month-view');
    const eventToDrag = weekView.getByText('이동 테스트');
    const nov6Cell = page.locator('[data-rfd-droppable-id="2025-11-06"]');

    await dragAndDrop(page, eventToDrag, nov6Cell);

    await expect(
      page.getByTestId('event-list').getByText('이동 테스트', { exact: true })
    ).toBeVisible();
    await expect(page.getByTestId('event-list').getByText('2025-11-06')).toBeVisible();
    await page.getByText('일정이 수정되었습니다').waitFor({ timeout: 3000 });
  });
});
