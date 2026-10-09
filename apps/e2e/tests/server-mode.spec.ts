import { expect, test } from '@playwright/test';

test('服务器模式：列出文件、渲染与历史', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('hello.md')).toBeVisible();
  await expect(page.getByText('sub/guide.md')).toBeVisible();

  await page.getByText('hello.md').click();
  await expect(page.getByRole('heading', { name: 'Hello Markdown' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.locator('.hljs')).toBeVisible();

  const history = page.locator('section').filter({ hasText: '历史' });
  await expect(history.getByText('hello', { exact: true })).toBeVisible();
});

test('主题切换为深色', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('切换主题').click();
  await page.getByText('深色', { exact: true }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
