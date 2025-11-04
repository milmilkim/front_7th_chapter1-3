import { Page } from '@playwright/test';

import { test, expect } from './fixtures';

const createEvent = async (
  page: Page,
  options: {
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    location?: string;
  }
) => {
  const {
    title,
    date,
    startTime = '10:00',
    endTime = '11:00',
    description = '',
    location = '',
  } = options;

  await page.getByLabel('제목').fill(title);
  await page.getByLabel('날짜').fill(date);
  await page.getByLabel('시작 시간').fill(startTime);
  await page.getByLabel('종료 시간').fill(endTime);
  if (description) await page.getByLabel('설명').fill(description);
  if (location) await page.getByLabel('위치').fill(location);
  await page.click('[data-testid="event-submit-button"]');
  await page.getByText('일정이 추가되었습니다').waitFor({ timeout: 3000 });
};

test.describe('검색 및 필터링 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('검색어 입력 없이는 모든 일정이 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '점심 약속',
      date: '2025-11-11',
    });

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('점심 약속')).toBeVisible();
  });

  test('제목으로 검색하면 해당 일정만 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '점심 약속',
      date: '2025-11-11',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('회의');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('점심 약속')).not.toBeVisible();
  });

  test('설명으로 검색하면 해당 일정이 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '회의',
      date: '2025-11-10',
      description: '중요한 프로젝트 논의',
    });

    await createEvent(page, {
      title: '약속',
      date: '2025-11-11',
      description: '친구와 저녁',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('프로젝트');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('회의')).toBeVisible();
    await expect(eventList.getByText('약속')).not.toBeVisible();
  });

  test('위치로 검색하면 해당 일정이 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '회의',
      date: '2025-11-10',
      location: '회의실 A',
    });

    await createEvent(page, {
      title: '약속',
      date: '2025-11-11',
      location: '카페',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('회의실');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('회의')).toBeVisible();
    await expect(eventList.getByText('약속')).not.toBeVisible();
  });

  test('검색 결과가 없으면 "검색 결과가 없습니다." 메시지가 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-10',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('존재하지 않는 일정');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('검색 결과가 없습니다.')).toBeVisible();
  });

  test('검색어를 지우면 모든 일정이 다시 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '점심 약속',
      date: '2025-11-11',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('회의');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('점심 약속')).not.toBeVisible();

    await searchInput.clear();

    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('점심 약속')).toBeVisible();
  });

  test('검색어를 변경하면 필터링 결과가 즉시 업데이트된다', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '점심 약속',
      date: '2025-11-11',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('회의');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('점심 약속')).not.toBeVisible();

    await searchInput.clear();
    await searchInput.fill('점심');

    await expect(eventList.getByText('팀 회의')).not.toBeVisible();
    await expect(eventList.getByText('점심 약속')).toBeVisible();
  });

  test('주간 뷰에서는 해당 주의 일정만 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '이번주 회의',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '다음주 회의',
      date: '2025-11-17',
    });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('이번주 회의')).toBeVisible();
    await expect(eventList.getByText('다음주 회의')).not.toBeVisible();
  });

  test('월간 뷰에서는 해당 월의 일정만 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '11월 일정',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '12월 일정',
      date: '2025-12-10',
    });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'month-option' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('11월 일정')).toBeVisible();
    await expect(eventList.getByText('12월 일정')).not.toBeVisible();
  });

  test('주간 뷰에서 다음 주로 이동하면 해당 주의 일정이 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '이번주 회의',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '다음주 회의',
      date: '2025-11-17',
    });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    await page.getByRole('button', { name: 'Next' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('이번주 회의')).not.toBeVisible();
    await expect(eventList.getByText('다음주 회의')).toBeVisible();
  });

  test('월간 뷰에서 다음 달로 이동하면 해당 월의 일정이 표시된다', async ({ page }) => {
    await createEvent(page, {
      title: '11월 일정',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '12월 일정',
      date: '2025-12-10',
    });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'month-option' }).click();

    await page.getByRole('button', { name: 'Next' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('11월 일정')).not.toBeVisible();
    await expect(eventList.getByText('12월 일정')).toBeVisible();
  });

  test('검색과 뷰 필터링이 함께 동작한다', async ({ page }) => {
    await createEvent(page, {
      title: '11월 팀 회의',
      date: '2025-11-10',
    });

    await createEvent(page, {
      title: '11월 점심',
      date: '2025-11-15',
    });

    await createEvent(page, {
      title: '12월 팀 회의',
      date: '2025-12-10',
    });

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'month-option' }).click();

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('회의');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('11월 팀 회의')).toBeVisible();
    await expect(eventList.getByText('11월 점심')).not.toBeVisible();
    await expect(eventList.getByText('12월 팀 회의')).not.toBeVisible();
  });

  test('반복 일정도 검색이 가능하다', async ({ page }) => {
    await page.getByLabel('제목').fill('매일 운동');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('07:00');
    await page.getByLabel('종료 시간').fill('08:00');

    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'daily-option' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-15');

    await page.click('[data-testid="event-submit-button"]');

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('운동');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('매일 운동').first()).toBeVisible();
  });

  test('대소문자 구분 없이 검색된다', async ({ page }) => {
    await createEvent(page, {
      title: 'Team Meeting',
      date: '2025-11-10',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('team');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('Team Meeting')).toBeVisible();

    await searchInput.clear();
    await searchInput.fill('TEAM');

    await expect(eventList.getByText('Team Meeting')).toBeVisible();
  });

  test('부분 검색이 가능하다', async ({ page }) => {
    await createEvent(page, {
      title: '프로젝트 킥오프 미팅',
      date: '2025-11-10',
    });

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('킥오프');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('프로젝트 킥오프 미팅')).toBeVisible();

    await searchInput.clear();
    await searchInput.fill('미팅');

    await expect(eventList.getByText('프로젝트 킥오프 미팅')).toBeVisible();
  });
});
