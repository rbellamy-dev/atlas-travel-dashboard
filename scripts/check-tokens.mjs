#!/usr/bin/env node
/**
 * Token drift guard.
 *
 * `src/tokens.ts` and `src/index.css` hold the same values in two forms — CSS for
 * rendering, TS for the Foundation story. Nothing generates one from the other, so
 * they can silently disagree (in v1 of this system they did: Storybook chrome sat at
 * #101010 while the app canvas was #0d1117).
 *
 * This asserts every value exported from tokens.ts matches its CSS custom property.
 * Zero dependencies — the project has no test runner on purpose.
 *
 *   node scripts/check-tokens.mjs
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = stripComments(readFileSync(join(root, 'src/index.css'), 'utf8'))
const ts = stripComments(readFileSync(join(root, 'src/tokens.ts'), 'utf8'))

/* ── helpers ──────────────────────────────────────────────────────────── */

function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '')
}

/** Pull the body of a block by its selector, matching braces. */
function block(source, selector) {
  const start = source.indexOf(selector)
  if (start === -1) return null
  const open = source.indexOf('{', start + selector.length)
  if (open === -1) return null
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}' && --depth === 0) return source.slice(open + 1, i)
  }
  return null
}

/** `--foo-bar: value;` pairs out of a block body. */
function customProps(body) {
  const out = {}
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    out[`--${m[1]}`] = m[2].trim()
  }
  return out
}

/** camelCase -> kebab-case */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * Compare values that are equal but not string-equal:
 *   rgba(34,211,238,.10)  ==  rgba(34, 211, 238, 0.1)
 *   cubic-bezier(.16,1,.3,1)  ==  cubic-bezier(0.16, 1, 0.3, 1)
 *   #FFF  ==  #ffffff
 */
function normalize(raw) {
  let v = raw.trim().toLowerCase().replace(/\s+/g, '')
  if (/^#[0-9a-f]{3}$/.test(v)) v = '#' + [...v.slice(1)].map((c) => c + c).join('')
  if (v.startsWith('#')) return v
  // re-stringify decimals so .10 / 0.10 / 0.1 all collapse
  return v.replace(/(?<![\w#.])(\d*\.\d+|\d+)/g, (n) => String(parseFloat(n)))
}

/** Read a flat `export const NAME = { ... }` object out of tokens.ts. */
function tsObject(name) {
  const body = block(ts, `export const ${name} =`)
  if (!body) fail(`tokens.ts: no export named "${name}"`)
  const out = {}
  for (const m of body.matchAll(/(\w+)\s*:\s*(?:'([^']*)'|"([^"]*)")/g)) {
    out[m[1]] = m[2] ?? m[3]
  }
  return out
}

/**
 * Read `typeScale` and flatten it to the CSS custom properties Tailwind expects:
 *   displayXl: { size, weight, lh, ls }
 *     -> --text-display-xl, --text-display-xl--font-weight,
 *        --text-display-xl--line-height, --text-display-xl--letter-spacing
 */
function tsTypeScale() {
  const body = block(ts, 'export const typeScale')
  if (!body) fail('tokens.ts: no export named "typeScale"')
  const out = {}
  for (const m of body.matchAll(/(\w+)\s*:\s*\{([^}]*)\}/g)) {
    const role = `--text-${kebab(m[1])}`
    const fields = Object.fromEntries(
      [...m[2].matchAll(/(\w+)\s*:\s*(?:'([^']*)'|(\d+))/g)].map((f) => [f[1], f[2] ?? f[3]]),
    )
    out[role] = fields.size
    out[`${role}--line-height`] = fields.lh
    out[`${role}--letter-spacing`] = fields.ls
    out[`${role}--font-weight`] = fields.weight
  }
  return out
}

/** Read `colors.dark` / `colors.light` out of the nested colors object. */
function tsColors(mode) {
  const colorsBody = block(ts, 'export const colors =')
  if (!colorsBody) fail('tokens.ts: no export named "colors"')
  const modeBody = block(colorsBody, `${mode}:`)
  if (!modeBody) fail(`tokens.ts: colors.${mode} not found`)
  const out = {}
  for (const m of modeBody.matchAll(/(\w+)\s*:\s*'([^']*)'/g)) out[m[1]] = m[2]
  return out
}

function fail(msg) {
  console.error(`\x1b[31m${msg}\x1b[0m`)
  process.exit(1)
}

/* ── the CSS side ─────────────────────────────────────────────────────── */

const staticTheme = customProps(block(css, '@theme') ?? fail('index.css: no @theme block'))
const darkVars = customProps(block(css, ':root') ?? fail('index.css: no :root block'))
const lightVars = customProps(
  block(css, ":root[data-theme='light']") ?? fail("index.css: no :root[data-theme='light'] block"),
)

/* ── what to compare ──────────────────────────────────────────────────── */

/** [label, tokens.ts values, css values, key -> css custom property name] */
const suites = [
  ['colors.dark', tsColors('dark'), darkVars, (k) => `--${kebab(k)}`],
  ['colors.light', tsColors('light'), lightVars, (k) => `--${kebab(k)}`],
  ['radius', tsObject('radius'), staticTheme, (k) => `--radius-${kebab(k)}`],
  ['fonts', tsObject('fonts'), staticTheme, (k) => `--font-${kebab(k)}`],
  ['shadows', tsObject('shadows'), staticTheme, (k) => `--shadow-${kebab(k)}`],
  ['motion', tsObject('motion'), darkVars, (k) => `--${kebab(k)}`],
  // typeScale keys are already full custom-property names
  ['typeScale', tsTypeScale(), staticTheme, (k) => k],
]

const problems = []
let checked = 0

for (const [label, tsValues, cssValues, toVar] of suites) {
  for (const [key, tsValue] of Object.entries(tsValues)) {
    const cssName = toVar(key)
    const cssValue = cssValues[cssName]
    checked++

    if (cssValue === undefined) {
      problems.push(`${label}.${key}  →  ${cssName} is not defined in index.css`)
      continue
    }
    if (normalize(tsValue) !== normalize(cssValue)) {
      problems.push(
        `${label}.${key}  →  ${cssName}\n` +
          `    tokens.ts: ${tsValue}\n` +
          `    index.css: ${cssValue}`,
      )
    }
  }
}

/* ── spacing ──────────────────────────────────────────────────────────── */

/**
 * `spacing` is deliberately NOT emitted as --spacing-* utilities: the scale is
 * identical to Tailwind's default 4px step, so `--spacing-sp4` would just be a
 * second name for what `p-4` already gives you. Instead, assert it stays a clean
 * 4px scale — if someone adds sp9: 70 the docs and the utilities diverge.
 */
{
  const spacing = block(ts, 'export const spacing')
  if (!spacing) fail('tokens.ts: no export named "spacing"')
  for (const m of spacing.matchAll(/(\w+)\s*:\s*(\d+)/g)) {
    const [, key, value] = m
    checked++
    if (Number(value) % 4 !== 0) {
      problems.push(
        `spacing.${key} = ${value}\n` +
          `    not a multiple of 4 — Tailwind's default scale can't express it, ` +
          `so it needs its own --spacing-* token or it isn't real`,
      )
    }
  }
}

/* ── report ───────────────────────────────────────────────────────────── */

if (problems.length) {
  console.error(`\x1b[31m✗ token drift — ${problems.length} of ${checked} values disagree\x1b[0m\n`)
  for (const p of problems) console.error(`  ${p}\n`)
  console.error('src/tokens.ts and src/index.css must hold the same values.\n')
  process.exit(1)
}

console.log(`\x1b[32m✓ tokens in sync\x1b[0m — ${checked} values match across tokens.ts and index.css`)
