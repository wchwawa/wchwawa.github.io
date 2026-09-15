import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { profile, projects, articles, biography, facts } from '../src/data/profile.ts';

const pages = [
  { file: 'dist/index.html', lang: 'en', path: '/' },
  { file: 'dist/zh/index.html', lang: 'zh-CN', path: '/zh/' },
];

test('the complete linked biography follows the compact hero on each page', () => {
  const expectedLinks = [
    'https://landscape.lfai.foundation/?group=projects-and-products&item=data--store-format--nokv',
    'https://landscape.cncf.io/?group=projects-and-products&item=runtime--cloud-native-storage--nokv',
    'https://dbdb.io/db/nokv',
    'https://github.com/huangruiteng/loopx',
    'https://github.com/volcengine/OpenViking',
    'https://github.com/NousResearch/hermes-agent',
    'https://neuono.com/',
    'https://www.forbes.com.au/covers/entrepreneurs/from-aussie-suits-to-ai-couture-the-startup-trying-to-reinvent-fashion-in-five-days/',
    'https://designobserver.com/your-tailormade-revenge-dress-theres-an-app-for-that/',
  ];
  for (const { file, lang } of pages) {
    const locale = lang === 'en' ? 'en' : 'zh';
    const html = readFileSync(file, 'utf8');
    const intro = html.match(/<section id="about"[^>]*>(.*?)<\/section>/s)?.[1];
    assert.ok(intro);
    assert.equal(biography[locale].length, 6);
    assert.deepEqual(biography[locale].flat().filter(segment => segment.href).map(segment => segment.href), expectedLinks);
    for (const paragraph of biography[locale]) {
      for (const segment of paragraph) {
        assert.ok(intro.includes(segment.text.replaceAll('&', '&amp;')), `Missing biography text: ${segment.text}`);
        if (segment.href) assert.ok(intro.includes(`href="${segment.href.replaceAll('&', '&amp;')}"`));
      }
    }
    assert.deepEqual([...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]), ['hero', 'about', 'work', 'writing', 'contact']);
    assert.ok(!/hero-summary|about-story|class="teaching"|class="principle"|cv-note|Five projects, from infrastructure to applications\.|五个项目，从底层系统到实际应用。|English · PDF|英文 · PDF|Built for reading\. Hosted on GitHub Pages\.|为阅读而设计 · 托管于 GitHub Pages/.test(html));
  }
  const englishText = biography.en.map(paragraph => paragraph.map(segment => segment.text).join(''));
  assert.ok(englishText[0].startsWith('Hi, I’m Jason Wang, a Sydney-based applied AI engineer'));
  assert.ok(englishText[1].includes('5.8K+ GitHub stars') && englishText[1].includes('37K+ stars') && englishText[1].includes('245K+ stars'));
  assert.ok(englishText[2].includes('At THDR Group, I implemented the core agent workflow'));
  assert.ok(englishText[3].includes('Genesis Accelerator, Cohort 36, in late 2025.'));
  assert.ok(englishText[4].includes('turn their needs into useful, reliable agent systems.'));
  assert.equal(englishText[5], 'Fun fact: I was a journalist back in 2019.');
});

test('sections retain essential content without captions or explanatory subtitles', () => {
  for (const { file } of pages) {
    const html = readFileSync(file, 'utf8');
    const hero = html.match(/<section id="hero"[^>]*>(.*?)<\/section>/s)?.[1];
    assert.ok(hero);
    assert.ok(hero.includes('data-cv-link'));
    assert.ok(!hero.includes('class="biography"'));
    assert.ok(!/<figcaption|project-focus|project-number|project-note|article-destination|contact-description/.test(html));
    assert.ok(!/Notes from building NoKV|Let’s build something useful\.|durable checkpoints, ownership fencing and safe recovery/.test(html));
    for (const section of ['about', 'work', 'writing', 'contact']) {
      assert.ok(html.includes(`id="${section}-title" class="section-heading"`));
    }
    const nokv = html.match(/<article[^>]+data-project="nokv"[^>]*>(.*?)<\/article>/s)?.[1];
    assert.ok(nokv && /engineering|工程实现/.test(nokv));
    assert.ok(/Listed in|已收录于/.test(nokv));
  }
});

test('contact links use labelled icons instead of visible addresses or platform names', () => {
  for (const { file } of pages) {
    const html = readFileSync(file, 'utf8');
    const contacts = [...html.matchAll(/<a class="contact-icon"([^>]*)>(.*?)<\/a>/gs)];
    assert.equal(contacts.length, 3);
    contacts.forEach(([_, attributes, content], index) => {
      assert.ok(attributes.includes(`href="${[`mailto:${profile.email}`, profile.github, profile.linkedin][index]}"`));
      assert.match(attributes, /aria-label="[^"]+"/);
      assert.match(attributes, /title="[^"]+"/);
      assert.match(content, /aria-hidden="true"/);
      assert.match(content, /<svg\b/);
      assert.equal(content.replace(/<[^>]*>/g, '').trim(), '');
    });
  }
});

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
