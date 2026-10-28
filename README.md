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
- **Status (as of 2026-10-28):** live. The blog is the Tarang hub with three
  series (section 3). Homepage, blog, 8 posts, counters,
  comments, analytics, link previews, sitemap and structured data all work.

> `_redirects` sends `/README.md` to the homepage, so the site doesn't serve
> this file. The GitHub repo is public (giscus needs that), so anyone can still
> read it there. Keep secrets and private notes out of it.

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
 blog/<slug>/content.docx      (scripts/build-posts.mjs)              /<series>/<slug>/  fetches posts/<slug>.json
 blog/<slug>/cover.*, *.svg      posts/posts-index.json                 /api/view, /api/like  -->  Workers KV (BLOG_KV)
                                 posts/<slug>.json                      giscus iframe  -->  GitHub Discussions
                                 <series>/<slug>/index.html             Cloudflare Web Analytics beacon
                                 <series>/index.html (tales, slate, lab)
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
├── _redirects               # Serves themed-executive.html at /. Sends README, raw post sources,
│                            # build files and the old theme pages to / (see section 10)
├── themed-executive.html    # THE HOMEPAGE. Edit only this file for homepage changes
├── themed-*.html            # Older theme variants and themed-compare.html (noindex, unlisted)
├── index-backup.html        # Previous homepage, kept for reference (noindex)
├── blog.html                # Tarang hub, served at /blog. The build copies it to /tales/, /slate/, /lab/
├── post.html                # Template the build copies for every post
├── robots.txt               # Allows everything, points to the sitemap
├── social-card.png          # Fallback link-preview image (1200x627)
├── assets/img/              # Portrait (webp, two sizes) and homepage preview image
├── assets/tarang-series.json  # The three Tarang series: name, stamp, icon, blurbs, SEO text
├── assets/css/series-*.css  # One stylesheet per series (tales, slate, lab). Independent of each other
├── tales/ slate/ lab/       # BUILD OUTPUT, gitignored: series landing pages and post pages
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

| Slug | Title | Tags | Series |
|---|---|---|---|
| `context-window-limits` | Optimizing Context Windows | AI, Technical | Tarang Tales |
| `distributed-compute` | Distributed Computing for AI | AI, Technical | Tarang Tales |
| `fine-tuning-vs-rag` | Fine-Tuning vs RAG | AI, Technical | Tarang Tales |
| `mitigating-hallucinations` | Mitigating AI Hallucinations | AI, Technical, Governance | Tarang Tales |
| `prompt-engineering` | Prompt Engineering Explained | AI, Technical | Tarang Tales |
| `mountain-quest` | Understanding RAG Pipelines | AI, Technical, RAG | Tarang Tales |
| `ultimate-cosmic-race` | Demystifying Vector Databases | AI, Technical, RAG | Tarang Tales |
| `the-arjuna-algorithm` | Mechanics of Semantic Search | AI, Technical, RAG | Tarang Tales |
| `krishna-uvaca` | Kṛṣṇa Uvāca: Grounded Cosmic Counsel | AI, Technical, Governance, RAG, Krishna Uvaca | Lab Reports |
| `observer-prime` | Observer Prime: Unified Agentic Orchestration | AI, Technical, Governance | Lab Reports |
| `project-elara` | Project Elara: Contextual Knowledge OS | AI, Technical, Learning | Lab Reports |
| `ai-where-users-already-are` | Not Every AI Investment Needs Another Product | AI | Surabhi's Slate |
| `strategy-meets-reality` | Strategy Sets the Direction. Reality Draws the Map | AI, Project Management | Surabhi's Slate |
| `clarity-is-a-product-feature` | Clarity Is a Product Feature | AI, Krishna Uvaca | Surabhi's Slate |
| `definition-of-success` | Every Product Chooses Its Definition of Success | AI, Governance, Krishna Uvaca | Surabhi's Slate |
| `architecture-rarely-fails` | Architecture Rarely Fails. Assumptions Do | Technical, Krishna Uvaca | Surabhi's Slate |
| `architecture-of-omission` | Why I Deliberately Didn't Build Half the System | AI, Technical, Krishna Uvaca | Surabhi's Slate |
| `mvp-begins-with-saying-no` | Why Every Great MVP Begins With Saying "No" | AI, Project Management, Krishna Uvaca | Surabhi's Slate |
| `the-question-i-couldnt-answer` | The Question I Couldn't Answer | AI, Krishna Uvaca | Surabhi's Slate |

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
- **AI R&D Lab:** three project cards that link to their Lab Reports at
  `lab/<slug>/` ("Product case study"), with "All Lab Reports" below. Each
  cover shows a build status badge (Shipped, Beta or In Progress). Kṛṣṇa Uvāca and Project Elara also link to their live apps
  (`krsna.sandeepmidde.com`, `elara.sandeepmidde.com`). The cards use CSS
  subgrid (`grid-row: span 7` per card, `span 6` for the body), so labels,
  titles, descriptions, proof points and links line up across cards. If you
  add or remove a row in a card, change both spans. Cover images carry a
  `?v=` value, the first 8 characters of the file's md5. Update it when a
  cover changes.
- **Principles:** three cards. Each ends with two checkmark points that link
  to the matching milestone card and briefly highlight it.
- **Journey:** role timeline with "Key highlights" in a collapsible block.

### Tarang hub: `blog.html` (served at `/blog`, nav label "Blogs")
The blog is branded **Tarang** ("wave"): one idea, told in different shapes for
different readers. The nav link stays "Blogs" so visitors know what's behind it.
`/blogs` and `/tarang` redirect here.
- **Title canvas:** "The Tarang Project" label, "Tarang" with an animated
  wave, "An Ecosystem of Stories, Scribbles & Lab Reports" and the line "One
  roof. Three ways of looking at complex systems...".
- **Two-tier filter.** Tier 1, the format toggle: All, 🌊 Tarang Tales, 📝
  Surabhi's Slate, 🧪 Lab Reports. Choosing a channel shows an intro strip
  (blurb, audience, stamp) and changes the address to `/tales/` etc. (Back
  works). Tier 2, a quieter topic row: All Topics, AI, Project Management,
  Technical, Governance. The two combine (series AND topic), counts follow the
  chosen format, and empty pairs are disabled. Topics are the post's `Tags:`
  that appear in `TOPICS` in `blog.html`. Other tags (RAG, Learning) only show
  on the post page and drive the cross-links.
- **Dual badges on cards:** the format stamp on the left in its brand colour
  (amber Tales, neon blue Slate, green Lab) and the topics as flat grey chips
  on the right ("PM" for Project Management).

  | Series | Folder | For | Stamp |
  |---|---|---|---|
  | Tarang Tales (Mythology & Fables) | `/tales/` | Laymen, children, enthusiasts | A Fable-Framed Breakdown |
  | Surabhi's Slate (Notebook Scribbles) | `/slate/` | Busy professionals and developers | A Raw-Slate Insight |
  | Lab Reports (Product Case Studies) | `/lab/` | Engineers, founders, recruiters | A Product Lab Deep-Dive |

  Names, stamps, blurbs and SEO text live in `assets/tarang-series.json`.
- **Featured card** (All only): the newest post in its series' look, with the
  series stamp above the title.
- **Cards look different per series** (`card-<key>` classes in `blog.html`):
  Tales on cream parchment with comic-framed art and a coloured stamp, Slate
  on dark grid paper with a scratchpad preview of the note instead of a cover,
  Lab sharp-cornered with a navy top rule and a stark "Lab Report" tag.
- **Series pages** (`/tales/`, `/slate/`, `/lab/`): the build copies
  `blog.html` with that series' title, description and canonical URL, and the
  page opens on that channel. Locally, `/blog` itself doesn't resolve (it's
  the source folder), so preview `blog.html`.
- Posts without a cover get a navy title panel.

### Post page: `post.html`, copied to `/<series>/<slug>/index.html`
- **Series look:** each series has its own stylesheet, added only to that
  series' pages, so one can change without touching the others.
  - `series-tales.css`: vibrant comic cover, Baloo 2 headings, figures as comic
    panels, and blockquotes shown as a "Moral of the story" panel.
  - `series-slate.css`: notebook page with grid paper and a margin line, mono
    headings, masking-tape stamp, dark mode that follows the system setting.
  - `series-lab.css`: white-paper layout, numbered sections, navy table
    headers, formal callouts.
- **Series mark:** series name (links to its page) and signature stamp above
  the title. The back link reads the series name.
- **Same idea, other shapes:** after the article, the closest post from each
  other series, matched on topic tags (tags every post has, like "AI", don't
  count). The Lab Report link is styled as the call to action. Example: a
  RAG tale links to the RAG note in the Slate and to Kṛṣṇa Uvāca in the Lab.
- **Code blocks** get a Copy button, and Prism highlighting loads only on
  posts that have code.
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

1. Create `blog/<slug>/`. The folder name becomes the slug in the URL,
   `/<series>/<slug>/` (or `/posts/<slug>/` for a post with no series).
2. Add `content.md` (or `content.docx`). If both exist, the Markdown wins.
3. Start the file like this:

   ```markdown
   # The Post Title: With Its Hook
   Subtitle: One sentence shown under the title, on the card and in previews.
   Tags: AI, RAG
   Series: Tarang Tales
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
   | `Tags:` | no | Comma-separated. Any of `AI`, `Project Management`, `Technical`, `Governance` become the blog topic filter and card chips. Every tag drives Continue reading and the cross-links (except `AI` and `Technical`, too broad to pair on) |
   | `Series:` | no | `Tarang Tales`, `Surabhi's Slate` or `Lab Reports`. Sets the URL folder, the look, the stamp and the cross-links. Without it the post lives at `/posts/<slug>/` with the plain look |
   | `Card:` | no | An image file in the post folder (e.g. `architecture.svg`) shown on the blog card instead of the cover. Link previews still use `cover.png`. Kṛṣṇa Uvāca uses it so its Lab card shows the system architecture |
   | `Story:` | no | Tarang Tales only. The story behind the concept, e.g. `🏔️ The Mountain Quest · Hanuman`. Shown on the blog card between the concept title and the `Subtitle:` line, which for Tales is a one-line glimpse of the story. `Summary:` then says what the reader learns |
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
`Series:`, `Date:` and `Summary:` in their own paragraphs. Paste images straight into
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

4. Once every post's address is known, rewrites links between posts
   (`posts/<slug>/` in the source) to the real address, then writes
   `posts/<slug>.json` and `<series>/<slug>/index.html` (section 7).
5. Writes `posts/posts-index.json`, sorted newest first, the series pages
   `tales/`, `slate/`, `lab/`, and `sitemap.xml`.
6. Rewrites the generated block at the end of `_redirects`, so each series
   post's old `/posts/<slug>/` address redirects (301) to its new one. Commit
   `_redirects` when this block changes.

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
- **Tarang branding:** tab titles read `<title> · <Series> · Tarang by Sandeep
  Midde`, `og:site_name` is "Tarang by Sandeep Midde", and the `BlogPosting`
  JSON-LD carries `articleSection`, `isPartOf` (the Tarang blog) and keywords.
- **Posts:** the build writes `/<series>/<slug>/index.html` with the title, description,
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
- Old `post.html?slug=...` links go to `/posts/<slug>/`, which redirects to the
  post's series address.

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
- **Tarang Tales** follow [docs/tarang-tales-guide.md](docs/tarang-tales-guide.md):
  layout, narration, what to include and omit, with examples. Append new
  rules to its change log after each review.

---

## 9. Local development

```bash
npm install          # marked + mammoth
npm run build        # regenerates /posts and sitemap.xml from /blog
python -m http.server 8765
```

Then open `http://localhost:8765/themed-executive.html` (homepage),
`http://localhost:8765/blog.html`, `http://localhost:8765/tales/` or
`http://localhost:8765/tales/<slug>/`. The `_redirects` rules only run on
Cloudflare, so old `/posts/<slug>/` links 404 locally.

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

**What's public:** every tracked file in the repo is deployed, but `_redirects`
sends these to the homepage: `/README.md`, `/blog/<slug>/content.md` and
`.docx`, `/scripts/*`, `package.json`, `package-lock.json`, `.gitignore`, the
`themed-*` pages other than the homepage, and `index-backup`. Images in
`/blog/<slug>/` stay reachable because the cards use them. Add a rule there
for any new file that isn't meant to be a page. `Resume/Car.pdf`,
`Resume/TargetResume.pdf` and `ref/` are gitignored. Keep new private files
out of git.

---

## 11. Editing guide

| I want to... | Do this |
|---|---|
| Add a post | New folder in `/blog`, then build, preview, push (section 4) |
| Rename a post | Change its `#` title line. Keep the folder name so the URL stays |
| Change a post's tags | Edit its `Tags:` line |
| Move a post to another series | Edit its `Series:` line. The build moves it and redirects the old address |
| Rename a series or change its stamp | `assets/tarang-series.json` (keep `key`, it is the URL folder) |
| Restyle one series | `assets/css/series-<key>.css` only |
| Change a lab card's status badge | `themed-executive.html`, `EDIT: AI R&D LAB`: `data-status` (shipped, beta, progress) and its label |
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
