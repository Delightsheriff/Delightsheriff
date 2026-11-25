<div align="center">
  <h1>Delight Amadi Sheriff</h1>
  <p><strong>Full-stack and mobile software engineer.</strong><br />
  I turn ideas into shipped products: web, mobile, and the systems behind them.</p>
  <p>
    <a href="https://www.delightsheriff.com/"><strong>Portfolio</strong></a> &nbsp;|&nbsp;
    <a href="https://linkedin.com/in/delightsheriff"><strong>LinkedIn</strong></a> &nbsp;|&nbsp;
    <a href="https://x.com/delightsheriff"><strong>X</strong></a> &nbsp;|&nbsp;
    <a href="mailto:delightsheriff@gmail.com"><strong>delightsheriff@gmail.com</strong></a>
  </p>
</div>

---

I build reliable, user-centric products end to end, from architecture decisions to polished UI. Three-plus years in production with TypeScript, React, Next.js, React Native (Expo), Node.js and MongoDB, building REST APIs and shipping secure payment, real-time and CRM systems. Open to remote roles worldwide, and open to relocation.

## What I'm focused on

- Cross-platform mobile apps with React Native and Expo, including native SwiftUI pieces through Expo UI.
- Fast, accessible web apps with Next.js and modern design patterns.
- Backend depth: system design, payments, real-time messaging, and security built in from the start.
- Open to collaborating on open-source projects.

## Toolkit

| Area | What I use |
| --- | --- |
| Languages | TypeScript, JavaScript, Python |
| Web | React, Next.js, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod |
| Mobile | React Native, Expo (Router, UI), NativeWind, WebRTC, push notifications, iOS and Android |
| Backend | Node.js, Express, NestJS, FastAPI, REST APIs, JWT, OAuth, Socket.IO, Paystack |
| Data | MongoDB, PostgreSQL, Redis, Supabase, Drizzle ORM, SQLite, Sanity |
| Security | HMAC webhook verification, AES-256-GCM encryption, role-based access control |
| Tools | Git, GitHub, Docker, Postman, Figma, Vitest, ESLint, Agile and Scrum |

<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=delightsheriff&theme=tokyonight&hide_border=true" />
</div>

## Selected work

| Project | What it is |
| --- | --- |
| [SmartHub](https://smart-hub.academy) | Learning platform for SmartTech Global: public site, learner LMS, admin portal, referrals and Paystack payments. 700+ registered users. |
| [IFEM Education](https://www.ifemeducation.com) | Website for a UK admissions and visa consultancy in Nigeria, plus the CRM that replaced paper files and Excel for 20+ staff. |
| [Osan](https://osan-psi.vercel.app) | A portfolio concept for a portrait studio, with a morphing work index and a palette that follows the time of day. [Source](https://github.com/Delightsheriff/osan) |
| [Hangouts](https://github.com/Delightsheriff/hangouts) | A native iOS rebuild of a design concept in Expo SDK 58, with a SwiftUI filter sheet and synced maps. |

More on the [portfolio](https://www.delightsheriff.com/#projects), including case studies.

---

# About this repo

This repository is the source of my portfolio site, [www.delightsheriff.com](https://www.delightsheriff.com), and it doubles as my [GitHub profile](https://github.com/Delightsheriff).

The site is a single page: hero, projects, experience, about, contact. Every project opens its own case study. A blog is built in but stays hidden until the first post is published.

## Highlights

- **Content lives in a CMS.** Projects, work history, skills, bio and posts are edited in Sanity Studio (hosted by Sanity), with no redeploy needed.
- **One theme, designed carefully.** A dark theme, Geist type, a consistent label-gutter layout, and motion that stays light and respects reduced-motion settings.
- **Fast.** Pages are statically generated and refreshed in the background, images are served as AVIF or WebP, and the first project images load with high priority.
- **Accessible.** Skip link, keyboard-friendly menus, visible focus, and contrast checked against WCAG.
- **Built to be found.** Structured data (JSON-LD) for the person, site, projects and posts, a sitemap with images, descriptive titles, and share cards.
- **Built for AI assistants too.** A plain-text profile at [`/llms.txt`](https://www.delightsheriff.com/llms.txt) and [`/llms-full.txt`](https://www.delightsheriff.com/llms-full.txt), an [Agentic Resource Discovery](https://agenticresourcediscovery.org/spec/) manifest at `/.well-known/ard.json`, and `robots.txt` rules that welcome search and AI crawlers.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 with design tokens, shadcn/ui primitives |
| Content | Sanity (content lake, hosted Studio, Portable Text for articles) |
| Hosting | Cloudflare Workers via OpenNext (deploys from `main`), portable to any Node host, see [docs/hosting.md](docs/hosting.md) |
| Testing | Vitest and Testing Library |
| Extras | GitHub contributions, Spotify "last played", Cloudflare Web Analytics |

## Getting started

You need Node.js 20.9 or newer and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.local.example .env.local   # then fill in the values below
pnpm dev                           # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm test` | Run the test suite once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Lint the code |

### Environment variables

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | **Required.** Which Sanity project and dataset to read |
| `SANITY_REVALIDATE_SECRET` | The webhook that refreshes pages when content is published |
| `SANITY_API_WRITE_TOKEN` | Local content scripts only. Never used by the site |
| `GITHUB_TOKEN` | The contribution count in About. Any token works, no scopes needed. Hidden if unset |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | The "last played" line in Contact. Hidden if unset |
| `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` | Optional search engine verification tags |

## How content works

Sanity holds four document types: **Site Settings** (hero, status note, bio, skills), **Project**, **Work Entry** and **Blog Post**. Queries live in `src/sanity/queries.ts`.

- Pages are cached and refreshed about once a minute. When content is published, a Sanity webhook calls `/api/revalidate`, which checks the request signature and refreshes the affected pages straight away.
- A post is public once its published date arrives. Until there is one, the blog has no page, no navigation link, no sitemap entry and no line in the AI profile.

## Project structure

```text
src/
  app/
    (site)/            home page, project case studies, blog, loading and error states
    api/revalidate/    signed webhook that refreshes pages
    llms.txt/          plain-text profile for AI assistants (also llms-full.txt)
    .well-known/       ARD manifest for AI agents
    robots.ts, sitemap.ts, manifest.ts, icon.tsx, opengraph-image.tsx
  components/          UI: header, hero, project tiles, experience, blog, effects
  lib/                 pure helpers: SEO and structured data, llms.txt, formatting, GitHub, Spotify
  sanity/              client, queries, image helper, Studio schema types
```

## Design notes

- **Layout.** Every section shares one layout: a narrow label on the left and the content on the right, stacking on phones, where the labels become large bold titles.
- **Motion.** Small and deliberate: a hero entrance, hover effects on project cards, a sliding header pill and an animated mobile menu. Scroll-triggered effects were tried and removed because they hurt scrolling.
- **Pure logic is tested.** Structured data, the AI profile, the manifest, formatting and reading time are plain functions with unit tests, so changes to what search engines and AI assistants see are caught early.

## Deployment

Every push to `main` runs the tests and deploys to Cloudflare Workers through GitHub Actions. After deploying, run the home page and a case study through Google's Rich Results Test and the Schema Markup Validator.

---

<div align="center">
  <sub>Built with Next.js and Sanity. Open to remote roles worldwide.</sub>
</div>
