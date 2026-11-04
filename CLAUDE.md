# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal bilingual (EN/PT-BR) portfolio for Amanda Fonseca: a single-page React 19 + TypeScript + Vite app styled with Tailwind v4 and animated with Framer Motion. Published at https://amandaafonsecaa.github.io/Portfolio/.

## Commands

```bash
npm install
npm run dev      # Vite dev server (runs inside the Cloudflare Workers runtime via @cloudflare/vite-plugin)
npm run build    # clean dist → tsc -b → vite build → renames dist/portifolio to dist/server
npm run lint     # ESLint (flat config, TS + react-hooks + react-refresh)
npm run preview
```

There is no test suite. Validate changes with `tsc -b`, `npm run lint` and `npm run build`. The scripts call binaries through `node node_modules/...`, so `npx tsc` may resolve the wrong package. Use `node node_modules/typescript/bin/tsc -b` instead.

`npm run dev` fails when the installed workerd/wrangler runtime is older than the `compatibility_date` in `vite.config.ts`. To check the UI without it, build and serve `dist/client` statically.

## Deployment

- **GitHub Pages:** `.github/workflows/deploy-pages.yml` runs on every push to `main`. It builds with Node 22 and uploads `dist/client`. When `GITHUB_ACTIONS` is set, `vite.config.ts` derives the base path from `GITHUB_REPOSITORY` (currently `/Portfolio/`); locally the base is `/`. Reference public assets with `import.meta.env.BASE_URL` (see `src/i18n.js` and the CV link in `src/pages/banner.tsx`) so they resolve under both bases.
- **Cloudflare Worker:** the `cloudflare()` and `sites()` (`@openai/sites-vite-plugin`, `.openai/hosting.json`) plugins also produce a Worker build. `worker/index.js` only serves static assets, with SPA fallback.

## Architecture

- `src/App.tsx` stacks the page sections in order: `Banner` → `Projects` → `Skill` → `Formation` → `KnowMe`. Each section lives in `src/pages/` and is anchored by an `id` (`inicio`, `projetos`, `expertise`, `trajetoria`, `sobre`) that the top-bar nav in `banner.tsx` links to.
- `src/component/` holds the reusable pieces: `Card`, `HoverCard`, `Button`, `ProcessBar`, and `IdBadge`, the draggable and flippable lanyard badge shown in the hero.

### i18n

- `src/i18n.js` loads translations at runtime from `public/locales/{en,pt-BR}/translation.json` through `i18next-http-backend`. English is the default language.
- Every user-facing string goes through `t("section.key")`. When you add a string, add the key to both JSON files.
- The `?v=...` query on `loadPath` is a cache-buster. Bump it when you change translations that must reach already-deployed clients.
- The PT/EN toggle is in `banner.tsx` and calls `i18n.changeLanguage`.

### Styling

There are two coexisting styles:

- **Newer sections** (hero, projects, expertise) use plain semantic class names defined in `src/App.css` (`.hero-shell`, `.project-card`, …). That file is written as dense one-line rules with responsive breakpoints at 900px and 560px.
- **Older sections** (`formation`, `knowme`) use Tailwind utility classes inline.

Fonts and theme tokens:

- `src/index.css` imports Tailwind and defines the font tokens `font-title` (DM Serif Display), `font-impact` (Syne) and `font-body` (Inter).
- The brand accent is yellow (`#ffd230` / `#e5b900`), on near-black `#0a0909` / `#111` or off-white `#f5f5f2`.

### Animation

- Framer Motion handles entrances. The usual pattern is `whileInView` with `viewport={{ once: true }}`, or `Variants` with stagger.
- `App.css` disables transitions under `prefers-reduced-motion`. Components that run their own physics (`IdBadge`) check `useReducedMotion`.

### React Compiler

`babel-plugin-react-compiler` is installed, so avoid manual memoization unless it is clearly needed.

## Conventions

- Code comments are in Portuguese.
- Commit messages are in English and use Conventional Commits (`feat:`, `fix:`, `docs:`).
- Some source files (for example `src/pages/knowme.tsx`) use CRLF or mixed line endings. Preserve the existing endings when you edit them, so diffs stay minimal.
