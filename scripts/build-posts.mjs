// Build step: turns /blog/<slug>/content.{md,docx} into the posts/*.json files
// post.html and blog.html read at runtime. Runs automatically on every
// Cloudflare Pages deploy (see package.json "build" script) — never run by
// hand unless you're testing locally with `npm run build`.
//
// What gets auto-derived vs. what you write:
//   - slug        <- the post's folder name
//   - title       <- the first heading line in your document
//   - date        <- the git commit date the file first appeared
//   - readTime    <- computed from word count
//   - excerpt     <- computed from the first ~160 characters
//   - tags        <- ONE optional line near the top of your document:
//                     "Tags: AI, Project Management"
//                     Omit it entirely if you don't want the post grouped.

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

// Pulls a "Tags: A, B, C" line out of the raw source text (before HTML conversion),
// wherever it appears in the first few lines, and returns { tags, rest }.
function extractTagsLine(rawText) {
  const lines = rawText.split('\n');
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const match = lines[i].match(/^\s*tags\s*:\s*(.+)$/i);
    if (match) {
      const tags = match[1].split(',').map(t => t.trim()).filter(Boolean);
      lines.splice(i, 1);
      return { tags, rest: lines.join('\n') };
    }
  }
  return { tags: [], rest: rawText };
}

// Same idea, but applied to already-converted HTML (used for .docx, since mammoth
// gives us HTML directly) — looks for a <p>Tags: ...</p> in the first couple of paragraphs.
function extractTagsLineFromHtml(html) {
  const match = html.match(/<p>\s*tags\s*:\s*([^<]+)<\/p>/i);
  if (!match) return { tags: [], html };
  const tags = match[1].split(',').map(t => t.trim()).filter(Boolean);
  return { tags, html: html.replace(match[0], '') };
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

async function buildPost(postFolderName, postDir) {
  const slug = slugify(postFolderName);
  const mdPath = path.join(postDir, 'content.md');
  const docxPath = path.join(postDir, 'content.docx');

  let html;
  let tags;
  let sourceFile;

  if (fs.existsSync(mdPath)) {
    sourceFile = mdPath;
    const raw = fs.readFileSync(mdPath, 'utf8');
    const extracted = extractTagsLine(raw);
    tags = extracted.tags;
    html = marked.parse(extracted.rest);
    html = processMarkdownImages(html, postDir, slug);
  } else if (fs.existsSync(docxPath)) {
    sourceFile = docxPath;
    html = await convertDocx(docxPath, slug);
    const extracted = extractTagsLineFromHtml(html);
    tags = extracted.tags;
    html = extracted.html;
  } else {
    console.warn(`Skipping /blog/${postFolderName} — no content.md or content.docx found`);
    return null;
  }

  const title = extractTitleFromHtml(html, titleCaseFromSlug(slug));
  html = removeFirstH1(html);
  const date = gitFirstCommitDate(sourceFile);

  const post = {
    slug,
    title,
    date,
    tags,
    readTime: computeReadTime(html),
    excerpt: computeExcerpt(html),
    body: [html],
  };

  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.json`), JSON.stringify(post, null, 2));

  const { body, ...indexEntry } = post;
  return indexEntry;
}

async function main() {
  if (fs.existsSync(POSTS_DIR)) {
    for (const entry of fs.readdirSync(POSTS_DIR)) {
      if (entry.endsWith('.json')) fs.unlinkSync(path.join(POSTS_DIR, entry));
    }
  }
  fs.rmSync(IMAGES_DIR, { recursive: true, force: true });
  fs.mkdirSync(POSTS_DIR, { recursive: true });

  const index = [];

  if (!fs.existsSync(BLOG_DIR)) {
    console.warn('No /blog directory found — nothing to build.');
  } else {
    const postFolders = fs.readdirSync(BLOG_DIR).filter(name =>
      fs.statSync(path.join(BLOG_DIR, name)).isDirectory()
    );

    for (const postFolderName of postFolders) {
      const postDir = path.join(BLOG_DIR, postFolderName);
      const entry = await buildPost(postFolderName, postDir);
      if (entry) index.push(entry);
    }
  }

  index.sort((a, b) => b.date.localeCompare(a.date));
  fs.writeFileSync(path.join(POSTS_DIR, 'posts-index.json'), JSON.stringify(index, null, 2));

  console.log(`Built ${index.length} post(s).`);
}

main();
