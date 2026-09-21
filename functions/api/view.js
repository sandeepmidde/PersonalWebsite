// Cloudflare Pages Function — per-post view counter, backed by Workers KV.
// Requires a KV namespace bound to this Pages project as "BLOG_KV"
// (Pages project settings -> Functions -> KV namespace bindings).

export async function onRequestGet({ request, env }) {
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return json({ error: 'missing slug' }, 400);

  const views = Number(await env.BLOG_KV.get(`view:${slug}`)) || 0;
  return json({ views });
}

export async function onRequestPost({ request, env }) {
  const { slug } = await request.json().catch(() => ({}));
  if (!slug) return json({ error: 'missing slug' }, 400);

  const key = `view:${slug}`;
  const views = (Number(await env.BLOG_KV.get(key)) || 0) + 1;
  await env.BLOG_KV.put(key, String(views));
  return json({ views });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
