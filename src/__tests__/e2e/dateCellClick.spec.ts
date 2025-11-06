import { test, expect } from './fixtures';

test.describe('날짜 셀 클릭 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('월간 뷰에서 날짜 셀 클릭 후 일정을 생성한다', async ({ page }) => {
    const monthView = page.getByTestId('month-view');
    const dateCell = monthView.getByText('15', { exact: true }).first();
    await dateCell.click();

    const dateInput = page.getByLabel('날짜');
    await expect(dateInput).toHaveValue('2025-11-15');

    await page.getByLabel('제목').fill('새 일정');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');
    await page.getByLabel('설명').fill('E2E 테스트 일정');
    await page.getByLabel('위치').fill('회의실 B');

    await page.click('[data-testid="event-submit-button"]');
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('새 일정')).toBeVisible();
    await expect(eventList.getByText('2025-11-15')).toBeVisible();

    await expect(monthView.getByText('새 일정')).toBeVisible();
  });

  test('주간 뷰에서 날짜 셀 클릭 후 일정을 생성한다', async ({ page }) => {
    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    const weekView = page.getByTestId('week-view');
    const dateCell = weekView.locator('td').filter({ hasText: /^4$/ }).first();
    await dateCell.click();

    const dateInput = page.getByLabel('날짜');
    await expect(dateInput).toHaveValue('2025-11-04');

    await page.getByLabel('제목').fill('새 일정');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.click('[data-testid="event-submit-button"]');

    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('새 일정')).toBeVisible();
    await expect(eventList.getByText('2025-11-04')).toBeVisible();
  });

  test('수정 모드에서 다른 날짜 셀 클릭 시 수정이 취소되고 새로운 날짜로 초기화 한다', async ({
    page,
    seed,
  }) => {
    await seed();
    await page.reload();

    await page.getByLabel('Edit event').first().click();

    await expect(page.getByRole('heading', { name: '일정 수정', level: 4 })).toBeVisible();
    const titleInput = page.getByLabel('제목');
    await expect(titleInput).toHaveValue('기존 회의');

    const monthView = page.getByTestId('month-view');
    const dateCell = monthView.getByText('20', { exact: true }).first();
    await dateCell.click();

    await expect(page.getByRole('heading', { name: '일정 추가', level: 4 })).toBeVisible();
    await expect(titleInput).toHaveValue('');

    const dateInput = page.getByLabel('날짜');
    await expect(dateInput).toHaveValue('2025-11-20');
  });
});
