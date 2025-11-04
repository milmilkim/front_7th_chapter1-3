import { Page } from '@playwright/test';

import { test, expect } from './fixtures';

const createEventWithNotification = async (
  page: Page,
  options: {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    notificationTime?: 1 | 10 | 60 | 120 | 1440;
  }
) => {
  const {
    title = '알림 테스트 일정',
    date = '2024-11-04',
    startTime = '10:00',
    endTime = '11:00',
    notificationTime = 10,
  } = options;

  const notificationMap: Record<number, string> = {
    1: '1분 전-option',
    10: '10분 전-option',
    60: '1시간 전-option',
    120: '2시간 전-option',
    1440: '1일 전-option',
  };

  await page.getByLabel('제목').fill(title);
  await page.getByLabel('날짜').fill(date);
  await page.getByLabel('시작 시간').fill(startTime);
  await page.getByLabel('종료 시간').fill(endTime);

  await page.getByLabel('알림 설정').click();
  await page.getByRole('option', { name: notificationMap[notificationTime] }).click();

  await page.click('[data-testid="event-submit-button"]');
};

test.describe('알림 시스템 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('일정 시작 10분 전에 알림이 표시된다', async ({ page }) => {
    const testDate = new Date('2024-11-04T09:50:00');
    await page.clock.install({ time: testDate });

    await createEventWithNotification(page, {
      title: '10분 후 회의',
      date: '2024-11-04',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: 10,
    });

    await page.clock.runFor(1500);
    await expect(page.getByText('10분 후 10분 후 회의 일정이 시작됩니다.')).toBeVisible();
  });

  test('일정 시작 60분 전에 알림이 표시된다', async ({ page }) => {
    const testDate = new Date('2024-11-04T09:00:00');
    await page.clock.install({ time: testDate });

    await createEventWithNotification(page, {
      title: '60분 후 회의',
      date: '2024-11-04',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: 60,
    });

    await page.clock.runFor(1500);
    await expect(page.getByText('60분 후 60분 후 회의 일정이 시작됩니다.')).toBeVisible();
  });

  test('여러 일정의 알림이 동시에 표시될 수 있다', async ({ page }) => {
    const testDate = new Date('2024-11-04T09:40:00');
    await page.clock.install({ time: testDate });

    await createEventWithNotification(page, {
      title: '첫 번째 회의',
      date: '2024-11-04',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: 10,
    });

    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await createEventWithNotification(page, {
      title: '두 번째 회의',
      date: '2024-11-04',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: 10,
    });

    await expect(page.getByText('일정 겹침 경고')).toBeVisible();
    await page.getByRole('button', { name: '계속 진행' }).click();
    await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });

    await page.clock.runFor(10 * 60 * 1000 + 1500);

    await expect(page.getByText('10분 후 첫 번째 회의 일정이 시작됩니다.')).toBeVisible();
    await expect(page.getByText('10분 후 두 번째 회의 일정이 시작됩니다.')).toBeVisible();
  });

  test('이미 표시된 알림은 중복으로 표시되지 않는다', async ({ page }) => {
    const testDate = new Date('2024-11-04T09:50:00');
    await page.clock.install({ time: testDate });

    await createEventWithNotification(page, {
      title: '10분 후 회의',
      date: '2024-11-04',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: 10,
    });

    await page.clock.runFor(1500);
    const notification = page.getByText('10분 후 10분 후 회의 일정이 시작됩니다.');
    await expect(notification).toBeVisible();

    await page.clock.runFor(60000);

    const notificationCount = await page
      .getByText('10분 후 10분 후 회의 일정이 시작됩니다.')
      .count();
    expect(notificationCount).toBe(1);
  });

  test('알림 시간이 지난 후에는 알림이 표시되지 않는다', async ({ page }) => {
    const testDate = new Date('2024-11-04T10:05:00');
    await page.clock.install({ time: testDate });

    await createEventWithNotification(page, {
      title: '이미 지난 회의',
      date: '2024-11-04',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: 10,
    });

    await page.clock.runFor(1500);
    await expect(page.getByText('10분 후 이미 지난 회의 일정이 시작됩니다.')).not.toBeVisible();
  });

  test('알림 시간이 아직 도래하지 않으면 알림이 표시되지 않는다', async ({ page }) => {
    const testDate = new Date('2024-11-04T09:00:00');
    await page.clock.install({ time: testDate });

    await createEventWithNotification(page, {
      title: '나중에 알림',
      date: '2024-11-04',
      startTime: '10:00',
      endTime: '11:00',
      notificationTime: 10,
    });

    await page.clock.runFor(1500);
    await expect(page.getByText('10분 후 나중에 알림 일정이 시작됩니다.')).not.toBeVisible();

    // 시간 변경
    await page.clock.install({ time: '2024-11-04T09:50:00' });
    await page.clock.runFor(1500);
    await expect(page.getByText('10분 후 나중에 알림 일정이 시작됩니다.')).toBeVisible();
  });

  test('반복 일정 알림이 표시된다', async ({ page }) => {
    const testDate = new Date('2024-11-04T09:50:00');
    await page.clock.install({ time: testDate });

    await page.getByLabel('제목').fill('반복 회의');
    await page.getByLabel('날짜').fill('2024-11-04');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.getByLabel('알림 설정').click();
    await page.getByRole('option', { name: '10분 전-option' }).click();

    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'daily-option' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2024-11-10');

    await page.click('[data-testid="event-submit-button"]');

    await page.clock.runFor(1500);
    await expect(page.getByText('10분 후 반복 회의 일정이 시작됩니다.')).toBeVisible();
  });
});
