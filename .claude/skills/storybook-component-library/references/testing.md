# Testing — deliberately lean (this is a demo generator)

The output is a demo, not a product that ships to users. So the default test bar is small, fast, and free. Heavier tooling is **off by default** because it dominates install and build time (Playwright alone downloads hundreds of MB of browsers). Only add it if the user explicitly asks.

## The default bar (always do this)

1. `tsc -p tsconfig.app.json --noEmit` → 0. Catches the real bugs — types across components, stories, and `.storybook`.
2. `vite build` → succeeds (proves Tailwind v4 + tokens compile).
3. `storybook build` → succeeds (proves every story loads).
4. Manually open `npm run dev` (the dashboard) and `npm run storybook`.

That's it. If those four pass, the demo works.

## Play functions — keep, they're free

`@storybook/test` is already in the template (no extra install, no browser download). Add a `play` **only** where an interaction is genuinely worth demoing (a Sheet opening, a card expanding) — it doubles as a live demo in the Interactions panel and a smoke test. Don't write one per component; that's busywork for a demo.

## The a11y addon — off by default

`@storybook/addon-a11y` (axe in the dev panel) is **not** part of the default scaffold. It generates panel noise that isn't worth the confusion in a lean demo generator: axe's default ruleset includes page-level rules (`region`, `landmark-one-main`, `page-has-heading-one`, `bypass`) that false-positive on every isolated component story (a lone `Badge` or `Card` is never wrapped in `<main>` or followed by exactly one `<h1>` — Storybook here only ever renders fragments, not the full page), and its `color-contrast` check reports "incomplete" on anything with a CSS gradient or `filter` (skeleton shimmer, a glow effect like `ringGlow`) since it can't compute contrast through those and defers to manual review. None of that reflects a real defect, but it reads like one until you know why.

Accessibility itself is still non-negotiable (see `component-patterns.md` §5) — semantic tokens keep contrast at WCAG AA by construction (checked at token-emission time, `token-system.md`), and every custom interactive component gets proper ARIA/keyboard/focus handling by hand. The addon just isn't the mechanism enforcing it here.

**If the user explicitly asks for the a11y addon**, add `@storybook/addon-a11y` to both `package.json` devDependencies and the `addons` array in `.storybook/main.ts`, then immediately configure `preview.tsx` to disable the page-level rules above, e.g.:

```ts
a11y: {
  config: {
    rules: [
      { id: 'region', enabled: false },
      { id: 'landmark-one-main', enabled: false },
      { id: 'page-has-heading-one', enabled: false },
      { id: 'bypass', enabled: false },
    ],
  },
},
```

Leave every other rule (color-contrast, label, button-name, aria-*, etc.) enabled — those are genuine component-level checks. Warn the user up front that gradient/filter elements will still show "incomplete," not a bug.

## Never use Playwright-based testing

**Do not install the Storybook test-runner or Playwright E2E.** They pull Playwright + browser binaries (hundreds of MB) that bog down install and every run — unacceptable for a demo generator. There is no "on request" exception here; steer the user to the default bar instead. Play functions still run live in Storybook's Interactions panel without any of it.

## Optional, only if explicitly asked (no Playwright)

- **Vitest** — only if there's meaningful pure logic to unit-test (a formatter, a contrast helper). Most demos have none. Fast, no browsers.
- **Chromatic** — hosted visual regression; runs in the cloud, no local browser download. Great for a real library, overkill for a demo.

If the user wants a production-grade library later, these are fine — but Playwright stays out.
