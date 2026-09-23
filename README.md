# Sandeep Midde — Personal Website

Personal portfolio and blog for Sandeep Midde (Technology & Delivery Leader).
It's a static site on **Cloudflare Pages**. The blog is built from plain
Markdown or Word files, and a few Cloudflare Pages Functions handle view and
like counters.

- **Repo:** https://github.com/sandeepmidde/PersonalWebsite
- **Hosting:** Cloudflare Pages. Every push to `main` builds and deploys.
- **Status (as of 2026-09-23):** Live. The portfolio, blog index, post pages,
  counters, comments, analytics, the native Share button and link previews
  for LinkedIn / WhatsApp / X all work.
- **Domain:** `sandeepmidde.com`, registered at Spaceship. Nameservers point to
  Cloudflare (`kareem` / `lorna.ns.cloudflare.com`), and it's attached to the Pages
  project as a custom domain (root + `www`, with `www` redirecting to root).

---

## Table of contents

1. [Architecture at a glance](#1-architecture-at-a-glance)
2. [Repository layout](#2-repository-layout)
3. [Pages and features](#3-pages-and-features)
4. [How things work end to end](#4-how-things-work-end-to-end)
   - [Writing and publishing a blog post](#41-writing-and-publishing-a-blog-post)
   - [The build step](#42-the-build-step-scriptsbuild-postsmjs)
   - [Runtime rendering](#43-runtime-rendering)
   - [View and like counters](#44-view-and-like-counters)
   - [Comments (giscus)](#45-comments-giscus)
   - [Analytics](#46-analytics)
5. [Current state](#5-current-state)
6. [Known issues and technical debt](#6-known-issues-and-technical-debt)
7. [Roadmap: what to build next](#7-roadmap-what-to-build-next)
8. [Local development](#8-local-development)
9. [Deployment and configuration](#9-deployment-and-configuration)
10. [Editing guide (quick reference)](#10-editing-guide-quick-reference)
11. [Change history](#11-change-history)

---

## 1. Architecture at a glance

```
 You write                     Cloudflare Pages build                  Browser at runtime
 ─────────                     ──────────────────────                  ──────────────────
 blog/<slug>/content.md   ──►  npm run build                     ──►   blog.html  ─ fetch posts/posts-index.json
 blog/<slug>/content.docx      (scripts/build-posts.mjs)               post.html  ─ fetch posts/<slug>.json
 blog/<slug>/*.png               ├─ posts/posts-index.json                        ─ GET/POST /api/view, /api/like ──► Workers KV (BLOG_KV)
                                 ├─ posts/<slug>.json                             ─ giscus iframe ──► GitHub Discussions
                                 └─ posts/images/<slug>/*                          ─ Cloudflare Web Analytics beacon
 git push origin main ─────►  deploys static files + /functions
```

| Layer | Technology |
|---|---|
| Markup / styling | Hand-written HTML, Tailwind CSS (Play CDN, with the typography plugin on blog pages), Google Font *Manrope* |
| Interactivity | Vanilla JavaScript inline in each page. No framework, no bundler |
| Blog content | Markdown (`marked`) or Word `.docx` (`mammoth`), converted to JSON at build time |
| Build | Node ≥ 18, `npm run build` → `scripts/build-posts.mjs` |
| Backend | Cloudflare Pages Functions (`functions/api/*.js`) + Workers KV |
| Comments | giscus, which stores comments as GitHub Discussions on this repo |
| Analytics | Cloudflare Web Analytics (cookie-less beacon) |

Design principle: **`/blog` is the only content you edit by hand.** Everything
in `/posts` is generated and gitignored.

---

## 2. Repository layout

```
.
├── index.html                 # Portfolio / landing page (single page, anchor-nav)
├── blog.html                  # Blog index: tag filter pills + post cards
├── post.html                  # Template for every post (copied per post by the build)
├── social-card.png            # Default link-preview image (1200×627)
│
├── blog/                      # ✍️ SOURCE OF TRUTH for posts (hand-edited)
│   ├── welcome-to-my-blog/content.md
│   ├── ai-agents-move-into-production/content.md + agent-network.png
│   └── agentic-ai-in-project-management/content.docx
│
├── posts/                     # ⚙️ BUILD OUTPUT, gitignored, never edit
│   ├── posts-index.json       # List of all posts (no bodies), newest first
│   ├── <slug>.json            # One file per post, with rendered HTML body
│   ├── images/<slug>/...      # Images copied or extracted from the sources
│   └── <slug>/index.html      # Shareable page per post (link-preview tags built in)
│
├── scripts/build-posts.mjs    # Build step: blog/ → posts/
├── functions/api/
│   ├── view.js                # GET/POST /api/view: per-post view counter
│   └── like.js                # GET/POST /api/like: per-post like counter
│
├── Resume/SandeepMidde.pdf    # Public résumé linked from the site
│                              # (Car.pdf, TargetResume.pdf are gitignored and private)
├── ref/                       # Design-feedback screenshots (gitignored)
├── package.json               # deps: marked, mammoth; script: build
└── .gitignore
```

---

## 3. Pages and features

### `index.html`: portfolio
- **Fixed left sidebar** (desktop) with name, title, blurb, scroll-spy nav,
  a Résumé button, and LinkedIn / Email links. A GitHub icon is present but
  hidden (`class="hidden"`, `href="#"`).
- **Mobile**: a hamburger button opens a full-screen overlay menu.
- **Sections**: Home (intro) → Experience (timeline with glowing active dot)
  → Tech Stack (filterable pills: Leadership, Platform, AI) → Certifications &
  Education → Writing (static teaser linking to the blog) → Contact.
- **Effects**: cursor-following glow, fade-up on scroll.
- Content blocks carry `EDIT:` comments that show where to change text.

### `blog.html`: blog index
- Loads `posts/posts-index.json` and renders a card per post (date, read time,
  title, excerpt, tags).
- **Filter pills** are built from the union of all post tags, so a new tag
  shows up as soon as a post uses it.
- A header comment explains how to add a post.

### `post.html`: post template (`post.html?slug=<slug>`)
- Three-column layout on desktop:
  - **Left (sticky):** "Back to Blog" + "More from the blog" (all other posts, newest first).
  - **Centre:** date · read time, title, body (Tailwind `prose`), tags,
    like / views / Share button (native share sheet), giscus comments.
  - **Right (sticky):** "Browse by Topic", a `<details>` accordion per tag.
    Groups containing the current post open automatically, and the current
    post is highlighted.
- Shows a "Post not found" state when the slug is missing or unknown.

---

## 4. How things work end to end

### 4.1 Writing and publishing a blog post

1. Create a folder `blog/<your-post-slug>/`. The folder name becomes the URL slug.
2. Add **either** `content.md` **or** `content.docx`. If both exist, `.md` wins.
3. Structure the document like this:

   ```markdown
   # The Post Title            ← first H1 becomes the title (then removed from the body)
   Tags: AI, Project Management  ← optional, within the first few lines
   Date: 2026-08-08              ← optional, YYYY-MM-DD
   Summary: One-line description ← optional, shown in LinkedIn/WhatsApp link previews

   Body text as normal Markdown…

   ![Alt text](diagram.png)      ← image file sits in the same folder
   ```

   Optionally add a **`cover.png`** (1200×627) to the folder. It becomes the
   link-preview image. Without one, the first PNG/JPG in the post is used, then
   the site-wide `social-card.png`. SVGs can't be used, because LinkedIn won't show them.

   For Word files, use a *Heading 1* style for the title and put the
   `Tags:` / `Date:` lines in their own paragraphs. Paste images straight
   into the document.
4. `git add blog/<slug> && git commit && git push`. Cloudflare rebuilds and
   the post goes live.

### 4.2 The build step (`scripts/build-posts.mjs`)

Runs on every Cloudflare deploy through `npm run build`. For each folder in `/blog`:

| Field | How it's derived |
|---|---|
| `slug` | Folder name, slugified |
| `title` | First `<h1>` in the converted HTML. Falls back to Title-Cased slug |
| `date` | `Date:` line if present and valid ISO. Otherwise the **git date of the first commit** containing the file. Otherwise today |
| `tags` | `Tags:` line, comma-separated. Otherwise `[]` |
| `readTime` | Word count ÷ 200, minimum 1 minute |
| `excerpt` | First ~160 characters of the plain text, cut at a word boundary, with `…` appended |
| `summary` | `Summary:` line, if present. Used for link previews |
| `body` | Rendered HTML (as a one-element array) |
| images | Markdown: local `<img src>` copied to `posts/images/<slug>/`. Word: embedded images extracted as `img-N.<ext>` |

It clears `/posts` first, writes `<slug>.json` for each post, then writes
`posts-index.json` (every post without `body`, sorted newest first).
Line-ending handling works with CRLF files from Windows and Word (fixed in `3d6a255`).

**Shareable post pages.** For each post the build also writes
`posts/<slug>/index.html`. This is a copy of `post.html` with the title,
description and preview image built into its `<head>`, because LinkedIn,
WhatsApp and X don't run JavaScript:

- Preview title: `<short title> — by Sandeep Midde`. The short title is the
  text before any `:` in the post title.
- Preview description: the `Summary:` line, or the excerpt if there isn't one.
- Preview image: `cover.*`, then the first raster image, then `social-card.png`.
- The public URL is **`https://sandeepmidde.com`**, the `SITE_URL` default in
  `scripts/build-posts.mjs`. A `SITE_URL` env var in Cloudflare Pages overrides it.

Post URLs are now `/posts/<slug>/`. Old `post.html?slug=…` links redirect there.

### 4.3 Runtime rendering
- `blog.html` and `post.html` are static shells. All content comes from
  `fetch()` calls to the JSON files, then gets injected with `innerHTML`.
- `post.html` reads `?slug=` and fetches `posts/<slug>.json`. It then
  fetches `posts-index.json` for both sidebars.

### 4.4 View and like counters
- **Endpoints:** `functions/api/view.js`, `functions/api/like.js`.
  - `GET /api/{view|like}?slug=…` returns `{ views }` / `{ likes }`
  - `POST /api/{view|like}` with body `{ "slug": "…" }` increments the count and returns the new value
- **Storage:** Workers KV namespace bound as **`BLOG_KV`**. Keys are `view:<slug>` and `like:<slug>`.
- **De-duplication is client-side only:**
  - A view counts at most once per 12 h per browser (`localStorage["viewed:<slug>"]`).
  - A like counts once per browser (`localStorage["liked:<slug>"]`), and the button is then disabled.
- If a counter call fails, the page carries on without it.

### 4.5 Comments (giscus)
- The giscus script is added once the post loads. Settings:
  repo `sandeepmidde/personalwebsite`, category **Announcements**,
  mapping `specific` with `term = slug`, theme `dark_dimmed`.
- Each post gets one GitHub Discussion, titled with the slug. Readers need a
  GitHub account to comment.

### 4.6 Analytics
- The Cloudflare Web Analytics beacon is on `index.html`, `blog.html` and
  `post.html`, all sharing one token. It doesn't set cookies.

---

## 5. Current state

### ✅ Done and live
- Portfolio page with experience timeline, tech stack filter, credentials, contact
- Responsive layout with mobile menu
- Data-driven blog: index with tag filters, shared post template
- Write-and-push pipeline: Markdown or Word → JSON, images, auto title / date / read time / excerpt
- Multiple tags per post, a "Browse by Topic" accordion, "More from the blog"
- Optional `Date:` override for backdated posts
- View and like counters on Cloudflare Functions + KV
- giscus comments
- Cloudflare Web Analytics
- 3 posts published (1 is a placeholder "Welcome" post)

### ✅ Share button (live)
- **Share button.** A single *Share* button in the like/views row.
  - On phones, and on desktop Safari, Edge and Chrome (Windows/macOS), it
    opens the device's **native share sheet** through the Web Share API
    (`navigator.share`). The sheet lists WhatsApp, LinkedIn, Messages, Mail,
    Copy and more. On iPhone it also has Print.
  - Where that isn't supported (for example Firefox desktop), it copies the
    link to the clipboard and shows "Link copied" for 2 s.
  - Link previews come from the generated `/posts/<slug>/` pages (section 4.2).

---

## 6. Known issues and technical debt

| # | Issue | Impact | Notes |
|---|---|---|---|
| ~~K1~~ | ✅ Fixed: each post has its own page with link-preview tags built in (section 4.2) | | |
| K2 | No Open Graph / Twitter meta tags, canonical URL, `sitemap.xml`, `robots.txt` or RSS feed | Poor discoverability and link previews | See R1, R2 |
| K3 | Tailwind **Play CDN** (`cdn.tailwindcss.com`) in production | Tailwind says the CDN isn't meant for production. It compiles CSS in the browser, which adds weight and a flash of unstyled content | See R5 |
| K4 | Counters can be inflated. Any client can `POST` repeatedly; dedupe is `localStorage` only | Numbers can be gamed | Low stakes. Add per-IP throttling if it matters (R8) |
| K5 | KV read-modify-write isn't atomic | Concurrent hits can lose increments | Fine at current traffic. Durable Objects or D1 if needed |
| K6 | On mobile, the **left sidebar ("More from the blog") renders above the article** in `post.html` | Readers on phones scroll past a post list before reaching the article | Reorder with `order-*` classes, or hide the sidebars below `lg` |
| K7 | Titles, tags and excerpts are inserted with `innerHTML` without escaping | Only an issue if untrusted people author content. Today it's just you | Keep in mind if guest posts are ever allowed |
| K8 | A date that falls back to git history depends on the build having full git history | If Cloudflare clones shallowly, posts without `Date:` could all get the latest commit date | Check against a live post, or just always add `Date:` |
| K9 | The home-page "Writing" section is a static teaser ("New posts are on the way") | Doesn't show that posts now exist | See R3 |
| K10 | GitHub link hidden with `href="#"` in two places in `index.html` | Leftover placeholder | Add the URL and remove `hidden`, or delete it |
| K11 | Head, header, glow script and styles are copy-pasted across 3 HTML files | Changes have to be made three times | See R5 |
| K12 | No custom `404.html` | Unknown URLs get Cloudflare's default page | Quick win |
| K13 | Placeholder "Welcome to my blog" post says "delete this post once you've written your real first one" | Looks unfinished to visitors | Remove or rewrite |
| K14 | No `.md` in `/blog` is linted or validated. A bad `Date:` value is silently dropped | Wrong dates with no warning | Log a build warning for an invalid `Date:` |

---

## 7. Roadmap: what to build next

Ordered by value for effort. Items marked ⭐ are recommended next.

### Phase 1: Finish and polish (short)
- ⭐ **K6.** Fix the mobile column order on `post.html`.
- **K10, K12, K13.** GitHub link, `404.html`, and the placeholder post.
- **K14.** Build warnings for invalid metadata.

### Phase 2: Discoverability (high value)
- ✅ **R1. Pre-render post pages.** Done: `/posts/<slug>/` pages with link-preview tags, cover images and a `Summary:` line.
  Still to do: fill the article HTML into those pages for SEO.
- **R2. `sitemap.xml`, `robots.txt`, `rss.xml`/`feed.json`,** generated in
  the same build step from the post index.
- **R3. "Latest posts" on the home page.** Replace the static teaser with the
  3 newest posts from `posts-index.json`.
- **R4. Home-page meta tags.** OG image or social card, and JSON-LD `Person` schema.

### Phase 3: Engineering foundations
- **R5. A real CSS build and shared layout.** Compile Tailwind with the
  Tailwind CLI in `npm run build` instead of the CDN. Pull the header,
  footer, `<head>` and glow script into shared partials. Either a tiny
  templating step in the existing build script or moving to a small static
  site generator (Astro or Eleventy) would work. This fixes K3 and K11.
- **R6. Local dev with Functions.** Add `wrangler` as a dev dependency and a
  `npm run dev` script (`wrangler pages dev .`) so counters work locally
  (see section 8).
- **R7. CI check.** A GitHub Action that runs `npm run build` on every PR or
  push, so a broken post fails fast before Cloudflare deploys.

### Phase 4: Nice to have
- **R8. Harden the counters.** Throttle per IP / slug (for example a short-TTL
  KV key per `CF-Connecting-IP`), and validate that the slug exists in the index.
- **R9. Blog UX.** Search, pagination once there are many posts, reading
  progress bar, table of contents for long posts, "previous / next post" links,
  code-block syntax highlighting.
- **R10. Tag pages.** Deep-linkable filters (`blog.html?tag=AI`), with the
  topic chips on post pages linking to them.
- **R11. Draft support.** A `Draft: true` line (or a `_drafts/` folder) that
  the build skips in production.
- **R12. Projects / case studies section** on the portfolio, backed by
  data files like the blog.
- **R13. Newsletter / subscribe.** An RSS-to-email service, or a simple email
  capture form.
- **R14. Accessibility pass.** Focus styles, `prefers-reduced-motion` to turn
  off the cursor glow and fade animations, colour-contrast check on the
  `slate-500/600` text.
- **R15. Light theme toggle** (optional, since the site is dark-only by design).

---

## 8. Local development

```bash
npm install          # installs marked + mammoth
npm run build        # regenerates /posts from /blog
```

To preview the static pages, serve the repo root with any static server:

```bash
npx serve .          # or: python -m http.server 8000
```

- `fetch()` doesn't work over `file://`, so always use a server.
- `/api/view` and `/api/like` **won't work** with a plain static server,
  but the pages handle that and just show 0. To run the Functions locally:

  ```bash
  npx wrangler pages dev . --kv BLOG_KV
  ```

---

## 9. Deployment and configuration

**Cloudflare Pages project settings**

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `/` (repo root) |
| Node version | ≥ 18 |
| Functions | auto-detected from `/functions` |
| KV binding | Variable name **`BLOG_KV`** → your KV namespace (Settings → Functions → KV namespace bindings) |

**Third-party configuration**

| Service | Where it's configured | Values |
|---|---|---|
| giscus | `post.html` → `loadGiscus()` | repo `sandeepmidde/personalwebsite`, repo-id `R_kgDOUjW7gw`, category `Announcements` / `DIC_kwDOUjW7g84DGElg`. The repo must stay **public** with Discussions enabled and the giscus app installed |
| Cloudflare Web Analytics | Beacon `<script>` at the bottom of each HTML page | token `53ef048b…` (a public token, safe to commit) |

**What's public:** everything in the repo root gets served, including
`/blog` sources, `/scripts`, and this README. `Resume/Car.pdf`,
`Resume/TargetResume.pdf` and `ref/` are gitignored and are never deployed.
Keep new private files out of the repo or add them to `.gitignore`.

---

## 10. Editing guide (quick reference)

| I want to… | Do this |
|---|---|
| Add a blog post | New folder in `/blog` with `content.md` / `.docx`, then push (§4.1) |
| Backdate a post | Add `Date: YYYY-MM-DD` near the top |
| Put a post under topics | Add `Tags: A, B` near the top |
| Remove a post | Delete its `/blog/<slug>` folder, then push |
| Update bio / hero text | `index.html` → `EDIT: HERO` |
| Add a job | `index.html` → `EDIT: EXPERIENCE TIMELINE`, copy an `<li>` |
| Add a skill | `index.html` → `#stackGrid`, add a `<span data-stack-item data-category="…" class="tag-chip">` |
| Add a certification | `index.html` → `EDIT: CREDENTIALS` |
| Swap the résumé | Replace `Resume/SandeepMidde.pdf` (same filename) |
| Change the nav | Header markup in all three HTML files (it's duplicated, see K11) |

---

## 11. Change history

| Commit | Change |
|---|---|
| `1f093aa` | Initial portfolio + data-driven blog (JSON posts, view/like Functions) |
| `dec90c1` | giscus wired to real repo and category IDs |
| `91715f7` → `788d337` | Post page redesign: related posts, topic accordion, 3-column centred layout |
| `ff44127` | Cloudflare Web Analytics beacon |
| `3ef40c2` | **Write-and-push pipeline**: `/blog` sources → build → `/posts`; multi-tag model |
| `7af0359`, `36f61cc`, `9cfaf0b` | Sample and real posts, publication dates |
| `faa1970` | Optional `Date:` override |
| `3d6a255` | CRLF-safe `Tags:` / `Date:` parsing |
| *uncommitted* | Native Share button on `post.html` (Web Share API + copy-link fallback) |
