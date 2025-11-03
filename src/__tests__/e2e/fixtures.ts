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
      const fixed = new Date('2025-11-03T09:00:00Z').getTime();

      await page.addInitScript(`{
            const fixed = ${fixed};
            Date.now = () => fixed;
            const OriginalDate = Date;
            class MockDate extends OriginalDate {
                constructor(...args) {
                if (args.length === 0) super(fixed);
                else super(...args);
                }
            }
            globalThis.Date = MockDate;
        }`);
      await page.goto('/');

      await use();

      //--- ⬇️ afterEach 로직 시작 ⬇️ ---//
      // 필요 시 로그아웃, cleanup 등 여기에
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
