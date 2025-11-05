import { test, expect } from './fixtures';

test.describe('검색 및 필터링 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('검색어 입력 없이는 모든 일정이 표시된다', async ({ page, seed }) => {
    await seed();
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('강아지 산책')).toBeVisible();
  });

  test('제목으로 검색하면 해당 일정만 표시된다', async ({ page, seed }) => {
    await seed();

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('회의');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('강아지 산책')).not.toBeVisible();
  });

  test('설명으로 검색하면 해당 일정이 표시된다', async ({ page, seed }) => {
    await seed();

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('기존 팀 미팅');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('강아지 산책')).not.toBeVisible();
  });

  test('위치로 검색하면 해당 일정이 표시된다', async ({ page, seed }) => {
    await seed();

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('공원');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('강아지 산책')).toBeVisible();
    await expect(eventList.getByText('기존 회의')).not.toBeVisible();
  });

  test('검색 결과가 없으면 "검색 결과가 없습니다." 메시지가 표시된다', async ({ page, seed }) => {
    await seed();

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('존재하지 않는 일정');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('검색 결과가 없습니다.')).toBeVisible();
  });

  test('검색어를 지우면 모든 일정이 다시 표시된다', async ({ page, seed }) => {
    await seed();

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('존재하지 않는 일정');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).not.toBeVisible();
    await expect(eventList.getByText('점심 약속')).not.toBeVisible();

    await searchInput.clear();

    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('강아지 산책')).toBeVisible();
  });

  test('주간 뷰에서는 해당 주의 일정만 표시된다', async ({ page, seed }) => {
    await seed();

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('강아지 산책')).not.toBeVisible();
  });

  test('월간 뷰에서는 해당 월의 일정만 표시된다', async ({ page, seed }) => {
    await seed();

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'month-option' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('강아지 산책')).toBeVisible();
    await expect(eventList.getByText('잠자기')).not.toBeVisible();
  });

  test('주간 뷰에서 다음 주로 이동하면 해당 주의 일정이 표시된다', async ({ page, seed }) => {
    await seed();

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    await page.getByRole('button', { name: 'Next' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).not.toBeVisible();
    await expect(eventList.getByText('강아지 산책')).toBeVisible();
  });

  test('월간 뷰에서 다음 달로 이동하면 해당 월의 일정이 표시된다', async ({ page, seed }) => {
    await seed();

    await page.getByLabel('뷰 타입 선택').getByRole('combobox').click();
    await page.getByRole('option', { name: 'month-option' }).click();

    await page.getByRole('button', { name: 'Next' }).click();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('강아지 산책')).not.toBeVisible();
    await expect(eventList.getByText('잠자기')).toBeVisible();
  });

  test('대소문자 구분 없이 검색된다', async ({ page, seed }) => {
    await seed();

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('회의실 b');

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('회의실 B')).toBeVisible();

    await searchInput.clear();
    await searchInput.fill('회의실 B');

    await expect(eventList.getByText('회의실 B')).toBeVisible();
  });
});
