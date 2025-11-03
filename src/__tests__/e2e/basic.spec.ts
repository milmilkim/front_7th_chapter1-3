import { test, expect } from '@playwright/test';

test.describe('기본 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page.getByText('일정 보기')).toBeVisible();
  });
});
