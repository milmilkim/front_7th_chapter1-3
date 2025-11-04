import { Page, Locator } from '@playwright/test';

export const dragAndDrop = async (page: Page, source: Locator, target: Locator) => {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Source or target box not found');
  }

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(100);

  await page.mouse.move(sourceBox.x + 30, sourceBox.y + 30, { steps: 10 });
  await page.waitForTimeout(50);

  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
    steps: 20,
  });
  await page.mouse.up();
};
