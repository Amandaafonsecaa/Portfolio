# Repository Guidelines

## Project Structure & Module Organization

This repository contains Amanda Fonseca’s bilingual portfolio, built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and i18next.

- `src/main.tsx` initializes the application; `src/App.tsx` composes its sections.
- `src/pages/` contains portfolio sections such as the banner, projects, skills, and education.
- `src/component/` holds reusable UI components. Preserve this directory’s singular name.
- `src/assets/` contains imported images and icons; `public/cv/` contains downloadable résumés.
- `public/locales/en/translation.json` and `public/locales/pt-BR/translation.json` provide translations configured by `src/i18n.js`.
- `src/App.css` and `src/index.css` contain application and global styles. `worker/index.js` forwards requests to Cloudflare’s asset binding.

## Build, Test, and Development Commands

- `npm install` installs dependencies; keep `package-lock.json` synchronized with intentional dependency changes.
- `npm run dev` starts the Vite development server.
- `npm run build` clears `dist/`, runs TypeScript project checks, builds production assets, and moves `dist/portifolio` to `dist/server`.
- `npm run lint` runs ESLint, including TypeScript, React Hooks, and React Refresh rules.
- `npm run preview` starts Vite’s production preview server.

## Coding Style & Naming Conventions

Use TypeScript for new React code, functional components, and explicit prop types. Use two-space indentation and follow the surrounding file’s quote and semicolon conventions; existing files vary. Name reusable component files in PascalCase, such as `HoverCard.tsx`; retain existing lowercase section filenames. Keep TypeScript strict checks passing and remove unused imports and variables. No dedicated formatter is configured.

Keep user-facing copy in both translation files with matching keys. Build public asset URLs using `import.meta.env.BASE_URL` so they work under the GitHub Pages `/Portfolio/` base path.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is currently configured. Run `npm run lint` and `npm run build` before submitting changes. Manually verify affected sections at mobile and desktop widths, both languages, résumé downloads, project links, and reduced-motion behavior when changing animations.

## Commit & Pull Request Guidelines

Recent commits use concise, imperative messages with `feat:`, `fix:`, and `docs:` prefixes, for example `fix: improve journey title on mobile`. Follow that convention. Pull requests should describe the resulting behavior, link relevant issues, list validation performed, and include screenshots for visual changes. Keep unrelated changes out of the diff.
