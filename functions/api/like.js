// Cloudflare Pages Function — per-post like counter, backed by Workers KV.
// Uses the same "BLOG_KV" namespace binding as view.js.
// Double-click protection is handled client-side (localStorage flag in post.html) —
// this endpoint just increments whatever it's told to, once per call.

export async function onRequestGet({ request, env }) {
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return json({ error: 'missing slug' }, 400);

  const likes = Number(await env.BLOG_KV.get(`like:${slug}`)) || 0;
  return json({ likes });
}

export async function onRequestPost({ request, env }) {
  const { slug } = await request.json().catch(() => ({}));
  if (!slug) return json({ error: 'missing slug' }, 400);

  const key = `like:${slug}`;
  const likes = (Number(await env.BLOG_KV.get(key)) || 0) + 1;
  await env.BLOG_KV.put(key, String(likes));
  return json({ likes });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
