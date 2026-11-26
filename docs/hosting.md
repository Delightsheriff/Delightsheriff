# Hosting

The site is a normal Next.js app. Cloudflare Workers is where it runs today, and all Cloudflare-specific
files are listed below, so moving elsewhere means deleting those and picking another host.

## Cloudflare-only files

| File | Purpose |
| --- | --- |
| `wrangler.jsonc` | Worker name, domain and static assets |
| `cloudflare-worker.mjs` | Serves the Studio page for addresses under `/studio` |
| `open-next.config.ts` | Serves the prebuilt pages from static assets |
| `.github/workflows/deploy-cloudflare.yml` | Deploys on pushes to `main`, Sanity publishes and daily |
| `src/components/web-analytics.tsx` | Cloudflare Web Analytics (optional) |

## Deploy by hand

```bash
pnpm cf:deploy       # build and deploy
pnpm cf:preview      # build and run locally in the Workers runtime
```

`SPOTIFY_*` secrets live in the Worker, because the browser asks for that line while the site is
running. Set one with `pnpm exec wrangler secret put NAME`. `GITHUB_TOKEN` is only needed by the
build.

## Content (Sanity)

The site is static: every page is built at deploy time, with no KV and no timed refresh. Content
changes appear after the next deploy. A build therefore needs the Sanity project ID and dataset.

The Studio is at `https://www.delightsheriff.com/studio`. `pnpm build` writes it into
`public/studio` as static files (`pnpm studio:build`), so it does not add to the Worker's size
limit. A Studio or schema change goes live with the next deploy.

Sign-in only works from addresses allowed in Sanity (manage → API → CORS origins, with
credentials), so `https://www.delightsheriff.com` must be listed there.

### Deploy on publish

1. In GitHub, create a fine-grained personal access token limited to this repository, with
   **Contents: Read and write**. That is what the repository dispatch API requires. The token can
   change the repository's code, so keep it only in the Sanity webhook and give it an expiry date.
2. In Sanity (manage → API → Webhooks), edit the publish webhook:

| Field | Value |
| --- | --- |
| URL | `https://api.github.com/repos/Delightsheriff/Delightsheriff/dispatches` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["siteSettings", "project", "workEntry", "post"]` |
| Projection | `{"event_type": "sanity-publish"}` |
| HTTP method | `POST` |
| HTTP headers | `Authorization: Bearer <token>` and `Accept: application/vnd.github+json` |
| Drafts | Off |
| Secret | Leave empty |

If an old webhook calls `/api/revalidate`, remove it. That endpoint no longer exists. Until the new
webhook is set up, publish by running the **Deploy to Cloudflare** workflow by hand.

GitHub turns off scheduled workflows in a public repository after 60 days without activity. If that
happens, enable the workflow again on the Actions tab.

## Moving to another host

- **Any Node or container host:** `docker build -t portfolio .` then run it with the env vars from
  `.env.local.example`. The Docker build uses Next's standalone output.
- **Vercel or Netlify:** connect the repo. Delete the Cloudflare files. Nothing else changes.
- Images use Sanity's own CDN (`src/lib/sanity-image-loader.ts`), so there is no image service to replace.
- Analytics go through `src/lib/analytics.ts`. Register a provider there to change vendors.
