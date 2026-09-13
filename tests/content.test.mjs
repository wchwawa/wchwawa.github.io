import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { profile, projects, articles, facts } from '../src/data/profile.ts';

const pages = [
  { file: 'dist/index.html', lang: 'en', path: '/' },
  { file: 'dist/zh/index.html', lang: 'zh-CN', path: '/zh/' },
];

test('the same five projects and shared facts are used in both languages', () => {
  assert.deepEqual(projects.map(p => p.name), ['NoKV', 'Neuono', 'PicSEO AI', 'LoopX', 'EchoJournal']);
  for (const { file } of pages) {
    const html = readFileSync(file, 'utf8');
    assert.deepEqual([...html.matchAll(/data-project="([^"]+)"/g)].map(m => m[1]), projects.map(p => p.id));
    assert.ok(html.includes(facts.neuonoShowcase));
    assert.ok(html.includes(`cohort ${facts.echoJournalCohort}`) || html.includes(`第 ${facts.echoJournalCohort} 期`));
    assert.ok(html.includes(facts.loopx.displayStars));
    assert.ok(html.includes(facts.loopx.checkedOn));
    assert.ok(html.includes('100+') && html.includes('30+'));
    for (const { url } of [...projects, ...articles]) assert.ok(html.includes(url), `Missing ${url}`);
    assert.ok(!/Google Analytics|googletagmanager|formspree|NASA-funded|Mike Woster/.test(html));
  }
});

test('each page has its own metadata, alternates and a Person identity', () => {
  for (const { file, lang, path } of pages) {
    const html = readFileSync(file, 'utf8');
    assert.ok(html.includes(`<html lang="${lang}"`));
    assert.ok(html.includes(`rel="canonical" href="${profile.site}${path}"`));
    for (const code of ['en', 'zh-CN', 'x-default']) assert.ok(html.includes(`hreflang="${code}"`));
    const json = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1];
    assert.ok(json);
    const person = JSON.parse(json);
    assert.equal(person['@type'], 'Person');
    assert.equal(person.name, profile.fullName);
    assert.deepEqual(person.sameAs, [profile.github, profile.linkedin]);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(html.includes(`mailto:${profile.email}`));
  }
});

test('PDF, portrait, crawl files and fonts are self-contained build assets', () => {
  const pdf = readFileSync(`dist${profile.cv}`);
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.ok(pdf.length > 200_000);
  assert.ok(existsSync(`dist${profile.portrait}`));
  assert.ok(existsSync('dist/.nojekyll'));
  assert.ok(readFileSync('dist/robots.txt', 'utf8').includes(`${profile.site}/sitemap.xml`));
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 2);
  for (const page of pages) assert.ok(sitemap.includes(`<loc>${profile.site}${page.path}</loc>`));
  const assets = readdirSync('dist/_astro');
  assert.equal(assets.filter(name => name.endsWith('.woff2')).length, 2);
  for (const file of assets.filter(name => name.endsWith('.css'))) {
    assert.ok(!readFileSync(`dist/_astro/${file}`, 'utf8').includes('fonts.googleapis.com'));
  }
});
