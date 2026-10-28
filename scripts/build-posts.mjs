// Build step: turns /blog/<slug>/content.{md,docx} into the posts/*.json files
// post.html and blog.html read at runtime. Runs automatically on every
// Cloudflare Pages deploy (see package.json "build" script) — never run by
// hand unless you're testing locally with `npm run build`.
//
// What gets auto-derived vs. what you write:
//   - slug        <- the post's folder name
//   - title       <- the first heading line in your document
//   - date        <- an optional "Date: YYYY-MM-DD" line near the top, if you
//                     have a real publish date (e.g. backdating a prepared
//                     post). Omit it and it falls back to the git commit
//                     date the file first appeared — zero typing required.
//   - readTime    <- computed from word count
//   - excerpt     <- computed from the first ~160 characters
//   - tags        <- an optional "Tags: AI, Project Management" line near
//                     the top. Omit it if you don't want the post grouped.
//   - card        <- an optional "Card: architecture.svg" line naming an image in
//                     the post folder to show on the blog card instead of the
//                     cover (link previews still use cover.png).
//   - series      <- an optional "Series: Tarang Tales" line naming the Tarang
//                     series (Tarang Tales, Surabhi's Slate or Lab Reports, see
//                     assets/tarang-series.json). It decides the post's address
//                     (/tales/<slug>/, /slate/<slug>/, /lab/<slug>/), its stamp and
//                     its stylesheet (assets/css/series-<key>.css).
//   - share image <- a cover.png/.jpg in the post folder if present (1200x627
//                     is ideal for LinkedIn), else the first PNG/JPG in the
//                     post, else the site-wide social-card.png.
//
// It also writes a real page per post at /<series>/<slug>/index.html, or
// /posts/<slug>/index.html for a post with no series (a copy of post.html with
// that post's title, description and preview image baked into <head>), so
// LinkedIn, WhatsApp, X etc. show a proper link preview. Those crawlers don't
// run JavaScript, so post.html?slug=... alone can't do this.
//
// Each series also gets a landing page at /<series>/ (a copy of blog.html), and
// the old /posts/<slug>/ address of every series post redirects to the new one
// through a generated block in _redirects.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import mammoth from 'mammoth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const POSTS_DIR = path.join(ROOT, 'posts');
const IMAGES_DIR = path.join(POSTS_DIR, 'images');
const POST_TEMPLATE = path.join(ROOT, 'post.html');
const HUB_TEMPLATE = path.join(ROOT, 'blog.html');
const REDIRECTS_FILE = path.join(ROOT, '_redirects');

// The Tarang series. Each key is also a top-level folder the build owns
// (/tales, /slate, /lab), so it is wiped and regenerated on every build.
const SERIES = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'tarang-series.json'), 'utf8'));
const RESERVED_DIRS = new Set(['blog', 'posts', 'assets', 'scripts', 'functions', 'resume', 'ref', 'node_modules']);
for (const s of SERIES) {
  if (!/^[a-z0-9-]+$/.test(s.key) || RESERVED_DIRS.has(s.key)) throw new Error(`Bad series key "${s.key}" in assets/tarang-series.json`);
}
const BRAND = 'Tarang';

// "Tarang Tales", "tales" or "TARANG TALES" -> the series entry
function findSeries(value) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  const found = SERIES.find(s => s.key === v || s.name.toLowerCase() === v);
  if (!found) console.warn(`Unknown series "${value}". Use one of: ${SERIES.map(s => s.name).join(', ')}`);
  return found || null;
}
const seriesOf = post => SERIES.find(s => s.key === post.series) || null;

// The site's public address, used for canonical links and absolute preview-image
// URLs in the generated post pages. A SITE_URL environment variable (e.g. in
// Cloudflare Pages settings) overrides it.
const SITE_URL = (process.env.SITE_URL || 'https://sandeepmidde.com').replace(/\/+$/, '');
const ASSET_BASE = SITE_URL;
const DEFAULT_SOCIAL_IMAGE = 'social-card.png';
const AUTHOR = 'Sandeep Midde';
const RASTER_IMAGE = /\.(png|jpe?g|webp|gif)$/i;

function slugify(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function titleCaseFromSlug(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function computeExcerpt(html, maxLen = 160) {
  const text = stripHtml(html);
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

function computeReadTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

// Cloudflare Pages builds from a shallow clone, where every file's history is
// just the latest commit, so undated posts would all get today's date. Fetch
// the full history once before reading any dates. Harmless locally.
function ensureFullGitHistory() {
  try {
    const shallow = execSync('git rev-parse --is-shallow-repository', { cwd: ROOT, encoding: 'utf8' }).trim();
    if (shallow === 'true') {
      execSync('git fetch --unshallow --quiet', { cwd: ROOT, stdio: 'ignore' });
      console.log('Fetched full git history for post dates.');
    }
  } catch (e) {
    console.warn('Could not fetch full git history; undated posts may show the build date.');
  }
}

function gitFirstCommitDate(absPath) {
  try {
    const relPath = path.relative(ROOT, absPath).split(path.sep).join('/');
    const out = execSync(`git log --follow --format=%ad --date=format:%Y-%m-%d -- "${relPath}"`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    const lines = out.split('\n').filter(Boolean);
    if (lines.length > 0) return lines[lines.length - 1];
  } catch (e) { /* not committed yet, or git unavailable at build time */ }
  return new Date().toISOString().slice(0, 10);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Pulls optional "Tags: A, B, C" and "Date: YYYY-MM-DD" lines out of the raw source
// text (before HTML conversion), wherever they appear in the first few lines.
// Either can be omitted — tags default to none, date falls back to the file's
// git commit history (see gitFirstCommitDate).
function extractMetaLines(rawText) {
  // Split on any line-ending style (CRLF from Windows/Word/GitHub's web editor,
  // or bare LF) — otherwise a trailing \r survives into each line and breaks
  // the $ anchors below, since "." never matches \r.
  const lines = rawText.split(/\r\n|\r|\n/);
  let tags = [];
  let date = null;
  let summary = null;
  let subtitle = null;
  let series = null;
  let card = null;
  const drop = new Set();

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const summaryMatch = lines[i].match(/^\s*summary\s*:\s*(.+)$/i);
    if (summaryMatch) {
      summary = summaryMatch[1].trim();
      drop.add(i);
      continue;
    }
    // Optional "Subtitle: ..." shown under the title. Without it, the title's text
    // after the first comma is used as the subtitle.
    const subtitleMatch = lines[i].match(/^\s*subtitle\s*:\s*(.+)$/i);
    if (subtitleMatch) {
      subtitle = subtitleMatch[1].trim();
      drop.add(i);
      continue;
    }
    const tagsMatch = lines[i].match(/^\s*tags\s*:\s*(.+)$/i);
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
      drop.add(i);
      continue;
    }
    // Optional "Card: file.svg", the blog card image when it should differ from the cover
    const cardMatch = lines[i].match(/^\s*card\s*:\s*(.+)$/i);
    if (cardMatch) {
      card = cardMatch[1].trim();
      drop.add(i);
      continue;
    }
    // Optional "Series: Tarang Tales" placing the post in a Tarang series
    const seriesMatch = lines[i].match(/^\s*series\s*:\s*(.+)$/i);
    if (seriesMatch) {
      series = seriesMatch[1].trim();
      drop.add(i);
      continue;
    }
    const dateMatch = lines[i].match(/^\s*date\s*:\s*(.+)$/i);
    if (dateMatch) {
      const candidate = dateMatch[1].trim();
      if (ISO_DATE.test(candidate)) date = candidate;
      drop.add(i);
    }
  }

  const rest = lines.filter((_, i) => !drop.has(i)).join('\n');
  return { tags, date, summary, subtitle, series, card, rest };
}

// Same idea, applied to already-converted HTML (used for .docx, since mammoth
// gives us HTML directly) — looks for <p>Tags: ...</p> / <p>Date: ...</p> / <p>Summary: ...</p>.
function extractMetaLinesFromHtml(html) {
  let tags = [];
  let date = null;
  let summary = null;
  let series = null;

  const summaryMatch = html.match(/<p>\s*summary\s*:\s*([^<]+)<\/p>/i);
  if (summaryMatch) {
    summary = decodeEntities(summaryMatch[1].trim());
    html = html.replace(summaryMatch[0], '');
  }

  const tagsMatch = html.match(/<p>\s*tags\s*:\s*([^<]+)<\/p>/i);
  if (tagsMatch) {
    tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
    html = html.replace(tagsMatch[0], '');
  }

  const seriesMatch = html.match(/<p>\s*series\s*:\s*([^<]+)<\/p>/i);
  if (seriesMatch) {
    series = decodeEntities(seriesMatch[1].trim());
    html = html.replace(seriesMatch[0], '');
  }

  const dateMatch = html.match(/<p>\s*date\s*:\s*([^<]+)<\/p>/i);
  if (dateMatch) {
    const candidate = dateMatch[1].trim();
    if (ISO_DATE.test(candidate)) date = candidate;
    html = html.replace(dateMatch[0], '');
  }

  return { tags, date, summary, series, html };
}

function extractTitleFromHtml(html, fallback) {
  const match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  return match ? stripHtml(match[1]) : fallback;
}

function removeFirstH1(html) {
  return html.replace(/<h1[^>]*>.*?<\/h1>/is, '');
}

function copyStaticImage(srcAbsPath, slug, filename) {
  const destDir = path.join(IMAGES_DIR, slug);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcAbsPath, path.join(destDir, filename));
  return `posts/images/${slug}/${filename}`;
}

function processMarkdownImages(html, postDir, slug) {
  return html.replace(/<img([^>]*)\ssrc="([^"]+)"([^>]*)>/gi, (full, before, src, after) => {
    if (/^https?:\/\//i.test(src)) return full; // leave remote images alone
    const srcAbsPath = path.join(postDir, decodeURIComponent(src));
    if (!fs.existsSync(srcAbsPath)) return full;
    const newSrc = copyStaticImage(srcAbsPath, slug, path.basename(srcAbsPath));
    return `<img${before} src="${newSrc}"${after}>`;
  });
}

// Intrinsic size of a local image, so the page can reserve its space before it
// downloads (no layout jump on slow connections). Handles SVG and PNG.
function imageSize(absPath) {
  try {
    if (/\.svg$/i.test(absPath)) {
      const head = fs.readFileSync(absPath, 'utf8').slice(0, 600);
      const vb = head.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
      if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
    } else if (/\.png$/i.test(absPath)) {
      const buf = fs.readFileSync(absPath);
      if (buf.toString('ascii', 12, 16) === 'IHDR') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
  } catch {}
  return null;
}

// Short content fingerprint for a site file, appended as ?v= so browsers fetch an
// image again as soon as it changes (images are cached for hours otherwise).
function fingerprint(sitePath) {
  try {
    return createHash('md5').update(fs.readFileSync(path.join(ROOT, sitePath))).digest('hex').slice(0, 8);
  } catch { return null; }
}
function versioned(sitePath) {
  const v = fingerprint(decodeURIComponent(sitePath));
  return v ? `${sitePath}?v=${v}` : sitePath;
}

// Adds width/height, lazy loading and a cache-busting version to every local image in the post body.
function addImageHints(html) {
  return html.replace(/<img([^>]*)>/gi, (full, attrs) => {
    const src = attrs.match(/\ssrc="([^"]+)"/);
    if (!src || /^https?:\/\//i.test(src[1])) return full;
    let extra = '';
    if (!/\swidth=/.test(attrs)) {
      const size = imageSize(path.join(ROOT, decodeURIComponent(src[1])));
      if (size) extra += ` width="${size.width}" height="${size.height}"`;
    }
    if (!/\sloading=/.test(attrs)) extra += ' loading="lazy" decoding="async"';
    const withVersion = attrs.replace(/\ssrc="([^"?]+)"/, (m, src) => ` src="${versioned(src)}"`);
    return `<img${withVersion.replace(/\s*\/$/, '')}${extra}>`;
  });
}

// Lightest cover in the post folder: cover.webp if present, else cover.png/jpg.
function findCover(postDir, postFolderName) {
  const files = fs.readdirSync(postDir);
  const file = ['webp', 'png', 'jpg', 'jpeg'].map(ext => `cover.${ext}`).find(f => files.includes(f));
  return file ? versioned(`blog/${encodeURIComponent(postFolderName)}/${file}`) : null;
}

async function convertDocx(absPath, slug) {
  let imgCounter = 0;
  const result = await mammoth.convertToHtml(
    { path: absPath },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        imgCounter += 1;
        const ext = (image.contentType.split('/')[1] || 'png').replace('jpeg', 'jpg');
        const filename = `img-${imgCounter}.${ext}`;
        const buffer = await image.read();
        const destDir = path.join(IMAGES_DIR, slug);
        fs.mkdirSync(destDir, { recursive: true });
        fs.writeFileSync(path.join(destDir, filename), buffer);
        return { src: `posts/images/${slug}/${filename}` };
      }),
    }
  );
  return result.value;
}

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function absoluteUrl(sitePath) {
  return ASSET_BASE ? `${ASSET_BASE}/${sitePath}` : `/${sitePath}`;
}

// Picks the link-preview image: cover.* in the post folder, else the first
// raster image in the post body (LinkedIn can't show SVG), else the site default.
function pickSocialImage(postDir, slug, html) {
  const cover = fs.readdirSync(postDir).find(f => /^cover\.(png|jpe?g|webp)$/i.test(f));
  if (cover) return copyStaticImage(path.join(postDir, cover), slug, cover);

  for (const [, src] of html.matchAll(/<img[^>]*\ssrc="([^"]+)"/gi)) {
    const file = src.split('?')[0];   // ignore the ?v= cache-busting version
    if (RASTER_IMAGE.test(file) && !/^https?:\/\//i.test(file)) return file;
  }
  return DEFAULT_SOCIAL_IMAGE;
}

// Writes <post.url>index.html: post.html with this post's metadata baked into
// <head>, a <base> so the template's relative links still resolve, and the
// series stylesheet plus a body class (series-tales etc.) for the series look.
function writePostPage(template, post, socialImage) {
  // Link previews read "<Short title> by Sandeep Midde" plus a one-line summary.
  // The short title is the part before the first comma, "|" or colon
  // ("Krishna Uvaca, Ancient Wisdom..." -> "Krishna Uvaca").
  const fullTitle = decodeEntities(post.title);
  // A post with its own "Subtitle:" line already has its title as the full header.
  const shortTitle = post.subtitle ? fullTitle : fullTitle.split(/[|:]|, /)[0].trim();
  const title = `${shortTitle} by ${AUTHOR}`;
  const description = post.summary || decodeEntities(post.excerpt);
  const pagePath = post.url;
  const series = seriesOf(post);
  const image = escapeAttr(absoluteUrl(socialImage));
  const tags = [
    `<title>${escapeAttr(fullTitle)} · ${series ? `${escapeAttr(series.name)} · ` : ''}${BRAND} by ${AUTHOR}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${BRAND} by ${AUTHOR}" />`,
    `<meta name="author" content="${AUTHOR}" />`,
    `<meta property="article:author" content="${AUTHOR}" />`,
    ...(series ? [`<meta property="article:section" content="${escapeAttr(series.name)}" />`] : []),
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="article:published_time" content="${post.date}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  if (SITE_URL) {
    tags.push(`<meta property="og:url" content="${SITE_URL}/${pagePath}" />`);
    tags.push(`<link rel="canonical" href="${SITE_URL}/${pagePath}" />`);
    // Structured data so search engines credit the article to the homepage's Person.
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: fullTitle,
      description,
      datePublished: post.date,
      image: absoluteUrl(socialImage),
      url: `${SITE_URL}/${pagePath}`,
      mainEntityOfPage: `${SITE_URL}/${pagePath}`,
      author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: AUTHOR, url: `${SITE_URL}/` },
      ...(series ? { articleSection: series.name } : {}),
      isPartOf: { '@type': 'Blog', name: BRAND, url: `${SITE_URL}/blog` },
      keywords: [BRAND, ...(series ? [series.name] : []), ...post.tags].join(', '),
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }

  const page = template
    .replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n<base href="/" />')
    .replace(/<title[^>]*>.*?<\/title>\s*<meta name="description"[^>]*\/>/s, () => tags.join('\n'))
    .replace('</head>', () =>
      (series ? `<link rel="stylesheet" href="assets/css/series-${series.key}.css" />\n` : '') +
      `<script>window.POST_SLUG = ${JSON.stringify(post.slug)};</script>\n</head>`)
    .replace('<body>', series ? `<body class="series-${series.key}">` : '<body>');

  const dir = path.join(ROOT, post.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
}

async function buildPost(postFolderName, postDir, template) {
  const slug = slugify(postFolderName);
  const mdPath = path.join(postDir, 'content.md');
  const docxPath = path.join(postDir, 'content.docx');

  let html;
  let tags;
  let explicitDate;
  let summary;
  let subtitle;
  let seriesName;
  let cardFile;
  let sourceFile;

  if (fs.existsSync(mdPath)) {
    sourceFile = mdPath;
    const raw = fs.readFileSync(mdPath, 'utf8');
    const extracted = extractMetaLines(raw);
    tags = extracted.tags;
    explicitDate = extracted.date;
    summary = extracted.summary;
    subtitle = extracted.subtitle;
    seriesName = extracted.series;
    cardFile = extracted.card;
    html = marked.parse(extracted.rest);
    html = processMarkdownImages(html, postDir, slug);
  } else if (fs.existsSync(docxPath)) {
    sourceFile = docxPath;
    html = await convertDocx(docxPath, slug);
    const extracted = extractMetaLinesFromHtml(html);
    tags = extracted.tags;
    explicitDate = extracted.date;
    summary = extracted.summary;
    seriesName = extracted.series;
    html = extracted.html;
  } else {
    console.warn(`Skipping /blog/${postFolderName} — no content.md or content.docx found`);
    return null;
  }

  html = addImageHints(html);
  const cover = findCover(postDir, postFolderName);
  let card = null;
  if (cardFile) {
    if (fs.existsSync(path.join(postDir, cardFile))) card = versioned(`blog/${encodeURIComponent(postFolderName)}/${encodeURIComponent(cardFile)}`);
    else console.warn(`/blog/${postFolderName}: Card image "${cardFile}" not found, using the cover`);
  }
  const title = extractTitleFromHtml(html, titleCaseFromSlug(slug));
  html = removeFirstH1(html);
  const date = explicitDate || gitFirstCommitDate(sourceFile);
  const series = findSeries(seriesName);

  const post = {
    slug,
    url: series ? `${series.key}/${slug}/` : `posts/${slug}/`,
    title,
    date,
    tags,
    ...(series ? { series: series.key } : {}),
    readTime: computeReadTime(html),
    excerpt: computeExcerpt(html),
    ...(summary ? { summary } : {}),
    ...(subtitle ? { subtitle } : {}),
    ...(cover ? { cover } : {}),
    ...(card ? { card } : {}),
    body: [html],
  };
  return { post, socialImage: pickSocialImage(postDir, slug, html) };
}

// Posts link to each other as posts/<slug>/ in their source. Point those links
// at the post's real address, so readers skip the redirect.
function rewritePostLinks(html, urlBySlug) {
  return html.replace(/href="\/?posts\/([a-z0-9-]+)\/?(#[^"]*)?"/g, (m, slug, hash = '') =>
    urlBySlug.has(slug) ? `href="${urlBySlug.get(slug)}${hash}"` : m);
}

// Writes /<series>/index.html for each series: blog.html with that series'
// title, description and canonical address, opened on that series.
function writeSeriesHubs(hubTemplate) {
  for (const series of SERIES) {
    const pagePath = `${series.key}/`;
    const title = `${series.seoTitle} · ${BRAND} by ${AUTHOR}`;
    const page = hubTemplate
      .replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n  <base href="/">')
      .replace(/<title>.*?<\/title>/s, () => `<title>${escapeAttr(title)}</title>`)
      .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*(")/g, (m, a, b) => a + escapeAttr(series.seoDescription) + b)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, (m, a, b) => a + escapeAttr(title) + b)
      .replace(/(<link rel="canonical" href=")[^"]*(")/, (m, a, b) => `${a}${SITE_URL}/${pagePath}${b}`)
      .replace(/(<meta property="og:url" content=")[^"]*(")/, (m, a, b) => `${a}${SITE_URL}/${pagePath}${b}`)
      .replace('</head>', () => `<script>window.TARANG_SERIES_KEY = ${JSON.stringify(series.key)};</script>\n</head>`);
    const dir = path.join(ROOT, series.key);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page);
  }
}

// Rewrites the generated block at the end of _redirects: the old /posts/<slug>/
// address of every series post sends readers (and search engines) to the new one.
function writePostRedirects(index) {
  const BEGIN = '# BEGIN generated by scripts/build-posts.mjs: old post addresses';
  const END = '# END generated';
  const rules = index.filter(p => p.series).flatMap(p => [
    `/posts/${p.slug}/  /${p.url}  301`,
    `/posts/${p.slug}  /${p.url}  301`,
  ]);
  const block = [BEGIN, ...rules, END].join('\n');
  // Compare with LF endings, so a Windows checkout (CRLF) isn't rewritten for nothing
  const current = fs.existsSync(REDIRECTS_FILE) ? fs.readFileSync(REDIRECTS_FILE, 'utf8').replace(/\r\n/g, '\n') : '';
  const start = current.indexOf(BEGIN);
  const stop = start === -1 ? -1 : current.indexOf(END, start);
  const next = stop === -1
    ? `${current.trimEnd()}\n\n${block}\n`
    : current.slice(0, start) + block + current.slice(stop + END.length);
  if (next !== current) fs.writeFileSync(REDIRECTS_FILE, next);
}

// Writes /sitemap.xml (homepage, blog listing, every post) so search engines
// find new posts without waiting to crawl the blog page.
function writeSitemap(index) {
  const newest = index[0]?.date;
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/blog`, lastmod: newest, priority: '0.8' },
    ...SERIES.map(s => ({ loc: `${SITE_URL}/${s.key}/`, lastmod: index.find(p => p.series === s.key)?.date, priority: '0.7' })),
    ...index.map(p => ({ loc: `${SITE_URL}/${p.url}`, lastmod: p.date, priority: '0.6' })),
  ];
  const body = urls.map(u =>
    `  <url>\n    <loc>${u.loc}</loc>\n` +
    (u.lastmod ? `    <lastmod>${u.lastmod.slice(0, 10)}</lastmod>\n` : '') +
    `    <priority>${u.priority}</priority>\n  </url>`
  ).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.writeFileSync(path.join(POSTS_DIR, '..', 'sitemap.xml'), xml);
}

async function main() {
  // Everything under /posts is build output: JSON files, images/, and one
  // folder per generated post page. Clear it all so deleted posts disappear.
  if (fs.existsSync(POSTS_DIR)) {
    for (const entry of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
      const entryPath = path.join(POSTS_DIR, entry.name);
      if (entry.isDirectory()) fs.rmSync(entryPath, { recursive: true, force: true });
      else if (entry.name.endsWith('.json')) fs.unlinkSync(entryPath);
    }
  }
  // The series folders (/tales, /slate, /lab) are build output too
  for (const s of SERIES) {
    const dir = path.join(ROOT, s.key);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  ensureFullGitHistory();

  const built = [];
  const template = fs.readFileSync(POST_TEMPLATE, 'utf8');

  if (!fs.existsSync(BLOG_DIR)) {
    console.warn('No /blog directory found — nothing to build.');
  } else {
    const postFolders = fs.readdirSync(BLOG_DIR).filter(name =>
      fs.statSync(path.join(BLOG_DIR, name)).isDirectory()
    );

    for (const postFolderName of postFolders) {
      const postDir = path.join(BLOG_DIR, postFolderName);
      const result = await buildPost(postFolderName, postDir, template);
      if (result) built.push(result);
    }
  }

  // Second pass, once every post's address is known
  const urlBySlug = new Map(built.map(({ post }) => [post.slug, post.url]));
  const index = [];
  for (const { post, socialImage } of built) {
    post.body = post.body.map(html => rewritePostLinks(html, urlBySlug));
    fs.writeFileSync(path.join(POSTS_DIR, `${post.slug}.json`), JSON.stringify(post, null, 2));
    writePostPage(template, post, socialImage);
    const { body, ...indexEntry } = post;
    index.push(indexEntry);
  }

  index.sort((a, b) => b.date.localeCompare(a.date));
  fs.writeFileSync(path.join(POSTS_DIR, 'posts-index.json'), JSON.stringify(index, null, 2));
  writeSeriesHubs(fs.readFileSync(HUB_TEMPLATE, 'utf8'));
  writePostRedirects(index);
  writeSitemap(index);

  console.log(`Built ${index.length} post(s).`);
}

main();
