// src/__tests__/e2e/fixtures.ts
import { test as baseTest, request } from '@playwright/test';

type MyFixtures = {
  globalHooks: void;
};

const resetDb = async () => {
  const api = await request.newContext({ baseURL: 'http://localhost:3000' });
  await api.post('/__test__/reset');
  await api.dispose();
};

export const test = baseTest.extend<MyFixtures>({
  globalHooks: [
    async ({ page }, use) => {
      //--- ⬇️ beforeEach 로직 시작 ⬇️ ---//
      await resetDb();
      await page.goto('/');

      await use();

      //--- ⬇️ afterEach 로직 시작 ⬇️ ---//
      // 필요 시 로그아웃, cleanup 등 여기에
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
