# Jason Wang

A bilingual personal website for Jason (Changhao) Wang, built with Astro and plain CSS.

- English: https://wchwawa.github.io/
- Chinese: https://wchwawa.github.io/zh/
- Hosting: GitHub Pages, with no application server, tracking or contact form.

## Develop

Use Node.js 24 or newer. When changing dependencies, use npm 11.19 or newer so the lockfile includes the optional native-build dependency graph on both macOS and Linux.

```sh
npm ci
npx playwright install chromium
npm run dev
```

## Check before publishing

```sh
npm run verify
npm run audit:performance
```

`verify` checks types, generates the static site, checks shared content and metadata, and runs browser tests. Browser coverage includes both languages at 360, 390, 768 and 1440 CSS pixels, both themes, keyboard interaction, disabled JavaScript, blocked local storage, PDF download, local assets, WCAG accessibility checks and 200% zoom-equivalent reflow.

The mobile Lighthouse audit targets performance of at least 95 and accessibility of 100 on each language route. Automated scores complement, but do not replace, a visual review. Local screenshots and reports go into the ignored `qa/` directory. Use `AUDIT_URL=https://wchwawa.github.io npm run audit:performance` to audit the deployed site.

## Maintain content

`src/data/profile.ts` is the source of truth for personal details, ordered projects, project links, shared facts and the two sets of copy. Both routes render the same components. English and Chinese are written naturally rather than translated word for word.

The five project entries are intentionally limited to NoKV, Neuono, PicSEO AI, LoopX and EchoJournal. Other CV items should not be silently added as project entries.

Content was checked against the owner's current CV and public project sources on 13 September 2026. The NoKV Landscape links are directory listings, not endorsements. Neuono's showcase is NYFW 25SS; the founding role was a contract. PicSEO's first-month metrics and EchoJournal's Genesis cohort are owner-provided CV facts. LoopX's 5.8K stars is a rounded, dated snapshot of 5,816 stars, not a live counter. Refresh the number and verification date together if updating it.

Only two articles authored by Jason are linked, at their original NoKV URLs. The older interface article is described as historical research, not a benchmark of the current release.

The English CV is a verbatim copy in `public/cv/Jason_Wang_CV.pdf`. Both languages label the download appropriately. Replace that public copy when publishing a new CV; do not edit the source resume as part of a website change. The portrait is the existing public portrait used by NoKV. Do not add private correspondence, unpublished collaboration details or personal documents to this repository.

## Design and behaviour

The warm paper palette, Source Serif 4 headings, Inter body and restrained blue links follow NoKV's visual language. The two Latin variable fonts are self-hosted from the Fontsource packages; Chinese uses local system fallbacks. Core content and navigation work without JavaScript. Light is the default theme; the optional theme control saves a manual choice and applies it before paint. It also works when browser storage is unavailable.

Font copyright notices and SIL Open Font Licenses are included in `public/fonts/licenses/`.

## Deployment

The public repository is `wchwawa/wchwawa.github.io`. In repository Settings → Pages, the source is **GitHub Actions**. The `main` branch is published to the root user site, so no Astro `base` prefix or custom domain is needed.

Pull requests run checks only. Pushes to `main` run the same checks, then upload `dist/` and deploy to Pages. A manual workflow run deploys only when run on `main`. Official actions are pinned to commit SHAs; the deploy job alone receives Pages and OIDC write permissions.

Commits should use the author's GitHub account email and include a DCO `Signed-off-by` trailer (`git commit -s`).
