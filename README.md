# Jason Wang

A bilingual personal website for Jason (Changhao) Wang, built with Astro and plain CSS.

- English: https://jasonchwang.com/
- Chinese: https://jasonchwang.com/zh/
- Hosting: GitHub Pages, with no application server, tracking or contact form.

## Inline CV and experience timeline

The site presents an inline CV: the linked biography, a reverse-chronological experience timeline, education, skills, speaking and writing. The fixed desktop profile rail becomes a single compact fixed header on mobile. This layout replaces the former CV download action and separate project list.

`src/data/cv.ts` holds the shared dates and bilingual CV summaries. Dates and roles were checked against the owner's `Jason_WANG_CV.pdf` on 20 September 2026. Work, open-source and personal projects are distinguished in the data but share one timeline, ordered by start month. End dates remain visible; concurrent roles are not presented as sequential employment. The five previously selected projects keep their original URLs and appear within that chronology. `#work` is retained as an incoming-link alias for `#experience`.

The original CV file remains available at its existing URL to avoid breaking direct links, but neither homepage contains a download link. No source CV or private correspondence is modified or added to the repository. The six-paragraph biography, its nine hyperlinks, contact destinations, theme preference and original WeChat QR dialog are preserved.

The layout takes its reading-first profile rail and timeline cues from https://bouwenzhou.github.io/, retaining the existing warm paper palette, local fonts and blue links. English body copy now uses Source Serif 4; Chinese retains system sans-serif for legibility. The timeline is semantic HTML and stays fully readable without JavaScript.

The compact revision shows six experiences, with Holt, UNIHACK and MLflow omitted at the owner's request. The EchoJournal entry leads with Genesis Accelerator and Cohort 36 to foreground the accelerator experience; the project is described in its details. Each entry places its name and role on one line and previews one line of its description. Native `details` disclosures use a chevron icon that points down when collapsed and up when expanded, with an accessible name and native keyboard support. They expand the complete description and outcome without JavaScript; on narrow screens, opening an entry also reveals the full role when it does not fit on one line. Dates and project links are preserved. Typography and section spacing are tightened without reducing contact touch targets.

`ProfileCard.astro` is rendered by `BaseLayout.astro` within the page header, outside `Portfolio.astro` and its content layout. It owns its scoped typography, portrait and contact styles. `profile-frame.css` owns the shared shell geometry, header controls and space reserved for the fixed profile; content sections must not target profile selectors or redefine these frame tokens. Desktop positioning is viewport-fixed rather than sticky, so the card does not shift at the top of the page or disappear at the footer. At widths up to 900px, or viewport heights up to 620px, only one compact fixed profile header remains: the navigation and repeated wordmark disappear without reserving an extra row or divider. Language and theme controls stay inside this header. It uses two rows on phones and one row from 700px, reserving 80-128px depending on viewport width, plus any safe-area inset. Section anchors clear the complete header. The full specialisms and teaching text stay in the desktop card and the biography.

Profile regression tests scroll through every section, expand an experience and change the content column's height, width and padding while asserting unchanged profile bounds. Both languages, mobile portrait/landscape, desktop, 200% reflow, disabled JavaScript and the modal QR interaction are covered. Contact targets remain at least 44px tall. No scroll listener or positioning JavaScript is needed.

Standard desktop views (at least 901px wide and 621px tall) show the original vertical contact list with visible email and social labels. Their navigation stays centered without repeating the profile name. Compact views keep all five icons, including email, in one row of equal 44px targets, without visible labels; their layout is unchanged. Accessible names and native hover hints identify every contact. Alignment checks cover 320px screens, both sides of the 700px header split and the desktop/short-viewport breakpoints. They verify the appropriate row or column layout, aligned labels, no overlapping controls and no residual compact navigation row. Section headings and the footer use whitespace instead of horizontal rules; the experience timeline retains its functional spine.

Preview locally after building:

```sh
npm run build
ASTRO_PREVIEW_BACKGROUND=1 npm run preview -- --host 127.0.0.1 --port 4330 --ignore-lock
```

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

`verify` checks types, generates the static site, checks shared content and metadata, and runs browser tests. Browser coverage includes both languages at 320-1440 CSS pixels, both themes, keyboard interaction, disabled JavaScript, blocked local storage, retained PDF access, local assets, WCAG accessibility checks and 200% zoom-equivalent reflow. Profile and contact tests also cover short landscape viewports and responsive breakpoints.

The mobile Lighthouse audit targets performance of at least 95 and accessibility of 100 on each language route. Automated scores complement, but do not replace, a visual review. Local screenshots and reports go into the ignored `qa/` directory. Use `AUDIT_URL=https://jasonchwang.com npm run audit:performance` to audit the deployed site.

## Maintain content

`src/data/profile.ts` holds personal details, project links, shared facts and the two sets of biography copy; `src/data/cv.ts` holds the CV timeline, education, skills and profile subtitles. Both routes render the same components. English and Chinese are written naturally rather than translated word for word. The profile contains the name, role, portrait and contact links. The complete, six-paragraph biography opens the content column in `#about`, before the experience timeline. Its nine links use structured text segments, not raw HTML.

The five project entries are intentionally limited to NoKV, Neuono, PicSEO AI, LoopX and EchoJournal. Other CV items should not be silently added as project entries.

Content was checked against the owner's current CV and public project sources on 13 September 2026. The NoKV Landscape links are directory listings, not endorsements. Neuono's showcase is NYFW 25SS; the founding role was a contract. PicSEO's first-month metrics and EchoJournal's Genesis cohort are owner-provided CV facts. LoopX's 5.8K stars is a rounded, dated snapshot of 5,816 stars, not a live counter. Refresh the number and verification date together if updating it.

Only two articles authored by Jason are linked, at their original NoKV URLs, with their titles and publication dates. The older interface article is historical research, not a benchmark of the current release.

The homepage biography was supplied by the owner on 15 September 2026, with only minor English grammar corrections and a corresponding Chinese version. Its collaboration descriptions and rounded star counts are owner-provided snapshots, not live counters. Keep every paragraph and hyperlink when adjusting its presentation.

The English CV remains a verbatim copy in `public/cv/Jason_Wang_CV.pdf` for existing direct links; neither homepage offers a download button. Replace that public copy when publishing a new CV; do not edit the source resume as part of a website change. The portrait is the existing public portrait used by NoKV. Do not add private correspondence, unpublished collaboration details or personal documents to this repository.

## Design and behaviour

The warm paper palette, Source Serif 4 headings and English body, Inter interface text and restrained blue links follow NoKV's visual language. The two Latin variable fonts are self-hosted from the Fontsource packages; Chinese uses local system fallbacks. Core content and navigation work without JavaScript. Light is the default theme; the optional theme control saves a manual choice and applies it before paint. It also works when browser storage is unavailable.

Keep section headings functional and omit explanatory subtitles, portrait captions and decorative project numbers. Experience entries retain their role, description and outcome, with the star-count date inline where applicable. The NoKV contribution is summarised as engineering, downstream use-case discovery and open-source collaboration; do not reintroduce implementation-detail lists. Profile contacts stay available while scrolling, including on mobile, while the biography remains a readable text column.

Font copyright notices and SIL Open Font Licenses are included in `public/fonts/licenses/`.

Email, GitHub, LinkedIn, X and WeChat use build-time Tabler SVG icons with localised accessible names, hover hints, visible keyboard focus and 44px targets. The Tabler MIT notice is included in `public/icons/LICENSE.txt`.

The WeChat icon opens a native modal dialog with the owner's original, unmodified QR image. It supports Escape, a close button, backdrop dismissal and native focus containment/restoration. The image stays white in both themes; a compact landscape layout keeps it visible on short screens. The full-size image link supports saving from a phone, and the icon links directly to that image when JavaScript or native dialogs are unavailable. No external service or additional dependency is needed. Browser tests cover both languages and themes, mobile portrait/landscape, keyboard operation and the no-JavaScript fallback.

## Deployment

The public repository is `wchwawa/wchwawa.github.io`. In repository Settings → Pages, the source is **GitHub Actions** and the custom domain is `jasonchwang.com`. The site is published at the domain root, so no Astro `base` prefix is needed. Keep `astro.config.mjs` and `profile.site` aligned so canonical URLs, language alternates, social metadata, structured data and the sitemap use the same origin.

Cloudflare manages DNS only; GitHub Pages serves the site and provisions its HTTPS certificate. The apex uses GitHub Pages' four IPv4 and four IPv6 addresses, while `www` is a CNAME to `wchwawa.github.io`. These records are **DNS only**, with Cloudflare proxying disabled. GitHub Pages redirects `www.jasonchwang.com` and the original `wchwawa.github.io` address to the apex domain. Enforce HTTPS in Pages settings once the certificate is ready.

| DNS name | Type | Values |
| --- | --- | --- |
| `@` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www` | CNAME | `wchwawa.github.io` |

The custom-domain binding is maintained in GitHub Pages settings. A repository `CNAME` file is not used by this custom Actions deployment. Never commit Cloudflare API tokens or other deployment credentials.

Pull requests run checks only. Pushes to `main` run the same checks, then upload `dist/` and deploy to Pages. A manual workflow run deploys only when run on `main`. Official actions are pinned to commit SHAs; the deploy job alone receives Pages and OIDC write permissions.

Commits should use the author's GitHub account email and include a DCO `Signed-off-by` trailer (`git commit -s`).
