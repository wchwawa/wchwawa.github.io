import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import astroConfig from '../astro.config.mjs';
import { profile, projects, articles, biography, facts } from '../src/data/profile.ts';
import { experience, education, cvCopy, skills } from '../src/data/cv.ts';

const pages = [
  { file: 'dist/index.html', lang: 'en', path: '/' },
  { file: 'dist/zh/index.html', lang: 'zh-CN', path: '/zh/' },
];

test('the complete linked biography is preserved beside the profile on each page', () => {
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
    assert.deepEqual([...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]), ['about', 'experience', 'education', 'skills', 'speaking', 'writing']);
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
    const hero = html.match(/<aside id="hero"[^>]*>(.*?)<\/aside>/s)?.[1];
    assert.ok(hero);
    assert.ok(!html.includes('class="wordmark"'), 'Profile pages do not repeat the name in the navigation');
    assert.ok(!/data-cv-link|download=|Download CV|下载英文 CV/.test(html));
    assert.ok(!hero.includes('class="biography"'));
    assert.ok(!/<figcaption|project-focus|project-number|project-note|article-destination|contact-description/.test(html));
    assert.ok(!/Notes from building NoKV|Let’s build something useful\.|durable checkpoints, ownership fencing and safe recovery/.test(html));
    for (const section of ['about', 'experience', 'education', 'skills', 'speaking', 'writing']) {
      assert.ok(html.includes(`id="${section}-title" class="section-heading"`));
    }
    const nokv = html.match(/<li[^>]+data-project="nokv"[^>]*>(.*?)<\/li>/s)?.[1];
    assert.ok(nokv && /engineering|工程实现/.test(nokv));
    assert.ok(/Listed in|收录/.test(nokv));
  }
});

test('the fixed profile provides direct contact icons with accessible names and hover hints', () => {
  for (const { file, lang } of pages) {
    const html = readFileSync(file, 'utf8');
    const contacts = [...html.matchAll(/<a class="profile-contact[^"]*"([^>]*)>(.*?)<\/a>/gs)];
    assert.equal(contacts.length, 5);
    contacts.forEach(([_, attributes, content], index) => {
      assert.ok(attributes.includes(`href="${[`mailto:${profile.email}`, profile.github, profile.linkedin, profile.x, profile.wechatQr][index]}"`));
      assert.match(attributes, /aria-label="[^"]+"/);
      assert.match(attributes, /title="[^"]+"/);
      assert.match(content, /aria-hidden="true"/);
      assert.match(content, /<svg\b/);
      assert.equal(content.replace(/<[^>]*>/g, '').trim(), [profile.email, 'GitHub', 'LinkedIn', 'X', lang === 'en' ? 'WeChat' : '微信'][index]);
    });
  }
});

test('profile presentation is isolated from portfolio content and global section styles', () => {
  const portfolio = readFileSync('src/components/Portfolio.astro', 'utf8');
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  const card = readFileSync('src/components/ProfileCard.astro', 'utf8');
  const globalStyles = readFileSync('src/styles/global.css', 'utf8');
  assert.ok(layout.includes('<ProfileCard locale={locale} />'));
  assert.equal((layout.match(/<header\b/g) ?? []).length, 1);
  assert.ok(!portfolio.includes('<aside') && !portfolio.includes('ProfileCard'));
  assert.match(card, /<style>/); // Astro-scoped styles, not a global profile stylesheet.
  assert.match(card, /position: fixed/);
  assert.ok(!/\.profile-card|\.profile-role|\.portrait|\.profile-contact/.test(globalStyles));
});

test('profile subtitles focus on Agent Systems and DBMS in both languages', () => {
  assert.equal(cvCopy.en.specialisms, 'Agent Systems & DBMS');
  assert.equal(cvCopy.zh.specialisms, 'Agent 系统与 DBMS');
  for (const { file, lang } of pages) {
    const locale = lang === 'en' ? 'en' : 'zh';
    const html = readFileSync(file, 'utf8');
    const subtitle = html.match(/<p class="profile-specialisms"[^>]*>(.*?)<\/p>/s)?.[1];
    assert.equal(subtitle, cvCopy[locale].specialisms.replaceAll('&', '&amp;'));
  }
});

test('WeChat keeps a native dialog and a direct original-image fallback in both languages', () => {
  for (const { file } of pages) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /<dialog\b[^>]*id="wechat-dialog"[^>]*aria-labelledby="wechat-title"/);
    assert.match(html, /<form\b[^>]*method="dialog"/);
    assert.match(html, /<img\b[^>]*src="\/images\/wechat-qr.jpg"[^>]*width="888"[^>]*height="1191"/);
  }
  const original = readFileSync(`public${profile.wechatQr}`);
  assert.equal(original.subarray(0, 3).toString('hex'), 'ffd8ff');
  assert.deepEqual(readFileSync(`dist${profile.wechatQr}`), original);
});

test('the same five projects and shared facts are used in both languages', () => {
  assert.deepEqual(projects.map(p => p.name), ['NoKV', 'Neuono', 'PicSEO AI', 'LoopX', 'EchoJournal']);
  for (const { file } of pages) {
    const html = readFileSync(file, 'utf8');
    assert.deepEqual([...html.matchAll(/data-project="([^"]+)"/g)].map(m => m[1]).sort(), projects.map(p => p.id).sort());
    assert.ok(html.includes(facts.neuonoShowcase));
    assert.ok(html.includes(`cohort ${facts.echoJournalCohort}`) || html.includes(`第 ${facts.echoJournalCohort} 期`));
    assert.ok(html.includes(facts.loopx.displayStars));
    assert.ok(html.includes(facts.loopx.checkedOn));
    assert.ok(html.includes('100+') && html.includes('30+'));
    for (const { url } of [...projects, ...articles]) assert.ok(html.includes(url), `Missing ${url}`);
    assert.ok(!/Google Analytics|googletagmanager|formspree|NASA-funded|Mike Woster/.test(html));
  }
});

test('CV experiences share exact dates and reverse chronology in both languages', () => {
  assert.deepEqual(experience.map(({ id, start, end }) => [id, start, end]), [
    ['loopx', '2026-08', null],
    ['nokv', '2026-03', null], ['echojournal', '2025-08', '2025-09'], ['usyd', '2025-06', null],
    ['picseo', '2025-03', '2025-06'], ['neuono', '2025-01', '2025-03'],
  ]);
  for (const { file, lang } of pages) {
    const locale = lang === 'en' ? 'en' : 'zh';
    const html = readFileSync(file, 'utf8');
    const entries = [...html.matchAll(/<li\b[^>]*data-experience="([^"]+)"[^>]*>(.*?)<\/li>/gs)];
    assert.deepEqual(entries.map(entry => entry[1]), experience.map(entry => entry.id));
    assert.ok(!/data-experience="(?:holt|unihack|mlflow)"|UNIHACK|MLflow/.test(html));
    entries.forEach((entry, index) => {
      const source = experience[index];
      assert.ok(entry[2].includes(`datetime="${source.start}"`));
      if (source.end) assert.ok(entry[2].includes(`datetime="${source.end}"`));
      else assert.ok(entry[2].includes(cvCopy[locale].present));
      for (const value of Object.values(source.copy[locale])) assert.ok(entry[2].includes(value.replaceAll('&', '&amp;')));
      assert.match(entry[2], /<details class="experience-details">/);
      assert.match(entry[2], /<summary\b[^>]*aria-label=/);
      const toggle = entry[2].match(/<span class="experience-toggle"[^>]*>(.*?)<\/span>/s)?.[1];
      assert.match(toggle, /<svg\b/);
      assert.equal(toggle.replace(/<[^>]*>/g, '').trim(), '');
    });
    for (const entry of education) {
      assert.ok(html.includes(entry.copy[locale].institution));
      assert.ok(html.includes(entry.copy[locale].degree));
    }
    for (const skill of skills[locale]) assert.ok(html.includes(skill.text));
    assert.ok(html.includes('id="work"')); // Preserve existing incoming links.
  }
});

test('LoopX consistently identifies Jason as a maintainer in both languages', () => {
  for (const loopx of [experience.find(entry => entry.id === 'loopx'), projects.find(entry => entry.id === 'loopx')]) {
    assert.equal(loopx.copy.en.role, 'Maintainer');
    assert.equal(loopx.copy.zh.role, '开源维护者');
  }
});

test('USYD teaching is limited to undergraduate units in both languages', () => {
  const teaching = experience.find(entry => entry.id === 'usyd');
  assert.match(teaching.copy.en.summary, /five undergraduate units/);
  assert.doesNotMatch(teaching.copy.en.summary, /postgraduate/i);
  assert.match(teaching.copy.zh.summary, /五门本科课程/);
  assert.doesNotMatch(teaching.copy.zh.summary, /研究生/);
});

test('the accelerator experience leads with Genesis and its cohort, with EchoJournal in the details', () => {
  const genesis = experience.find(entry => entry.id === 'echojournal');
  assert.equal(genesis.copy.en.name, 'Genesis Accelerator');
  assert.equal(genesis.copy.en.role, 'Cohort 36');
  assert.equal(genesis.copy.zh.name, 'Genesis 创业孵化器');
  assert.equal(genesis.copy.zh.role, '第 36 期');
  for (const locale of ['en', 'zh']) {
    assert.ok(genesis.copy[locale].summary.includes('EchoJournal'));
  }
});

test('each page has its own metadata, alternates and a Person identity', () => {
  assert.equal(profile.site, 'https://jasonchwang.com');
  assert.equal(astroConfig.site, profile.site);
  for (const { file, lang, path } of pages) {
    const html = readFileSync(file, 'utf8');
    assert.ok(html.includes(`<html lang="${lang}"`));
    assert.ok(html.includes(`rel="canonical" href="${profile.site}${path}"`));
    assert.ok(html.includes(`property="og:url" content="${profile.site}${path}"`));
    assert.ok(html.includes(`property="og:image" content="${profile.site}${profile.portrait}"`));
    assert.ok(!html.includes('https://wchwawa.github.io'));
    for (const code of ['en', 'zh-CN', 'x-default']) assert.ok(html.includes(`hreflang="${code}"`));
    const json = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1];
    assert.ok(json);
    const person = JSON.parse(json);
    assert.equal(person['@type'], 'Person');
    assert.equal(person.name, profile.fullName);
    assert.equal(person.url, profile.site);
    assert.equal(person.image, `${profile.site}${profile.portrait}`);
    assert.deepEqual(person.sameAs, [profile.github, profile.linkedin, profile.x]);
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
