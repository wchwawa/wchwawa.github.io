import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { biography, copy, profile, projects } from '../../src/data/profile';
import { cvCopy, experience } from '../../src/data/cv';

async function checkReflow(page: Page) {
  const issues = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [...document.querySelectorAll<HTMLElement>('main *, aside *, header *, footer *')]
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.right > width + 1 || rect.left < -1);
      })
      .map(el => `${el.tagName}.${el.className}`);
  });
  expect(issues, 'Elements outside the reading viewport').toEqual([]);
}

async function checkContactAlignment(page: Page) {
  const contacts = await page.locator('.profile-contact').evaluateAll(links => links.map(link => {
    const bounds = link.getBoundingClientRect();
    const icon = link.querySelector('svg')!.getBoundingClientRect();
    const label = link.lastElementChild!;
    return {
      name: link.textContent!.trim(),
      bounds: { x: bounds.x, y: bounds.y, right: bounds.right, width: bounds.width, height: bounds.height },
      icon: { x: icon.x, y: icon.y, width: icon.width, height: icon.height },
      labelDisplay: getComputedStyle(label).display,
    };
  }));
  for (const contact of contacts) {
    expect(contact.icon.width, `${contact.name}: icon must not shrink`).toBe(20);
    expect(contact.icon.height, `${contact.name}: consistent icon height`).toBe(20);
    expect(contact.icon.x + contact.icon.width / 2, `${contact.name}: icon is horizontally centered`).toBeCloseTo(contact.bounds.x + contact.bounds.width / 2, 0);
    expect(contact.icon.y + contact.icon.height / 2, `${contact.name}: icon is vertically centered`).toBeCloseTo(contact.bounds.y + contact.bounds.height / 2, 0);
    expect(contact.labelDisplay, `${contact.name}: no visible label competes with the icon row`).toBe('none');
    expect(contact.bounds.width).toBeGreaterThanOrEqual(44);
    expect(contact.bounds.height).toBeGreaterThanOrEqual(44);
  }
  for (let index = 1; index < contacts.length; index++) {
    expect(contacts[index].icon.y, 'All five icons, including email, share one row').toBeCloseTo(contacts[0].icon.y, 0);
    expect(contacts[index].bounds.x, 'Adjacent contact targets do not overlap').toBeGreaterThanOrEqual(contacts[index - 1].bounds.right);
  }
}

async function checkCompactHeader(page: Page) {
  await expect(page.locator('.wordmark')).toBeHidden();
  await expect(page.locator('.primary-nav')).toBeHidden();
  await expect(page.locator('.site-header')).toHaveCSS('display', 'contents');
  const header = (await page.locator('.page-header').boundingBox())!;
  const card = (await page.locator('[data-profile-card]').boundingBox())!;
  expect(header.height, 'No empty navigation row remains below the profile').toBe(card.height);
  expect(header.height, 'Compact header leaves room for reading').toBeLessThanOrEqual(128);
  await expect(page.locator('body')).toHaveCSS('padding-top', `${header.height}px`);
  for (const selector of ['[data-language-switch]', '[data-theme-toggle]']) {
    await expect(page.locator(selector)).toBeInViewport({ ratio: 1 });
  }
  const tools = (await page.locator('.header-tools').boundingBox())!;
  for (const element of await page.locator('.profile-identity .portrait, .profile-titles, .profile-contact').all()) {
    const bounds = (await element.boundingBox())!;
    const overlaps = bounds.x < tools.x + tools.width && bounds.x + bounds.width > tools.x && bounds.y < tools.y + tools.height && bounds.y + bounds.height > tools.y;
    expect(overlaps, 'Utility controls do not overlap identity or contact targets').toBeFalsy();
  }
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
        await expect(page.locator('.profile-role')).toHaveText(cvCopy[locale].role);
        await expect(page.locator('.profile-specialisms')).toHaveText(cvCopy[locale].specialisms);
        await expect(page.locator('main > section').first()).toHaveAttribute('id', 'about');
        await expect(page.locator('[data-cv-link], a[download]')).toHaveCount(0);
        await expect(page.locator('[data-experience]')).toHaveCount(experience.length);
        await expect(page.locator('[data-experience="holt"], [data-experience="unihack"], [data-experience="mlflow"]')).toHaveCount(0);
        await expect(page.locator('.experience-details[open]')).toHaveCount(0);
        await expect(page.locator('[data-experience] h3')).toHaveText(experience.map(entry => entry.copy[locale].name));
        for (const preview of await page.locator('.experience-summary').all()) {
          await expect(preview).toHaveCSS('white-space', 'nowrap');
          await expect(preview).toHaveCSS('text-overflow', 'ellipsis');
          const oneLine = await preview.evaluate(el => el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).lineHeight) + 1);
          expect(oneLine, 'Collapsed descriptions show exactly one line').toBeTruthy();
        }
        const timelineBounds = await page.locator('#experience').boundingBox();
        expect(timelineBounds!.height, 'All six entries remain compact').toBeLessThan(width < 700 ? 800 : 700);
        const genesis = page.locator('[data-experience="echojournal"]');
        await expect(genesis.locator('h3')).toHaveText(locale === 'en' ? 'Genesis Accelerator' : 'Genesis 创业孵化器');
        await expect(genesis.locator('.experience-role')).toHaveText(locale === 'en' ? 'Cohort 36' : '第 36 期');
        for (const icon of await page.locator('.experience-toggle').all()) {
          await expect(icon).toHaveText('');
          await expect(icon).toHaveAttribute('aria-hidden', 'true');
          await expect(icon.locator('svg')).toBeVisible();
        }
        await expect(page.locator('#contact')).toBeInViewport();
        await expect(page.locator('#about h2')).toHaveText(locale === 'en' ? 'About me' : '关于我');
        await expect(page.locator('.portrait figcaption')).toHaveCount(0);
        await expect(page.locator('#contact p, .writing-entry p, .project-focus, .project-note')).toHaveCount(0);
        await expect(page.locator('.biography > p')).toHaveText(biography[locale].map(paragraph => paragraph.map(segment => segment.text).join('')));
        const icons = page.locator('.profile-contact');
        await expect(icons).toHaveCount(5);
        await expect(icons).toHaveText([profile.email, 'GitHub', 'LinkedIn', 'X', copy[locale].wechatTitle]);
        await expect(page.locator('#contact a[aria-label$="X"]')).toHaveAttribute('href', profile.x);
        for (const icon of await icons.all()) {
          await expect(icon).toHaveAccessibleName(/.+/);
          await expect(icon.locator('svg')).toBeVisible();
          const bounds = await icon.boundingBox();
          expect(bounds!.width).toBeGreaterThanOrEqual(44);
          expect(bounds!.height).toBeGreaterThanOrEqual(44);
        }
        await checkReflow(page);
        await checkContactAlignment(page);
        for (const heading of await page.locator('.section-heading').all()) {
          await expect(heading).toHaveCSS('border-bottom-width', '0px');
        }
        if (width <= 900) await checkCompactHeader(page);
        else await expect(page.locator('.primary-nav')).toBeVisible();
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
        expect(errors).toEqual([]);
        if (!process.env.CI) {
          await mkdir('qa', { recursive: true });
          await page.screenshot({ path: `qa/${locale}-${width}-${theme}-top.png` });
          await page.screenshot({ path: `qa/${locale}-${width}-${theme}-full.png`, fullPage: true });
          if (width === 390 || width === 1440) {
            await page.locator('#experience').screenshot({ path: `qa/${locale}-${width}-${theme}-experience.png` });
            await page.locator('#contact').screenshot({ path: `qa/${locale}-${width}-${theme}-contact.png` });
            if (width > 900) await page.locator('.primary-nav a[href$="#experience"]').click();
            else await page.locator('#experience').evaluate(el => el.scrollIntoView({ block: 'start' }));
            await page.screenshot({ path: `qa/${locale}-${width}-${theme}-experience-viewport.png` });
          }
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
    await expect(page.locator('[data-cv-link]')).toHaveCount(0);
    await expect(page.locator('[data-experience]')).toHaveCount(experience.length);
    await expect(page.locator('.biography > p')).toHaveCount(6);
    await expect(page.locator('.biography a')).toHaveCount(9);
    const details = page.locator('[data-experience="nokv"] details');
    await expect(details).not.toHaveAttribute('open');
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open');
    await expect(details.locator('.experience-summary')).toHaveCSS('white-space', 'normal');
    await expect(details.locator('.experience-outcome')).toBeVisible();
    await details.locator('summary').click();
    await expect(details).not.toHaveAttribute('open');
    await expect(page.locator('.primary-nav')).toBeHidden();
    await page.goto(`http://127.0.0.1:4327${route}#about`);
    await expect(page).toHaveURL(/#about$/);
    await page.goto(`http://127.0.0.1:4327${route}#experience`);
    await expect(page).toHaveURL(/#experience$/);
    const heading = (await page.locator('#experience h2').boundingBox())!;
    const header = (await page.locator('.page-header').boundingBox())!;
    expect(heading.y).toBeGreaterThanOrEqual(header.y + header.height);
    await page.locator('[data-language-switch]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale === 'en' ? 'zh-CN' : 'en');
    await page.locator('[data-wechat-open]').click();
    await expect(page).toHaveURL(`http://127.0.0.1:4327${profile.wechatQr}`);
    await context.close();
  });

  for (const viewport of [
    { width: 360, height: 640 }, { width: 390, height: 844 },
    { width: 768, height: 1024 }, { width: 844, height: 390 },
    { width: 900, height: 621 }, { width: 901, height: 621 },
    { width: 1024, height: 768 }, { width: 1440, height: 900 },
    { width: 1280, height: 500 },
  ]) {
    test(`${locale}, ${viewport.width}x${viewport.height}: profile remains fixed and independent of content layout`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const card = page.locator('[data-profile-card]');
      const compact = viewport.width <= 900 || viewport.height <= 620;
      await expect(card).toHaveCSS('position', compact ? 'static' : 'fixed');
      expect(await card.evaluate(el => el.parentElement?.tagName)).toBe('HEADER');
      const original = (await card.boundingBox())!;
      const header = page.locator('.page-header');
      await expect(page.locator('header')).toHaveCount(1);
      if (compact) {
        await expect(header).toHaveCSS('position', 'fixed');
        await checkCompactHeader(page);
      } else {
        await expect(page.locator('.primary-nav')).toBeVisible();
      }

      const checkCard = async () => {
        const current = (await card.boundingBox())!;
        for (const axis of ['x', 'y', 'width', 'height'] as const) {
          expect(current[axis], `Profile ${axis} is independent of content scroll and sizing`).toBeCloseTo(original[axis], 0);
        }
        expect(current.y).toBeGreaterThanOrEqual(0);
        expect(current.y + current.height).toBeLessThanOrEqual(viewport.height);
        await expect(card.locator('.portrait img')).toBeInViewport({ ratio: 1 });
        for (const link of await card.locator('.profile-contact').all()) await expect(link).toBeInViewport({ ratio: 1 });
        if (compact) {
          await expect(page.locator('[data-language-switch]')).toBeInViewport({ ratio: 1 });
          await expect(page.locator('[data-theme-toggle]')).toBeInViewport({ ratio: 1 });
          await expect(page.locator('.primary-nav')).toBeHidden();
        }
        await checkReflow(page);
      };

      for (const id of ['about', 'experience', 'education', 'skills', 'speaking', 'writing']) {
        await page.evaluate(section => document.getElementById(section)!.scrollIntoView({ block: 'start' }), id);
        await checkCard();
        const heading = (await page.locator(`#${id} > h2`).boundingBox())!;
        if (compact) {
          const headerBounds = (await header.boundingBox())!;
          expect(heading.y).toBeGreaterThanOrEqual(headerBounds.y + headerBounds.height);
        }
        else expect(heading.x).toBeGreaterThanOrEqual(original.x + original.width);
      }

      await page.locator('[data-experience="nokv"] summary').click();
      await expect(page.locator('[data-experience="nokv"] details')).toHaveAttribute('open');
      await checkCard();
      // Stress the content region only: the fixed identity must not move or resize.
      await page.locator('main').evaluate(el => {
        el.style.paddingBlock = '120px';
        el.style.maxWidth = '90%';
        el.style.minHeight = '4000px';
        el.style.fontSize = '20px';
      });
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await checkCard();
      await page.locator('main').evaluate(el => el.removeAttribute('style'));
      await page.locator('[data-experience="nokv"] summary').click();
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await checkCard();
      await checkContactAlignment(page);
      if (!process.env.CI) {
        await mkdir('qa', { recursive: true });
        await page.screenshot({ path: `qa/${locale}-${viewport.width}x${viewport.height}-fixed-profile-bottom.png` });
      }
    });
  }

  for (const viewport of [{ width: 320, height: 640 }, { width: 599, height: 700 }, { width: 600, height: 700 }, { width: 699, height: 700 }, { width: 700, height: 700 }]) {
    test(`${locale}, ${viewport.width}px: compact contact alignment survives narrow widths and header breakpoints`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await checkContactAlignment(page);
      await checkCompactHeader(page);
      await checkReflow(page);
    });
  }

  for (const width of [390, 1440]) {
    test(`${locale}, ${width}px: compact experience expands fully with pointer and keyboard`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      const nokv = page.locator('[data-experience="nokv"]');
      const details = nokv.locator('details');
      const trigger = details.locator('summary');
      const chevron = trigger.locator('.experience-toggle svg');
      await expect(trigger).toHaveAccessibleName(`NoKV: ${cvCopy[locale].details}`);
      await expect(chevron).toHaveCSS('transform', 'none');
      const collapsedHeight = (await nokv.boundingBox())!.height;
      await trigger.focus();
      await expect(trigger).toHaveCSS('outline-style', 'solid');
      await trigger.press('Enter');
      await expect(details).toHaveAttribute('open');
      await expect(chevron).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
      await expect(details.locator('.experience-outcome')).toBeVisible();
      await expect(nokv.locator('.experience-role')).toHaveCSS('white-space', 'normal');
      expect((await nokv.boundingBox())!.height).toBeGreaterThan(collapsedHeight);
      await checkReflow(page);
      await trigger.press('Space');
      await expect(details).not.toHaveAttribute('open');
      await expect(chevron).toHaveCSS('transform', 'none');
      await expect(details.locator('.experience-outcome')).toBeHidden();
      await expect(trigger).toBeFocused();
      expect((await nokv.boundingBox())!.height).toBeCloseTo(collapsedHeight, 0);

      for (const entry of experience) {
        const item = page.locator(`[data-experience="${entry.id}"]`);
        const disclosure = item.locator('details');
        await disclosure.locator('.experience-toggle').click();
        await expect(disclosure).toHaveAttribute('open');
        await expect(disclosure.locator('.experience-summary')).toHaveText(entry.copy[locale].summary);
        await expect(disclosure.locator('.experience-summary')).toHaveCSS('white-space', 'normal');
        if (entry.copy[locale].outcome) await expect(disclosure.locator('.experience-outcome')).toBeVisible();
      }
      await checkReflow(page);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      if (!process.env.CI) {
        await mkdir('qa', { recursive: true });
        await page.locator('#experience').screenshot({ path: `qa/${locale}-${width}-expanded-experience.png` });
      }
    });
  }

  for (const viewport of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1440, height: 1000 }]) {
    test(`${locale}, ${viewport.width}px: WeChat dialog fits and supports keyboard dismissal`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      const trigger = page.locator('[data-wechat-open]');
      const dialog = page.getByRole('dialog', { name: copy[locale].wechatTitle });
      await expect(dialog).toBeHidden();
      await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      for (const theme of ['light', 'dark']) {
        await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
        await trigger.focus();
        await page.keyboard.press('Space');
        await expect(dialog).toBeVisible();
        const close = dialog.getByRole('button', { name: copy[locale].wechatClose });
        const original = dialog.getByRole('link', { name: copy[locale].wechatOpenImage });
        await expect(close).toBeFocused();
        const image = dialog.locator('img');
        await expect.poll(() => image.evaluate(node => node instanceof HTMLImageElement && node.complete && node.naturalWidth)).toBe(888);
        await expect.poll(() => image.evaluate(node => node instanceof HTMLImageElement && node.naturalHeight)).toBe(1191);
        await expect(original).toHaveAttribute('href', profile.wechatQr);
        await checkReflow(page);
        for (const element of [dialog, image, close, original]) {
          const bounds = await element.boundingBox();
          expect(bounds!.y).toBeGreaterThanOrEqual(0);
          expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
        }
        await page.keyboard.press('Tab');
        await expect(original).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(close).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(original).toBeFocused();
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
        if (!process.env.CI) {
          await mkdir('qa', { recursive: true });
          await page.screenshot({ path: `qa/${locale}-${viewport.width}-${theme}-wechat.png` });
        }
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
        await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
      }
      await trigger.click();
      await dialog.locator('img').click();
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: copy[locale].wechatClose }).click();
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.press('Enter');
      await expect(dialog).toBeVisible();
      await page.mouse.click(2, 2);
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }

  test(`${locale}: 200% browser-zoom equivalent reflow`, async ({ browser }) => {
    // At 200% zoom a 1440 x 900 display has a 720 x 450 CSS viewport.
    const context = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4327${route}`);
    await checkReflow(page);
    await expect(page.locator('[data-cv-link]')).toHaveCount(0);
    await expect(page.locator('[data-experience]')).toHaveCount(experience.length);
    await expect(page.locator('[data-project]')).toHaveCount(5);
    if (!process.env.CI) await page.screenshot({ path: `qa/${locale}-zoom-200.png`, fullPage: true });
    await context.close();
  });
}

test('language, keyboard focus, theme persistence and inline experience', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.locator('.primary-nav a[href$="#experience"]').click();
  await expect(page).toHaveURL(/#experience$/);
  await page.locator('.primary-nav a[href$="#about"]').click();
  await expect(page).toHaveURL(/#about$/);
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

  await expect(page.locator('[data-cv-link], a[download]')).toHaveCount(0);
  await expect(page.locator('[data-experience]')).toHaveCount(experience.length);
  await expect(page.locator(`a[href="mailto:${profile.email}"]`)).toBeVisible();
  await page.locator('.profile-contact').first().focus();
  await page.keyboard.press('Shift+Tab');
  for (const icon of await page.locator('.profile-contact').all()) {
    await page.keyboard.press('Tab');
    await expect(icon).toBeFocused();
    await expect(icon).toHaveCSS('outline-style', 'solid');
  }
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
