# Portfolio Site

A feature-heavy personal portfolio built with Next.js 16 and React 19. It combines a performant SPA experience with rich visuals: a three.js hero canvas, magnetic navigation, animated section reveals, and a skills dashboard sourced from GitHub data.

## Features
- Responsive layout with dark/light theme persistence and smooth section scrolling.
- Motion-first UI using Framer Motion plus a reduced-motion fallback for accessibility.
- three.js/Fiber hero background with post-processing bloom and parallax layers.
- Dynamic skills/projects sections backed by data in `src/data/portfolio.ts` and GitHub API helpers.
- Contact form stub that can be wired to any provider.

## Tech Stack
- Next.js 16 (App Router, React Server Components where applicable)
- React 19 + TypeScript + ESLint 9
- Tailwind CSS 4 for utility styling
- @react-three/fiber, drei, and postprocessing for WebGL effects
- Framer Motion for interactions

## Getting Started
```
npm install
npm run dev
```
Visit `http://localhost:3000` to view the site. Hot reloading is enabled for everything inside `src/`.

### Available Scripts
- `npm run dev` – start the development server.
- `npm run build` – create an optimized production build in `.next/`.
- `npm run start` – serve the production build.
- `npm run lint` – run ESLint with the repo config.

## Project Structure
```
.
+- public/                # Static assets, favicons, OG images
+- src/
¦  +- components/         # UI building blocks, effects, layout pieces
¦  +- data/               # Portfolio data & constants
¦  +- styles/             # Global styles & Tailwind layers
¦  +- app/                # App Router entry points/pages
+- next.config.ts
+- eslint.config.mjs
+- tsconfig.json
+- package.json
```

## Environment
The project currently relies only on public data. Add any required secrets via `.env.local` following the Next.js environment docs.

## Deployment
1. Build the app: `npm run build`.
2. Deploy the `.next` output using your preferred platform (Vercel, Netlify, AWS, etc.).
3. Ensure `NODE_ENV=production` matches local settings.

For deployment specifics, see the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).
