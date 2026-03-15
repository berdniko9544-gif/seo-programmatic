# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common commands

### Install

- `npm ci` (CI / clean install)
- `npm install` (local dev)

### Next.js app

- `npm run dev` — run Next.js dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run analyze` — bundle analyzer build

### Tests

- `npm test` — Jest unit tests
- `npm run test:watch` — Jest watch mode
- `npm run test:coverage` — Jest coverage
- `npm run test:e2e` — Playwright e2e
- `npm run test:e2e:ui` — Playwright UI

### Satellite automation scripts

These scripts orchestrate generation/build/deploy of many “satellite” Next.js sites under the local folder [satellites/](satellites/).

- `npm run satellite:daily` — end-to-end daily pipeline (generate → build → deploy → ping/search submission → logs)
- `npm run satellite:generate` — generate one satellite (template + data)
- `npm run satellite:batch` — batch generation
- `npm run satellite:build-all` — build all satellites in [satellites/](satellites/)
- `npm run satellite:deploy-all` — deploy all satellites to Vercel and write `satellites/urls.txt`
- `npm run satellite:submit-seo` — submit (primarily Yandex Webmaster API if configured) using `satellites/urls.txt`
- `npm run satellite:health` — health checks
- `npm run satellite:trigger-isr` — trigger ISR/revalidation flow (see API route below)
- `npm run deploy:current` — deploy current (main) project

## CI / GitHub Actions entrypoints

### Daily generation workflow

Workflow: [.github/workflows/daily-generation.yml](.github/workflows/daily-generation.yml)

- Runs on a schedule (03:00 UTC) and via manual dispatch.
- Key step runs: `node scripts/daily-generator.js`
- Tuning is via env in the workflow:
  - `DAILY_SATELLITES` (default 20)
  - `PAGES_PER_SATELLITE` (default 300 in workflow)
- Uploads artifacts:
  - `generation-logs` from [logs/](logs/)
  - `satellite-urls` from `satellites/urls.txt` (small artifact used by other workflows)
  - `satellite-registry` (debug; can be very large)

### Submit existing deployed satellites to Yandex

Workflow: [.github/workflows/submit-yandex.yml](.github/workflows/submit-yandex.yml)

- Pulls the `satellite-urls` artifact from the latest successful daily run (or an explicit `daily_run_id`).
- Runs: `node scripts/submit-to-search.js`

## High-level architecture

### 1) Next.js “main” site (App Router)

- App Router pages live under [src/app/](src/app/)
- API routes used by automation:
  - Revalidate endpoint: [src/app/api/revalidate/route.js](src/app/api/revalidate/route.js)
    - Requires query param `secret` matching env `REVALIDATE_SECRET`.

### 2) Satellite generation pipeline (scripts)

The core pipeline is implemented in Node scripts under [scripts/](scripts/).

Primary orchestrator:
- [scripts/daily-generator.js](scripts/daily-generator.js)
  - Generates N satellites with AI content
  - Builds all satellites
  - Deploys all satellites
  - Pings search engines (sitemap URLs)
  - Persists logs to `logs/daily-generation-log.json`
  - Ensures `satellites/urls.txt` exists (used by submission workflows)

Supporting scripts:
- [scripts/satellite-generator.js](scripts/satellite-generator.js) — generates one satellite project
- [scripts/build-all.js](scripts/build-all.js) — builds every folder under `satellites/`
- [scripts/deploy-all.js](scripts/deploy-all.js) — deploys each satellite via Vercel CLI and writes `satellites/urls.txt`
- [scripts/submit-to-search.js](scripts/submit-to-search.js) — submits each satellite sitemap
  - Uses Yandex Webmaster API if `YANDEX_WEBMASTER_TOKEN` and `YANDEX_USER_ID` are set.
  - IMPORTANT: `YANDEX_USER_ID` must be a numeric user id; if it’s not numeric, Yandex returns a 400 FIELD_VALIDATION_ERROR.

### 3) Content + SEO utilities

- Internal linking is implemented in [src/utils/internal-linking.js](src/utils/internal-linking.js) (contextual links + related links).
- Content generation uses DeepSeek via utilities in `src/utils/` (see references from [scripts/daily-generator.js](scripts/daily-generator.js)).

## Key runtime inputs (env/secrets)

Used locally and in GitHub Actions workflows:

- `DEEPSEEK_API_KEY` — AI content generation
- `VERCEL_TOKEN` (+ optional `VERCEL_TEAM`) — Vercel CLI deployments
- `REVALIDATE_SECRET` — required for `/api/revalidate`
- `YANDEX_WEBMASTER_TOKEN` + `YANDEX_USER_ID` — Yandex submission via API (optional)

See also: [SETUP_SECRETS.md](SETUP_SECRETS.md)
