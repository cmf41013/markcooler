import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

test('双击模式：选择文件打开并渲染', async ({ page }) => {
  const webDist = path.resolve(__dirname, '../../web/dist/index.html');
  const fixture = path.resolve(__dirname, '../fixtures/hello.md');

  await page.goto(pathToFileURL(webDist).href);
  await page.setInputFiles('input[type="file"]', fixture);
  await expect(page.getByRole('heading', { name: 'Hello Markdown' })).toBeVisible();
  await expect(page.locator('section').filter({ hasText: '历史' })).toContainText('hello');
});
