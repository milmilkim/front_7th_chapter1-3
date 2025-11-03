import { test as baseTest, request, APIRequestContext } from '@playwright/test';

type MyFixtures = {
  globalHooks: void;
  seed: (data?: unknown) => Promise<void>;
};

const createApiContext = async (): Promise<APIRequestContext> => {
  return await request.newContext({ baseURL: 'http://localhost:3000' });
};

const resetDb = async () => {
  const api = await createApiContext();
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

      await use();

      //--- ⬇️ afterEach 로직 시작 ⬇️ ---//
      // 필요 시 로그아웃, cleanup 등 여기에
    },
    { auto: true },
  ],
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  seed: async ({ page: _page }, provide) => {
    const api = await createApiContext();

    await provide(async (data) => {
      await api.post('/__test__/seed', { data });
    });
    await api.dispose();
  },
});

export { expect } from '@playwright/test';
