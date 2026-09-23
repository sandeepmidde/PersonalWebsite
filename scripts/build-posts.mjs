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
//   - share image <- a cover.png/.jpg in the post folder if present (1200x627
//                     is ideal for LinkedIn), else the first PNG/JPG in the
//                     post, else the site-wide social-card.png.
//
// It also writes a real page per post at /posts/<slug>/index.html (a copy of
// post.html with that post's title, description and preview image baked into
// <head>), so LinkedIn, WhatsApp, X etc. show a proper link preview. Those
// crawlers don't run JavaScript, so post.html?slug=... alone can't do this.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import mammoth from 'mammoth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const POSTS_DIR = path.join(ROOT, 'posts');
const IMAGES_DIR = path.join(POSTS_DIR, 'images');
const POST_TEMPLATE = path.join(ROOT, 'post.html');

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
  const drop = new Set();

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const summaryMatch = lines[i].match(/^\s*summary\s*:\s*(.+)$/i);
    if (summaryMatch) {
      summary = summaryMatch[1].trim();
      drop.add(i);
      continue;
    }
    const tagsMatch = lines[i].match(/^\s*tags\s*:\s*(.+)$/i);
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
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
  return { tags, date, summary, rest };
}

// Same idea, applied to already-converted HTML (used for .docx, since mammoth
// gives us HTML directly) — looks for <p>Tags: ...</p> / <p>Date: ...</p> / <p>Summary: ...</p>.
function extractMetaLinesFromHtml(html) {
  let tags = [];
  let date = null;
  let summary = null;

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

  const dateMatch = html.match(/<p>\s*date\s*:\s*([^<]+)<\/p>/i);
  if (dateMatch) {
    const candidate = dateMatch[1].trim();
    if (ISO_DATE.test(candidate)) date = candidate;
    html = html.replace(dateMatch[0], '');
  }

  return { tags, date, summary, html };
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
    if (RASTER_IMAGE.test(src) && !/^https?:\/\//i.test(src)) return src;
  }
  return DEFAULT_SOCIAL_IMAGE;
}

// Writes /posts/<slug>/index.html: post.html with this post's metadata baked
// into <head>, plus a <base> so the template's relative links still resolve.
function writePostPage(template, post, socialImage) {
  // Link previews read "<Short title> — by Sandeep Midde" plus a one-line summary.
  // The short title is the part before a colon ("Krishna Uvaca: Building..." -> "Krishna Uvaca").
  const fullTitle = decodeEntities(post.title);
  const shortTitle = fullTitle.split(':')[0].trim();
  const title = `${shortTitle} — by ${AUTHOR}`;
  const description = post.summary || decodeEntities(post.excerpt);
  const pagePath = `posts/${post.slug}/`;
  const image = escapeAttr(absoluteUrl(socialImage));
  const tags = [
    `<title>${escapeAttr(fullTitle)} — ${AUTHOR}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${AUTHOR}" />`,
    `<meta name="author" content="${AUTHOR}" />`,
    `<meta property="article:author" content="${AUTHOR}" />`,
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
  }

  const page = template
    .replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n<base href="/" />')
    .replace(/<title[^>]*>.*?<\/title>\s*<meta name="description"[^>]*\/>/s, () => tags.join('\n'))
    .replace('</head>', () => `<script>window.POST_SLUG = ${JSON.stringify(post.slug)};</script>\n</head>`);

  const dir = path.join(POSTS_DIR, post.slug);
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
  let sourceFile;

  if (fs.existsSync(mdPath)) {
    sourceFile = mdPath;
    const raw = fs.readFileSync(mdPath, 'utf8');
    const extracted = extractMetaLines(raw);
    tags = extracted.tags;
    explicitDate = extracted.date;
    summary = extracted.summary;
    html = marked.parse(extracted.rest);
    html = processMarkdownImages(html, postDir, slug);
  } else if (fs.existsSync(docxPath)) {
    sourceFile = docxPath;
    html = await convertDocx(docxPath, slug);
    const extracted = extractMetaLinesFromHtml(html);
    tags = extracted.tags;
    explicitDate = extracted.date;
    summary = extracted.summary;
    html = extracted.html;
  } else {
    console.warn(`Skipping /blog/${postFolderName} — no content.md or content.docx found`);
    return null;
  }

  const title = extractTitleFromHtml(html, titleCaseFromSlug(slug));
  html = removeFirstH1(html);
  const date = explicitDate || gitFirstCommitDate(sourceFile);

  const post = {
    slug,
    title,
    date,
    tags,
    readTime: computeReadTime(html),
    excerpt: computeExcerpt(html),
    ...(summary ? { summary } : {}),
    body: [html],
  };

  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.json`), JSON.stringify(post, null, 2));
  writePostPage(template, post, pickSocialImage(postDir, slug, html));

  const { body, ...indexEntry } = post;
  return indexEntry;
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
  fs.mkdirSync(POSTS_DIR, { recursive: true });

  const index = [];
  const template = fs.readFileSync(POST_TEMPLATE, 'utf8');

  if (!fs.existsSync(BLOG_DIR)) {
    console.warn('No /blog directory found — nothing to build.');
  } else {
    const postFolders = fs.readdirSync(BLOG_DIR).filter(name =>
      fs.statSync(path.join(BLOG_DIR, name)).isDirectory()
    );

    for (const postFolderName of postFolders) {
      const postDir = path.join(BLOG_DIR, postFolderName);
      const entry = await buildPost(postFolderName, postDir, template);
      if (entry) index.push(entry);
    }
  }

  index.sort((a, b) => b.date.localeCompare(a.date));
  fs.writeFileSync(path.join(POSTS_DIR, 'posts-index.json'), JSON.stringify(index, null, 2));

  console.log(`Built ${index.length} post(s).`);
}

main();
