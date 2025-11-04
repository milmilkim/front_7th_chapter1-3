import { test as baseTest, request, APIRequestContext } from '@playwright/test';

type MyFixtures = {
  globalHooks: void;
  seed: (data?: unknown) => Promise<void>;
};

const createApiContext = async (workerIndex?: number): Promise<APIRequestContext> => {
  const headers: Record<string, string> = {};
  if (workerIndex !== undefined) {
    headers['X-Worker-Index'] = String(workerIndex);
  }

  return await request.newContext({
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: headers,
  });
};

const resetDb = async (workerIndex: number) => {
  const api = await createApiContext(workerIndex);
  await api.post('/__test__/reset');
  await api.dispose();
};

export const test = baseTest.extend<MyFixtures>({
  globalHooks: [
    async ({ page }, use, testInfo) => {
      //--- ⬇️ beforeEach 로직 시작 ⬇️ ---//
      console.log('======================');

      // 브라우저의 모든 요청에 워커 인덱스 헤더 추가
      await page.setExtraHTTPHeaders({
        'X-Worker-Index': String(testInfo.workerIndex),
      });

      await resetDb(testInfo.workerIndex);
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
  seed: async ({ page: _page }, provide, testInfo) => {
    const api = await createApiContext(testInfo.workerIndex);

    await provide(async () => {
      await api.post('/__test__/seed');
    });
    await api.dispose();
  },
});

export { expect } from '@playwright/test';
