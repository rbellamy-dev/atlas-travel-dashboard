# Template skeleton

Copy this directory into `./projects/{id}-{desc}/`, then fill placeholders and generate the rest. Two categories:

## Copy as-is (no edits needed)
- `.npmrc` — mandatory `legacy-peer-deps=true`
- `vite.config.ts`
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`
- `components.json` — shadcn new-york, Tailwind v4
- `src/lib/utils.ts` — `cn()`
- `src/main.tsx`
- `.storybook/main.ts` — includes `addon-a11y`
- `.storybook/manager.ts`

## Fill placeholders
- `package.json` → `{{PROJECT_SLUG}}` (kebab-case package name). Add test deps per chosen depth; add `framer-motion` if opted in.
- `index.html` → `{{PROJECT_TITLE}}`; wire the chosen fonts (self-host/preload preferred).
- `vercel.json` → app deploy config (Storybook deploys as a separate target — see `references/stack-recipe.md` §5).

## Generate from `design.md` / `product.md` (NOT in this skeleton)
These are emitted per project — see the referenced files:
- `src/index.css` + `src/tokens.ts` + `.storybook/theme.ts` → from `design.md` (`references/token-system.md`). `theme.ts` must export `brandTheme` (referenced by `manager.ts`).
- `.storybook/preview.tsx` → imports `../src/index.css`, loads fonts, sets `storySort`, wires the `withThemeByDataAttribute` decorator if theming (`references/token-system.md`).
- `src/App.tsx` + `src/dashboard/*` → the standalone dashboard (`references/dashboard-composition.md`, `references/data-modeling.md`).
- `src/components/ui/*` → `npx shadcn add …`. `src/components/{domain}/*` → hand-authored (`references/component-patterns.md`).
- `src/stories/*` → one per component + `DesignTokens.stories.tsx` (`references/story-patterns.md`).
- `product.md` + `design.md` at the project root.
- `public/favicon.svg`.

## Not included on purpose
No `tailwind.config.js` (Tailwind v4 has none). No `postcss.config.js`.
