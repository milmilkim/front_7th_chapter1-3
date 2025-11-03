import { test, expect } from './fixtures';

test.describe('기본 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page.getByText('일정 보기')).toBeVisible();
    await expect(page.getByTestId('event-list')).toBeVisible();
  });

  test('일정을 추가하면 목록에 표시된다', async ({ page }) => {
    await page.getByLabel('제목').fill('E2E 테스트 일정');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByTestId('event-list').getByText('E2E 테스트 일정')).toBeVisible();
  });

  test('일정을 수정하면 변경 내용이 반영된다', async ({ page }) => {
    await page.getByLabel('제목').fill('E2E 테스트 일정');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByTestId('event-list').getByText('E2E 테스트 일정')).toBeVisible();

    await page.getByLabel('Edit event').first().click();
    await page.getByLabel('제목').fill('수정된 일정');
    await page.click('[data-testid="event-submit-button"]');
    await expect(page.getByTestId('event-list').getByText('수정된 일정')).toBeVisible();
  });

  test('일정을 삭제하면 목록에서 제거된다', async ({ page }) => {
    await page.getByLabel('제목').fill('E2E 테스트 일정');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByTestId('event-list').getByText('E2E 테스트 일정')).toBeVisible();

    await page.getByLabel('Delete event').first().click();

    await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible();
  });
});
