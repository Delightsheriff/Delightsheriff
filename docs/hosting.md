# Hosting

The site is a normal Next.js app. Cloudflare Workers is where it runs today, and all Cloudflare-specific
files are listed below, so moving elsewhere means deleting those and picking another host.

## Cloudflare-only files

| File | Purpose |
| --- | --- |
| `wrangler.jsonc` | Worker name, KV caches, Durable Object |
| `open-next.config.ts` | Where cached pages are stored (Workers KV) |
| `.github/workflows/deploy-cloudflare.yml` | Deploys on every push to `main` |
| `src/components/web-analytics.tsx` | Cloudflare Web Analytics (optional) |

## Deploy by hand

```bash
pnpm cf:deploy       # build and deploy
pnpm cf:preview      # build and run locally in the Workers runtime
```

Secrets (`GITHUB_TOKEN`, `SPOTIFY_*`, `SANITY_REVALIDATE_SECRET`) live in the Worker. Set one with
`pnpm exec wrangler secret put NAME`.

## Content (Sanity)

Content is read from Sanity at request time, so Cloudflare needs only the project ID and dataset.
The Studio is no longer part of the site (it was too large for the free Worker plan). Run
`pnpm studio:deploy` once to host it on Sanity at `https://delightsheriff.sanity.studio`.
After a Studio change that adds fields, run it again.

The publish webhook in Sanity must call `https://www.delightsheriff.com/api/revalidate` with the same
secret as `SANITY_REVALIDATE_SECRET`.

## Moving to another host

- **Any Node or container host:** `docker build -t portfolio .` then run it with the env vars from
  `.env.local.example`. The Docker build uses Next's standalone output.
- **Vercel or Netlify:** connect the repo. Delete the Cloudflare files. Nothing else changes.
- Images use Sanity's own CDN (`src/lib/sanity-image-loader.ts`), so there is no image service to replace.
- Analytics go through `src/lib/analytics.ts`. Register a provider there to change vendors.
