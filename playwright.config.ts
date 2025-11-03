import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/__tests__/e2e',

  /* 병렬 실행 설정 */
  fullyParallel: true,

  /* CI 환경에서 재시도 설정 */
  retries: process.env.CI ? 2 : 0,

  /* CI 환경에서 병렬 워커 설정 */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter 설정 */
  reporter: [['html'], ['list']],

  /* 모든 테스트에서 공유되는 설정 */
  use: {
    /* 베이스 URL */
    baseURL: 'http://localhost:5173',

    /* 실패 시 스크린샷 촬영 */
    screenshot: 'only-on-failure',

    /* 실패 시 비디오 저장 */
    video: 'retain-on-failure',

    /* 추적 설정 */
    trace: 'on-first-retry',
  },

  /* 프로젝트별 브라우저 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 모바일 뷰포트 테스트 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* 테스트 실행 전 로컬 dev 서버 시작 */
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
