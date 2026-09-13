import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';

// Reports are local QA artifacts, never part of the public deployment.
const base = process.env.AUDIT_URL || 'http://127.0.0.1:4328';
const preview = process.env.AUDIT_URL ? null : spawn(process.execPath, [fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url)), 'preview', '--host', '127.0.0.1', '--port', '4328', '--ignore-lock'], {
  stdio: 'ignore',
  // The audit owns this process and shuts it down when finished.
  env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '1' },
});
let chrome;
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try { ready = (await fetch(base)).ok; } catch { /* Wait for the local preview. */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Preview did not become ready: ${base}`);
  chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
  await mkdir('qa', { recursive: true });
  let failed = false;
  for (const [locale, route] of [['en', '/'], ['zh', '/zh/']]) {
    const result = await lighthouse(`${base}${route}`, {
      port: chrome.port,
      output: ['json', 'html'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!result || result.lhr.runtimeError) throw new Error(result?.lhr.runtimeError?.message ?? 'Lighthouse returned no report');
    await writeFile(`qa/lighthouse-${locale}.json`, result.report[0]);
    await writeFile(`qa/lighthouse-${locale}.html`, result.report[1]);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round((category.score ?? 0) * 100)]));
    console.log(JSON.stringify({ locale, url: `${base}${route}`, mobile: true, ...scores }));
    if (scores.performance < 95 || scores.accessibility < 100) failed = true;
  }
  if (failed) process.exitCode = 1;
} finally {
  if (chrome) chrome.kill();
  preview?.kill('SIGTERM');
}
