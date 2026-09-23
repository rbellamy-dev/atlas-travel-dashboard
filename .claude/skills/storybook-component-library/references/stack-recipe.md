# Stack recipe — exact reproduction

Ground truth: the repo this folder sits in. When in doubt, read the real files there:
`package.json`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `vercel.json`, `.storybook/*`, `src/index.css`, `src/tokens.ts`, `src/components/ui/*`, `src/components/travel/*`, `src/stories/*`.

Most of this ships as `assets/template/` — copy it and fill placeholders rather than regenerating from scratch. This file is the explanation + the watch-outs.

## Table of contents
1. Versions
2. Config files
3. tsconfig trio
4. Storybook config
5. Deploy
6. Scripts
7. Watch-outs

## 1. Versions (locked)

```jsonc
// dependencies
"react": "^19.0.0", "react-dom": "^19.0.0",
"@radix-ui/react-dialog": "^1.1.20", "@radix-ui/react-label": "^2.1.7",
"@radix-ui/react-progress": "^1.1.7", "@radix-ui/react-separator": "^1.1.7",
"@radix-ui/react-slot": "^1.1.2", "@radix-ui/react-tabs": "^1.1.12",
"@radix-ui/react-toggle-group": "^1.1.16",
"class-variance-authority": "^0.7.1", "clsx": "^2.1.1",
"tailwind-merge": "^3.3.0", "lucide-react": "^0.511.0",

// devDependencies
"storybook": "^8.6.12",
"@storybook/react": "^8.6.12", "@storybook/react-vite": "^8.6.12",
"@storybook/blocks": "^8.6.12",
"@storybook/addon-essentials": "^8.6.12", "@storybook/addon-interactions": "^8.6.12",
"@storybook/addon-links": "^8.6.12", "@storybook/addon-themes": "^8.6.12",
"@tailwindcss/vite": "^4.1.10", "tailwindcss": "^4.1.10",
"vite": "^6.3.5", "@vitejs/plugin-react": "^4.5.0",
"typescript": "~5.8.3", "@types/node": "^22.15.30",
"@types/react": "^19.0.0", "@types/react-dom": "^19.0.0"
```

The Radix set above is what the reference's primitives use; add/remove based on which shadcn primitives the chosen **level** needs (`npx shadcn add` pulls the matching Radix dep automatically — a minimal dashboard needs far fewer). `@storybook/test` is already in the template (free, for play functions). **Never install Playwright-based testing** (`@storybook/test-runner`, `@playwright/test`, `axe-playwright`) — its browser download bogs down install and every run. `vitest`, `chromatic`, or `framer-motion` may be added only if the user explicitly asks (see `references/testing.md`).

## 2. Config files

**`.npmrc`** (mandatory — React 19 × Storybook 8 peer conflict makes install fail without it):
```
legacy-peer-deps=true
```

**`vite.config.ts`** — Tailwind is a Vite plugin (order matters: tailwind before react), `@` → `./src`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

**`components.json`** (shadcn, new-york, Tailwind v4). The empty `"config": ""` is the signal to shadcn that this is Tailwind v4 (no config file). `css` points at the token file:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/index.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "iconLibrary": "lucide"
}
```

**`src/lib/utils.ts`**:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```

## 3. tsconfig trio

Solution-style. `noUnusedLocals`/`noUnusedParameters` are **false** (so render-fn stories with unused args don't error). App config **includes `.storybook`** so Storybook config is type-checked with the app.

`tsconfig.json` (solution): `{ "files": [], "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }] }`

`tsconfig.app.json`: `target ES2020`, `lib [ES2020, DOM, DOM.Iterable]`, `module ESNext`, `moduleResolution bundler`, `jsx react-jsx`, `strict true`, `allowImportingTsExtensions true`, `isolatedModules`, `moduleDetection force`, `noEmit true`, `noUnusedLocals false`, `noUnusedParameters false`, `baseUrl "."`, `paths { "@/*": ["./src/*"] }`, **`include: ["src", ".storybook"]`**.

`tsconfig.node.json`: for `vite.config.ts` — `target ES2022`, `lib [ES2023]`, same `@/*` paths, `include: ["vite.config.ts"]`.

Full copies are in `assets/template/`.

## 4. Storybook config (`.storybook/`, five files)

- **`main.ts`** — stories glob `['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']`; addons `essentials, interactions, links, themes`; framework `@storybook/react-vite`; `docs: { autodocs: 'tag' }`. Inherits `vite.config.ts` automatically (alias + Tailwind) — no `viteFinal` needed.
- **`preview.tsx`** — imports `../src/index.css` (this is how Storybook gets tokens + Tailwind), loads fonts, sets `docs.theme`, disables backgrounds, `storySort` order `['Foundation', ['Design Tokens'], '*']` to pin the token page first. Add the `withThemeByDataAttribute` decorator here when theming (see `token-system.md`).
- **`manager.ts`** — `addons.setConfig({ theme, showPanel: false })`.
- **`theme.ts`** — `create({ base, brandTitle, colorPrimary, appBg, ... })`. **Emit this from `design.md` using the same palette as the app** — don't hand-pick a second palette (that's the reference's chrome/canvas mismatch bug).
- **`preview-head.html`** — optional docs-page + args-table restyle to match the brand. Nice-to-have, not required for function.

## 5. Deploy (two artifacts)

- **App:** `vite build` → `dist/`. `vercel.json` → `{ "framework": "vite" }` (or rely on Vercel's Vite detection). Deployed as the live dashboard.
- **Storybook:** `build-storybook` → `storybook-static/`. Deploy as a second Vercel project/target with `{ "buildCommand": "npm run build-storybook", "outputDirectory": "storybook-static", "framework": null }`.

Since one repo produces two sites, the cleanest is two Vercel projects pointed at the same repo with different build settings, or a root `vercel.json` for the app + a separate Storybook project. Confirm the user's deploy-target naming (and skip deploy entirely if they don't want it).

## 6. Scripts (`package.json`)

```json
"dev": "vite",
"build": "tsc -b && vite build",
"preview": "vite preview",
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```
These five are all a demo needs. Only add `test-storybook` / `test` / `chromatic` / `e2e` scripts if the user asked for that tooling.

## 7. Watch-outs

- **`legacy-peer-deps` is mandatory** — React 19 × Storybook 8 peer ranges conflict; install fails without `.npmrc`.
- **Tailwind v4 has no config file** — empty `config` in `components.json` signals it. Don't scaffold `tailwind.config.js`.
- **Token values are duplicated** across `index.css`, `tokens.ts`, `theme.ts` — emit all three from `design.md`; never hand-sync.
- **Fonts load in up to three places** (`index.html`, `preview.tsx`, `preview-head.html`) — keep consistent; prefer self-hosting/preload for the app (see `component-patterns.md` perf notes).
- **`include: [".storybook"]`** in tsconfig.app.json means a type error in Storybook config fails the app typecheck — good, but don't forget it when debugging.
