import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { profile, projects } from '../../src/data/profile';

async function checkReflow(page: Page) {
  const issues = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [...document.querySelectorAll<HTMLElement>('main *, header *, footer *')]
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.right > width + 1 || rect.left < -1);
      })
      .map(el => `${el.tagName}.${el.className}`);
  });
  expect(issues, 'Elements outside the reading viewport').toEqual([]);
}

for (const locale of ['en', 'zh'] as const) {
  const route = locale === 'en' ? '/' : '/zh/';
  for (const width of [360, 390, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      test(`${locale}, ${width}px, ${theme}: readable and accessible`, async ({ page }) => {
        await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
        await page.addInitScript(value => localStorage.setItem('jason-theme', value), theme);
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('[data-project]')).toHaveCount(5);
        await expect(page.locator('h1')).toHaveText(profile.name);
        await checkReflow(page);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
        expect(errors).toEqual([]);
        if (!process.env.CI) {
          await mkdir('qa', { recursive: true });
          await page.screenshot({ path: `qa/${locale}-${width}-${theme}-top.png` });
          await page.screenshot({ path: `qa/${locale}-${width}-${theme}-full.png`, fullPage: true });
        }
      });
    }
  }

  test(`${locale}: content and navigation work without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4327${route}`);
    await expect(page.locator('[data-project]')).toHaveCount(5);
    await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    await expect(page.locator('[data-cv-link]')).toHaveAttribute('href', profile.cv);
    await page.locator('.primary-nav a').first().click();
    await expect(page).toHaveURL(/#work$/);
    await page.locator('[data-language-switch]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale === 'en' ? 'zh-CN' : 'en');
    await context.close();
  });

  test(`${locale}: 200% browser-zoom equivalent reflow`, async ({ browser }) => {
    // At 200% zoom a 1440 x 900 display has a 720 x 450 CSS viewport.
    const context = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4327${route}`);
    await checkReflow(page);
    await expect(page.locator('[data-cv-link]')).toBeVisible();
    await expect(page.locator('[data-project]')).toHaveCount(5);
    if (!process.env.CI) await page.screenshot({ path: `qa/${locale}-zoom-200.png`, fullPage: true });
    await context.close();
  });
}

test('language, keyboard focus, theme persistence and downloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  // Default is deliberately light, independent of the operating system.
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const toggle = page.locator('[data-theme-toggle]');
  await toggle.focus();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL('/zh/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', 'false');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-cv-link]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Jason_Wang_CV.pdf');
  expect(await download.failure()).toBeNull();
  await expect(page.locator(`a[href="mailto:${profile.email}"]`)).toBeVisible();
  for (const project of projects) {
    await expect(page.locator(`[data-project="${project.id}"] h3 a`)).toHaveAttribute('href', project.url);
  }
});

test('theme toggle remains usable when browser storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked for test'); } });
  });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

test('all local links, anchors, fonts and crawl assets resolve', async ({ page, request }) => {
  for (const route of ['/', '/zh/']) {
    await page.goto(route);
    const anchors = await page.locator('a[href*="#"]').evaluateAll(nodes => nodes.map(node => (node as HTMLAnchorElement).hash.slice(1)).filter(Boolean));
    for (const id of anchors) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    const resources = await page.locator('link[rel="preload"], link[rel="stylesheet"], img').evaluateAll(nodes => nodes.map(node => node.getAttribute('href') ?? node.getAttribute('src')).filter(Boolean));
    for (const resource of resources) {
      const response = await request.get(resource!);
      expect(response.ok(), resource!).toBeTruthy();
    }
  }
  for (const path of [profile.cv, '/sitemap.xml', '/robots.txt', '/favicon.svg', '/404.html']) {
    expect((await request.get(path)).ok(), path).toBeTruthy();
  }
});
