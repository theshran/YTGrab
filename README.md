# YTGrab — YouTube Downloader Frontend

A static, no-build frontend for a YouTube video/audio downloader. Red theme,
light/dark mode, a working language switcher, and SEO-ready pages (How to Use,
FAQ, Privacy Policy, Terms and Conditions). No backend yet — the download form
currently runs a **frontend-only demo** so you can see and test the full UI
before wiring up a real API.

## File structure
ytgrab/
├── index.html Homepage — hero, downloader form, steps, features
├── how-to-use.html Step-by-step guide (SEO page)
├── faq.html FAQ accordion (SEO page)
├── privacy-policy.html Privacy policy (SEO page)
├── terms-and-conditions.html Terms and conditions (SEO page)
├── robots.txt Search engine crawling rules
├── sitemap.xml Page list for search engines
├── css/
│ └── style.css All styling — colors, layout, components
├── js/
│ ├── main.js Theme toggle, mobile nav, FAQ accordion, demo download flow
│ └── i18n.js Language dictionary + switcher logic
└── assets/
└── favicon.svg Site icon


No build tools, no npm install, no framework — every page is plain HTML/CSS/JS,
so it deploys straight to Cloudflare Pages (same as your other projects) with
zero build command.

## Renaming the project

The brand name "YTGrab" appears in a few places:

1. `<title>` and `<meta name="description">` tags in every `.html` file
2. `.brand-name` and `.brand-mark` text in the header/footer of every page
3. `robots.txt` / `sitemap.xml` — swap `yourdomain.com` for your real domain

Easiest approach: open each `.html` file and use find-and-replace for
`YTGrab` → `YourNewName`. There's no build step, so this is a plain text edit.

## Colors (red theme)

All colors are CSS variables at the top of `css/style.css`, under `:root` for
light mode and `[data-theme="dark"]` for dark mode. To adjust the red shade,
change `--color-primary` and `--color-primary-dark` — every button, accent,
and highlight derives from those two values.

## Language switcher

`js/i18n.js` holds a dictionary object per language (`en`, `hi`, `es`, `fr` are
included as a starting point). Text elements are tagged with
`data-i18n="key"` in the HTML; the switcher swaps their text content when a
language is picked. The picked language is remembered in the browser via
`localStorage`.

To add a language:
1. Copy an existing language object in `I18N` (e.g. `es`) and translate the values.
2. Give it a new key, e.g. `pt: { name: "Português", ... }`.
3. It automatically appears in the language dropdown — no other changes needed.

Note: only the homepage UI strings + shared header/footer are translated right
now. The FAQ/Privacy/Terms long-form content stays in English until you decide
to translate it (that's a content decision, not a code limitation).

## Dark / light mode

Toggled via the sun/moon button in the header. Preference is saved to
`localStorage` and also respects the visitor's OS-level preference on first
visit (`prefers-color-scheme`).

## Deploying (Cloudflare Pages)

Same flow as your other downloader projects:

1. Push this folder to a new GitHub repo.
2. In Cloudflare Pages, create a project connected to that repo.
3. Build command: **none** (leave blank). Output directory: **/** (root).
4. Attach your custom domain once the first deploy succeeds.

## Wiring up a real backend later

Right now `js/main.js` has a `fetchVideoInfo(url)` function that returns fake
sample data after a short delay, just so the UI has something to show. When
you're ready to connect a real backend (e.g. a Cloudflare Worker in front of
a VPS running `yt-dlp`), replace the body of that function with a real
`fetch()` call to your API.

You'll also want to update `renderResult()` in the same file so each format
button links to (or triggers) the real download URL your backend returns,
instead of the current placeholder icon button.

A rough backend shape that fits this frontend, when you're ready:
- **VPS**: runs `yt-dlp` to resolve a YouTube URL into available formats and
  either streams the file or produces a short-lived signed download link.
- **Cloudflare Worker**: sits in front of the VPS as your public API,
  handling CORS, basic rate-limiting, and request validation before it
  reaches the VPS.
- **This frontend**: calls the Worker's URL from `fetchVideoInfo()` above.

## What's intentionally left out (for now)

- Real video resolution / download — see above.
- Full translation of legal pages — add as needed.
- Analytics — add your preferred privacy-respecting analytics script to
  each page's `<head>` if/when you want it.
