import { Page } from '@playwright/test';

import { test, expect } from './fixtures';

const createRecurringEvent = async (
  page: Page,
  options: {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    endDate?: string;
  }
) => {
  const {
    title = '반복 일정',
    date = '2025-11-15',
    startTime = '10:00',
    endTime = '11:00',
    repeatType = 'weekly',
    interval = 1,
    endDate = '2025-12-31',
  } = options;

  await page.getByLabel('제목').fill(title);
  await page.getByLabel('날짜').fill(date);
  await page.getByLabel('시작 시간').fill(startTime);
  await page.getByLabel('종료 시간').fill(endTime);

  await page.getByRole('checkbox', { name: '반복 일정' }).check();

  await page.getByLabel('반복 유형').click();
  const repeatTypeMap = {
    daily: 'daily-option',
    weekly: 'weekly-option',
    monthly: 'monthly-option',
    yearly: 'yearly-option',
  };
  await page.getByRole('option', { name: repeatTypeMap[repeatType] }).click();

  await page.getByLabel('반복 간격').fill(interval.toString());

  if (endDate) {
    await page.getByLabel('반복 종료일').fill(endDate);
  }

  await page.click('[data-testid="event-submit-button"]');
};

test.describe('반복 일정 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('매일 반복 일정을 생성하고 목록에서 확인할 수 있다', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '매일 운동',
      repeatType: 'daily',
      interval: 1,
      endDate: '2025-11-20',
    });

    const eventItems = page.getByTestId('event-list').getByText('매일 운동');
    await expect(eventItems).toHaveCount(6);
  });

  test('매주 반복 일정을 생성하고 주간 뷰에서 확인할 수 있다', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '주간 회의',
      repeatType: 'weekly',
      interval: 1,
      date: '2025-11-04',
      endDate: '2025-11-25',
    });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    const weekView = page.getByTestId('week-view');
    await expect(weekView.getByText('주간 회의')).toHaveCount(1);
  });

  test('매월 반복 일정을 생성하고 월간 뷰에서 확인할 수 있다', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '월간 리뷰',
      repeatType: 'monthly',
      interval: 1,
      date: '2025-11-15',
      endDate: '2025-12-15',
    });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'month-option' }).click();

    const monthView = page.getByTestId('month-view');
    await expect(monthView.getByText('월간 리뷰')).toHaveCount(1);

    // 다음달로 이동
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(monthView.getByText('월간 리뷰')).toHaveCount(1);
  });

  test('매년 반복 일정을 생성하고 목록에서 확인할 수 있다', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '연간 행사',
      repeatType: 'yearly',
      interval: 1,
      date: '2024-11-15',
      endDate: '2025-11-15',
    });

    await expect(page.getByTestId('event-list').getByText('연간 행사')).toBeVisible();

    // 2024년 11월까지 이동
    for (let i = 0; i < 12; i++) {
      await page.getByRole('button', { name: 'Previous' }).click();
    }
    const monthView = page.getByTestId('month-view');
    await expect(monthView.getByText('연간 행사')).toHaveCount(1);
  });

  test('반복 일정 수정 > 한 개만 수정', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '주간 회의',
      repeatType: 'weekly',
      interval: 1,
      date: '2025-11-04',
      endDate: '2025-11-25',
    });

    await page.getByLabel('Edit event').first().click();

    await expect(page.getByText('반복 일정 수정')).toBeVisible();
    await expect(page.getByText('해당 일정만 수정하시겠어요?')).toBeVisible();

    await page.getByRole('button', { name: '예' }).click();

    await page.getByLabel('제목').fill('수정한 회의');
    await page.click('[data-testid="event-submit-button"]');

    await expect(page.getByTestId('event-list').getByText('수정한 회의')).toBeVisible();

    await expect(page.getByTestId('event-list').getByText('주간 회의')).toHaveCount(3);
  });

  test('반복 일정 수정 > 전체 수정', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '주간 회의',
      repeatType: 'weekly',
      interval: 1,
      date: '2025-11-04',
      endDate: '2025-11-25',
    });

    await page.getByLabel('Edit event').first().click();
    await expect(page.getByText('반복 일정 수정')).toBeVisible();
    await page.getByRole('button', { name: '아니오' }).click();
    await page.getByLabel('제목').fill('전체 수정된 주간 회의');
    await page.click('[data-testid="event-submit-button"]');

    await expect(
      page.getByTestId('event-list').getByText('전체 수정된 주간 회의', { exact: true })
    ).toHaveCount(4);

    await expect(
      page.getByTestId('event-list').getByText('주간 회의', { exact: true })
    ).not.toBeVisible();
  });

  test('반복 일정 삭제 > 한 개만 삭제', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '주간 회의',
      repeatType: 'weekly',
      interval: 1,
      date: '2025-11-04',
      endDate: '2025-11-25',
    });

    await expect(page.getByTestId('event-list').getByText('주간 회의')).toHaveCount(4);

    await page.getByLabel('Delete event').first().click();

    await expect(page.getByText('반복 일정 삭제')).toBeVisible();
    await expect(page.getByText('해당 일정만 삭제하시겠어요?')).toBeVisible();

    await page.getByRole('button', { name: '예' }).click();
    await page.getByText('일정이 삭제되었습니다').waitFor({ timeout: 3000 });

    const eventsAfter = await page.getByTestId('event-list').getByText('주간 회의').count();
    expect(eventsAfter).toBe(3);
  });

  test('반복 일정 삭제 > 전체 삭제', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '주간 회의',
      repeatType: 'weekly',
      interval: 1,
      date: '2025-11-04',
      endDate: '2025-11-25',
    });

    await page.getByLabel('Delete event').first().click();
    await expect(page.getByText('반복 일정 삭제')).toBeVisible();

    await page.getByRole('button', { name: '아니오' }).click();
    await page.getByText('일정이 삭제되었습니다').waitFor({ timeout: 3000 });

    await expect(page.getByTestId('event-list').getByText('주간 회의')).not.toBeVisible();
    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();
  });

  test('반복 종료일이 있는 반복 일정이 종료일 이후에는 생성되지 않는다', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '단기 반복 일정',
      repeatType: 'daily',
      interval: 1,
      date: '2025-11-15',
      endDate: '2025-11-17',
    });

    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    const eventCount = await page.getByTestId('event-list').getByText('단기 반복 일정').count();
    expect(eventCount).toBe(3);
  });

  test('반복 간격을 설정한 반복 일정이 올바르게 생성된다', async ({ page }) => {
    await createRecurringEvent(page, {
      title: '격주 회의',
      repeatType: 'weekly',
      interval: 2,
      date: '2025-11-04',
      endDate: '2025-12-02',
    });
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'month-option' }).click();

    await expect(page.getByTestId('month-view').getByText('격주 회의')).toHaveCount(2);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByTestId('month-view').getByText('격주 회의')).toHaveCount(1);
  });
});
