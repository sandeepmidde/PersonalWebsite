# Sandeep Midde, Personal Website

Portfolio and blog for Sandeep Midde. It's a static site on **Cloudflare
Pages**. Blog posts are written as Markdown or Word files and turned into
pages at build time, and two Cloudflare Pages Functions run the view and like
counters.

- **Live site:** https://sandeepmidde.com
- **Repo:** https://github.com/sandeepmidde/PersonalWebsite
- **Hosting:** Cloudflare Pages. Every push to `main` builds and deploys,
  usually within a minute.
- **Domain:** `sandeepmidde.com`, registered at Spaceship, with nameservers on
  Cloudflare. Root and `www` are attached to the Pages project, and `www`
  redirects to the root.
- **Email:** `hi@sandeepmidde.com`, forwarded to Gmail by Cloudflare Email Routing.
- **Status (as of 2026-10-06):** live. Homepage, blog, 8 posts, counters,
  comments, analytics, link previews, sitemap and structured data all work.

> This README sits in the repo root, so Cloudflare serves it publicly at
> `/README.md`. Keep secrets and private notes out of it.

---

## Contents

1. [Architecture](#1-architecture)
2. [Repository layout](#2-repository-layout)
3. [Pages](#3-pages)
4. [Writing a blog post](#4-writing-a-blog-post)
5. [The build step](#5-the-build-step)
6. [Runtime features](#6-runtime-features)
7. [SEO and link previews](#7-seo-and-link-previews)
8. [Content and style rules](#8-content-and-style-rules)
9. [Local development](#9-local-development)
10. [Deployment and configuration](#10-deployment-and-configuration)
11. [Editing guide](#11-editing-guide)
12. [Known issues](#12-known-issues)
13. [Change history](#13-change-history)

---

## 1. Architecture

```
 You write                     Cloudflare Pages build                 Browser at runtime
 ---------                     ----------------------                 ------------------
 blog/<slug>/content.md   -->  npm run build                    -->   blog.html   fetches posts/posts-index.json
 blog/<slug>/content.docx      (scripts/build-posts.mjs)              /posts/<slug>/  fetches posts/<slug>.json
 blog/<slug>/cover.*, *.svg      posts/posts-index.json                 /api/view, /api/like  -->  Workers KV (BLOG_KV)
                                 posts/<slug>.json                      giscus iframe  -->  GitHub Discussions
                                 posts/<slug>/index.html                Cloudflare Web Analytics beacon
                                 posts/images/<slug>/*
                                 sitemap.xml
 git push origin main  ------>  deploys static files + /functions
```

| Layer | Technology |
|---|---|
| Markup and styling | Hand-written HTML with inline CSS (custom properties, no framework). Fonts: Plus Jakarta Sans, Inter, JetBrains Mono (Google Fonts). Icons: Font Awesome 6 (cdnjs) |
| Interactivity | Vanilla JavaScript inline in each page. No bundler |
| Hyphenation | Hyphenopoly 6 (jsDelivr) for justified body text |
| Blog content | Markdown (`marked`) or Word `.docx` (`mammoth`), converted at build time |
| Build | Node 18 or later, `npm run build` runs `scripts/build-posts.mjs` |
| Backend | Cloudflare Pages Functions (`functions/api/*.js`) with Workers KV |
| Comments | giscus, stored as GitHub Discussions on this repo |
| Analytics | Cloudflare Web Analytics (cookie-less beacon) |

Design rule: **`/blog` is the only post content you edit.** Everything in
`/posts` and `sitemap.xml` is generated and gitignored.

---

## 2. Repository layout

```
.
├── _redirects               # Serves themed-executive.html at /, sends /index.html to /
├── themed-executive.html    # THE HOMEPAGE. Edit only this file for homepage changes
├── themed-*.html            # Older theme variants and themed-compare.html (noindex, unlisted)
├── index-backup.html        # Previous homepage, kept for reference (noindex)
├── blog.html                # Blog index, served at /blog
├── post.html                # Template the build copies for every post
├── robots.txt               # Allows everything, points to the sitemap
├── social-card.png          # Fallback link-preview image (1200x627)
├── assets/img/              # Portrait (webp, two sizes) and homepage preview image
│
├── blog/                    # SOURCE OF TRUTH for posts (hand-edited)
│   └── <slug>/content.md or content.docx, cover.png, cover.webp, diagrams (*.svg)
│
├── posts/                   # BUILD OUTPUT, gitignored, never edit
│   ├── posts-index.json     # Every post without its body, newest first
│   ├── <slug>.json          # One post with rendered HTML
│   ├── <slug>/index.html    # Shareable page with SEO and preview tags
│   └── images/<slug>/       # Images copied from the post folder
├── sitemap.xml              # BUILD OUTPUT, gitignored
│
├── scripts/build-posts.mjs  # Build step: blog/ to posts/ and sitemap.xml
├── functions/api/
│   ├── view.js              # GET/POST /api/view, per-post view counter
│   └── like.js              # GET/POST /api/like, per-post like counter
│
├── Resume/SandeepMidde.pdf  # Public resume linked from the homepage
│                            # Car.pdf, TargetResume.pdf are gitignored. Selfie.png is untracked
├── ref/                     # Design-feedback screenshots (gitignored)
└── package.json             # deps: marked, mammoth. script: build
```

### Current posts

| Slug | Title | Tags |
|---|---|---|
| `mountain-quest` | The Mountain Quest: Decoding RAG Components | AI, RAG, Stories |
| `ultimate-cosmic-race` | Ultimate Cosmic Race: Decoding Vector Databases | AI, RAG, Stories |
| `the-arjuna-algorithm` | The Archer's Target: Decoding RAG | AI, RAG, Stories |
| `krishna-uvaca` | Kṛṣṇa Uvāca: Grounded Cosmic Counsel | Projects, AI |
| `observer-prime` | Observer Prime: Unified Agentic Orchestration | Projects, AI |
| `project-elara` | Project Elara: Contextual Knowledge OS | Projects, AI, Learning |
| `agentic-ai-in-project-management` | Agentic AI Is Rewriting the PMO Playbook (Word source, not yet reviewed) | |
| `ai-agents-move-into-production` | AI Agents Move Into Production (not yet reviewed) | AI |

The slugs never change, even when a title does, so shared links keep working.

---

## 3. Pages

### Homepage: `themed-executive.html`
- There is no `index.html`. `_redirects` rewrites `/` to this file (status
  200, so the address bar stays on `/`).
- A comment block at the top lists every section, and each section starts with
  an `EDIT:` comment: NAV, HERO, ABOUT, IMPACT (Executive Milestones), AI R&D
  LAB, HOW I WORK (Principles), CAREER (Journey), TOOLKIT, CREDENTIALS,
  CONTACT, FOOTER.
- **Hero:** name, role, tagline, two paragraphs, two calls to action (an
  outlined "View featured work" button that scrolls to the milestones, and a
  "Resume" link that opens the PDF in a new tab), three stats (20+ Yrs,
  $2.5T+ AUM, 99.8% availability). The nav's Connect button is the only solid
  button on screen.
- **AI R&D Lab:** three project cards that link to their posts ("Product case
  study"). Kṛṣṇa Uvāca and Project Elara also link to their live apps
  (`krsna.sandeepmidde.com`, `elara.sandeepmidde.com`). The cards use CSS
  subgrid (`grid-row: span 7` per card, `span 6` for the body), so labels,
  titles, descriptions, proof points and links line up across cards. If you
  add or remove a row in a card, change both spans. Cover images carry a
  `?v=` value, the first 8 characters of the file's md5. Update it when a
  cover changes.
- **Principles:** three cards. Each ends with two checkmark points that link
  to the matching milestone card and briefly highlight it.
- **Journey:** role timeline with "Key highlights" in a collapsible block.

### Blog index: `blog.html` (served at `/blog`)
- Loads `posts/posts-index.json`. The newest post is the featured card, and
  the rest are cards with cover, tags, title, subtitle, date and read time.
- Tag filter pills are built from all post tags, so a new tag appears as
  soon as a post uses it.
- Posts without a cover get a navy title panel.

### Post page: `post.html`, copied to `/posts/<slug>/index.html`
- **Header:** "← Blogs" at top left, centred title and subtitle, then date and
  read time on one line.
- **Left rail (wide screens):** the "visual track". Each figure in the article
  moves to the rail, level with its section, and stays pinned while that
  section is read. Clicking a figure opens it larger. The cover sits at the
  top of the rail.
- **Right rail, in this order:** On this page (table of contents), More blogs
  (titles only), Tags, About the author (always last).
- **Under the article:** likes, views, Share button, giscus comments, then two
  "Continue reading" cards picked by shared tags.
- On phones the rails collapse and figures stay inline.

---

## 4. Writing a blog post

1. Create `blog/<slug>/`. The folder name becomes the URL, `/posts/<slug>/`.
2. Add `content.md` (or `content.docx`). If both exist, the Markdown wins.
3. Start the file like this:

   ```markdown
   # The Post Title: With Its Hook
   Subtitle: One sentence shown under the title, on the card and in previews.
   Tags: AI, RAG, Stories
   Date: 2026-10-02
   Summary: One sentence for link previews and the blog card.

   ## First Section

   Body text...

   ![What the figure shows](diagram.svg "aside")
   ```

   | Line | Required | Effect |
   |---|---|---|
   | `# Title` | yes | First heading becomes the title. It's removed from the body |
   | `Subtitle:` | no | Shown under the title. Without it, the text after the title's first comma is the subtitle |
   | `Tags:` | no | Comma-separated. Drives the filter pills and Continue reading |
   | `Date:` | no | `YYYY-MM-DD`. Without it, the date of the file's first git commit is used |
   | `Summary:` | no | Link-preview description and card text. Without it, the first ~160 characters are used |

4. **Images.** Put them in the post folder and reference them by filename.
   - SVG diagrams are drawn 400 px wide, dark background, so they read at the
     rail's 300 px width.
   - Add `"aside"` as the image title (`![alt](file.svg "aside")`) for a
     figure that should appear only in the left rail, not inline on wide
     screens.
   - Add `cover.png` (1200x627) for link previews and `cover.webp`
     (800x418) for the cards. Keep the cover's important artwork in the
     middle 80% of its width, because the blog's featured card crops the sides.
     Previews can't use SVG, because LinkedIn won't show it.
5. Run `npm run build` and preview locally (section 9), then commit and push.

For Word files, use the Heading 1 style for the title and put `Tags:`,
`Date:` and `Summary:` in their own paragraphs. Paste images straight into
the document. `Subtitle:` only works in Markdown.

---

## 5. The build step

`scripts/build-posts.mjs` runs on every Cloudflare deploy through
`npm run build`. It:

1. Deletes everything in `/posts` so removed posts disappear.
2. Fetches full git history if Cloudflare cloned shallowly, so undated posts
   keep their real first-commit date.
3. For each folder in `/blog`, converts the source to HTML, reads the meta
   lines, copies images to `posts/images/<slug>/`, adds width, height and a
   `?v=` content hash to every image, and works out:

   | Field | Source |
   |---|---|
   | `slug` | Folder name |
   | `title` | First heading, or the slug in Title Case |
   | `subtitle`, `summary`, `tags` | The meta lines |
   | `date` | `Date:` line, else first git commit of the file, else today |
   | `readTime` | Word count divided by 200, minimum 1 minute |
   | `excerpt` | First ~160 characters of plain text |
   | `cover` | `cover.webp`, else `cover.png` or `.jpg` |

4. Writes `posts/<slug>.json` and `posts/<slug>/index.html` (section 7).
5. Writes `posts/posts-index.json`, sorted newest first, and `sitemap.xml`.

It handles Windows (CRLF) line endings from Word and Notepad.

---

## 6. Runtime features

### View and like counters
- `GET /api/view?slug=...` and `GET /api/like?slug=...` return the count.
  `POST` with `{ "slug": "..." }` adds one and returns the new value.
- Stored in the Workers KV namespace bound as **`BLOG_KV`**, keys
  `view:<slug>` and `like:<slug>`.
- De-duplication is in the browser only. A view counts once per 12 hours
  (`localStorage["viewed:<slug>"]`), a like once per browser
  (`localStorage["liked:<slug>"]`).
- If the API fails, the page still works and shows no count.

### Comments
- giscus loads after the post. Repo `sandeepmidde/personalwebsite`, category
  Announcements, mapping `specific` with the slug as the term, light theme.
  Readers need a GitHub account to comment.

### Share
- The Share button opens the device's share sheet (Web Share API). Where
  that isn't supported, it copies the link and shows "Link copied".

### Analytics
- The Cloudflare Web Analytics beacon is on the homepage, blog and post
  pages. It sets no cookies.

### Justified text and hyphenation
- Body paragraphs are justified with automatic hyphenation on every page.
  Phones (640 px and narrower) are left-aligned.
- Hyphenopoly's selector must match only body text: homepage
  `p, .exp-bullets li, .cred-list li`, blog `p`, posts `p, .prose li`. Call
  `window.hyphenate(el)` after inserting text with JavaScript.

---

## 7. SEO and link previews

- **Homepage:** title, description, Open Graph and Twitter tags,
  canonical URL, and JSON-LD with `Person`, `WebSite` and `ProfilePage`.
  The `Person` entry holds the job title, "20+ years" description,
  LinkedIn and GitHub links, education and areas of expertise.
- **Blog:** canonical `/blog`, description and preview tags.
- **Posts:** the build writes `/posts/<slug>/index.html` with the title, description,
  preview image, canonical URL and `BlogPosting` JSON-LD that credits the
  homepage's `Person`. It adds `<base href="/">`, so links inside posts are
  written from the site root (`posts/the-arjuna-algorithm/`, not
  `../the-arjuna-algorithm/`).
  - Browser tab: `<full title> · Sandeep Midde`
  - Preview title: `<title> by Sandeep Midde` (posts without a `Subtitle:`
    use only the text before the first comma or colon)
  - Preview image: `cover.*`, else the first raster image, else `social-card.png`
- **`sitemap.xml`:** homepage, blog and every post, with dates. `robots.txt`
  points to it. Search Console is set up for the domain.
- Old `post.html?slug=...` links redirect to `/posts/<slug>/`.

---

## 8. Content and style rules

These come from repeated review rounds with the site owner. Follow them for
any new copy.

- **No AI-looking punctuation in visible text:** no em or en dashes, no
  " - " separators, no semicolons, no "Label:" colons in sentences, no `|`.
  Write ranges in sentences as "30 to 60%". Short stat figures use "3-5 Hr"
  and "20+ Yrs". Compound-word hyphens ("build-vs-buy") are fine. Front-matter
  lines (`Tags:`, `Date:`) are exempt.
- **Post titles** read "Name: Hook" with a `Subtitle:` line. Section headings
  don't start with "The" and have no colons.
- **Claims must match the evidence.** Proof points and summaries can't
  claim more than the milestone cards and posts support. For example, avoid
  "zero hallucination", "deterministic", "guarantee" and "dependency-free".
- **Homepage project cards** show no development tools (no Next.js, React
  and so on) and keep each proof point to one line.
- **Every figure explains itself:** icon-led SVGs with a short caps label,
  readable at 300 px.
- **Links have no underline** in card proof points.

---

## 9. Local development

```bash
npm install          # marked + mammoth
npm run build        # regenerates /posts and sitemap.xml from /blog
python -m http.server 8765
```

Then open `http://localhost:8765/themed-executive.html` (homepage),
`http://localhost:8765/blog.html` or `http://localhost:8765/posts/<slug>/`.

- `fetch()` doesn't work over `file://`, so always use a server.
- The counters return nothing on a plain static server, and the page shows
  no count. To run the Functions locally:
  `npx wrangler pages dev . --kv BLOG_KV`.

---

## 10. Deployment and configuration

**Cloudflare Pages project**

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `/` (repo root) |
| Node version | 18 or later |
| Functions | Picked up from `/functions` |
| KV binding | Variable `BLOG_KV`, set under Settings, Functions, KV namespace bindings |
| `SITE_URL` (optional) | Overrides the `https://sandeepmidde.com` default in the build script |

**Third-party services**

| Service | Where | Values |
|---|---|---|
| giscus | `post.html`, `loadGiscus()` | repo-id `R_kgDOUjW7gw`, category-id `DIC_kwDOUjW7g84DGElg`. The repo must stay public with Discussions on and the giscus app installed |
| Web Analytics | Beacon script at the end of each page | Public token `53ef048b...` |

**What's public:** every tracked file in the repo is served, including
`/blog` sources, `/scripts` and this README. `Resume/Car.pdf`,
`Resume/TargetResume.pdf` and `ref/` are gitignored. Keep new private files
out of git.

---

## 11. Editing guide

| I want to... | Do this |
|---|---|
| Add a post | New folder in `/blog`, then build, preview, push (section 4) |
| Rename a post | Change its `#` title line. Keep the folder name so the URL stays |
| Change a post's tags | Edit its `Tags:` line |
| Remove a post | Delete its `/blog/<slug>` folder, then push |
| Change hero text or stats | `themed-executive.html`, `EDIT: HERO` |
| Change a milestone card | `EDIT: IMPACT` |
| Change a project card | `EDIT: AI R&D LAB`. Keep card titles in sync with the post titles |
| Change a principle | `EDIT: HOW I WORK` |
| Add a role | `EDIT: CAREER`, copy an `<article class="exp-item">` |
| Update SEO text | The `<head>` of `themed-executive.html`: meta tags and the JSON-LD block |
| Swap the resume | Replace `Resume/SandeepMidde.pdf`, keeping the filename |

---

## 12. Known issues

| # | Issue | Notes |
|---|---|---|
| K1 | Counters can be inflated, because de-duplication is browser-only | Low stakes. Add per-IP throttling if it matters |
| K2 | KV read-modify-write isn't atomic | Concurrent hits can lose an increment. Fine at current traffic |
| K3 | Post titles, tags and excerpts are inserted with `innerHTML` | Only matters if someone else ever writes posts |
| K4 | No custom `404.html` | Unknown URLs get Cloudflare's default page |
| K5 | An invalid `Date:` is dropped silently | The post falls back to its git date with no warning |
| K6 | Header, fonts and analytics are repeated in each HTML file | A change to shared parts has to be made in each file |
| K7 | Two posts are unreviewed and partly break the style rules | `agentic-ai-in-project-management`, `ai-agents-move-into-production` |
| K8 | No RSS feed | Could be generated from `posts-index.json` in the build |

---

## 13. Change history

Highlights only. `git log` has every commit.

| Commit | Change |
|---|---|
| `1f093aa` | Initial portfolio and data-driven blog with view and like Functions |
| `3ef40c2` | Write-and-push pipeline: `/blog` sources build into `/posts` |
| `f29ced6` | SEO: structured data, generated sitemap, robots.txt, preview tags |
| `b963546` | Light Executive theme for blog and posts |
| `07dfe08` to `315f639` | Post pages: three columns, sticky rails, visual track for figures |
| `302ad7a` | Justified text with hyphenation across the site |
| `1c82bf9`, `390a99a`, `968f7a3` | The three RAG story posts (Arjuna, Cosmic Race, Mountain Quest) |
| `653ec35` | `Subtitle:` line and full post headers |
| `6003159` | AI Lab cards aligned with subgrid |
| `b707b81` to `9733e20` | Homepage wording: stats, principles, Principal AI Product Manager role |
| `90ea2d1`, `0c61cac` | Hero calls to action: View featured work and Resume |
| `00887d6` to `415bd3c` | AI Lab product framing, Elara live link, renamed project posts |
| `f226013` | Structured data: 20+ years, AI product management |
