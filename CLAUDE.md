# CLAUDE.md

## Project summary

Cakes by Steph is a static marketing and lead-generation website for a custom cake and Peruvian pastry bakery in Leesburg, VA, serving Loudoun County and Northern Virginia. The site has two jobs: rank in local search (heavy SEO focus — per-page schema markup, locality landing pages, sitemap/robots/llms files) and convert visitors into leads through tasting and custom-order forms. Every page is hand-authored static HTML; there is no application backend beyond a single serverless function that alerts the owner about new leads.

## Tech stack and key files

- **Plain static HTML** — no framework, no build step, no `package.json`, no bundler. Each `.html` file is served as-is.
- **Hosting: Netlify.** [netlify.toml](netlify.toml) sets cache headers, security headers, and the functions directory; [_redirects](_redirects) handles URL redirects (e.g. `/cake-quote` → `/custom-order`).
- **`styles.css`** — the single shared stylesheet and design-token system. Colors live as CSS custom properties on `:root` (`--cream`, `--ivory`, `--blush`, `--rose`, `--dark`, `--gold`, `--text`, `--muted`, `--line`). Fonts are Cormorant Garamond + Jost from Google Fonts. Use these tokens rather than hardcoding colors.
- **`analytics.js`** — loads Google Analytics 4 (`G-6725JMNSF3`) and Google Ads (`AW-18223804877`), and tracks phone taps and CTA clicks. It no-ops cleanly if the GA4 ID is unset.
- **`netlify/functions/submission-created.js`** — fires on every verified (non-spam) Netlify form submission and texts the lead details to the owner via Twilio. It reads four env vars (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`, `ALERT_TO`); if any are missing it logs the message and returns 200 without erroring. This graceful degradation is intentional — preserve it.

## Folder structure

```
/                          ~60 HTML pages at the repo root
  index.html               homepage
  wedding-cakes, birthday-cakes, quinceanera-cakes,
  baby-baptism-cakes, peruvian-pastries, corporate-cakes,
  commercial, about, contact, portfolio, areas, blog ...
  custom-cakes-<city>.html  ~40 SEO locality landing pages
  order / custom-order / design-your-cake / thank-you   form pages
  styles.css, analytics.js, favicon.svg
blog/                      article pages
images/portfolio/          cake photos (.jpg)
netlify/functions/         submission-created.js (Twilio lead alert)
netlify.toml, _redirects   Netlify config
robots.txt, sitemap.xml, llms.txt   SEO / crawler files
CLAUDE.md, README.md
```

### Locality-page template pattern

The ~40 `custom-cakes-<city>.html` files (e.g. [custom-cakes-ashburn.html](custom-cakes-ashburn.html)) are programmatic SEO pages built from one shared template. They are structurally identical — only the city name, the per-page SEO head (title, description, canonical, OG URL), the `City` value in the JSON-LD `areaServed`, and a few "nearby areas" internal links differ. When changing the template, apply the change consistently across all locality pages, not just one.

## ⚠️ Maintenance gotcha (read first)

**There are no shared includes or partials.** The `<nav>`, `<footer>`, and the boilerplate portion of the `<head>` (font links, stylesheet link, analytics script, favicon) are **copy-pasted into every page**. Any sitewide change — a new nav link, a footer edit, adding a tracking tag, changing fonts — **must be applied consistently to every affected file**. Before finishing such a change, grep across all pages to confirm none were missed. This is the single most common source of inconsistency in this repo.

## Conventions

- **Keep edits additive.** Prefer adding to a page over restructuring it. Don't remove or rewrite working markup unless the task requires it.
- **Never break a page's SEO head.** Every page must keep its `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags, and JSON-LD schema. When editing a page, preserve these and keep them accurate to that page.
- **Forms must stay intact.** Every form must keep `data-netlify="true"`, the hidden `bot-field` honeypot input, and `action="/thank-you"`. Removing any of these breaks lead capture, spam filtering, or the Twilio alert.
- **Preserve graceful degradation.** The Twilio function must continue to return 200 and no-op when its env vars are unset; `analytics.js` must continue to no-op when no real GA4 ID is present.
- **Use the design tokens** in `styles.css` rather than hardcoded color values.

## Workflow rules

- **Editing files locally is fine — proceed without asking.** Reading, searching, and making local edits need no special approval.
- **`git push` and any Netlify deploy require explicit approval every time.** They are never automatic and never assumed from a prior approval. Ask before each push or deploy.
- **A task is done only when deployed and verified — not when described.** Describing or staging a change does not complete it. Completion means the change is live and confirmed working on the deployed site.
