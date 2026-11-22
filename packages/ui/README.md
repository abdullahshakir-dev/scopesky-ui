# @scopesky/ui

Hand-written React components for ScopeSky websites, styled with Tailwind CSS.
No third-party UI code: buttons, fields, data tables, menus, overlays, feedback
and conversation parts, plus a ScopeSky icon set. Arabic / RTL ready, light and
dark themes.

## Requirements

- React 18 or 19
- Any build setup. With Tailwind CSS v4 you get the tokens as Tailwind classes;
  without it (Tailwind v3, Vite, plain CSS) use the ready-made stylesheet.

## Install

```bash
npm i @scopesky/ui
```

## Set up the styles

Pick one of the two options.

### Option A: your app uses Tailwind CSS v4

In your global stylesheet, right after Tailwind:

```css
@import "tailwindcss";
@import "@scopesky/ui/styles.css";
```

That one import brings the ScopeSky color tokens, the 10px radius
(`rounded-box`), animations and base rules, and adds the package to Tailwind's
class scanning. You can then use the tokens in your own markup too:
`bg-primary`, `text-ink`, `text-ink-2`, `border-line`, `bg-layer`, `rounded-box`.

### Option B: Tailwind v3, or no Tailwind

Import the ready-made stylesheet once, in your entry file, **after** your own CSS:

```tsx
// main.jsx / main.tsx
import "./index.css";
import "@scopesky/ui/ui.css";
```

It holds every class the components use plus the ScopeSky tokens as CSS
variables (`var(--primary)`, `var(--text)` …). It has no CSS reset of its own,
so your app's reset stays as it is. Don't use Option A's import as well.

## Use components

```tsx
import { Button, TextInput, Tag } from "@scopesky/ui";
import { Plus, Search } from "@scopesky/ui/icons";

<TextInput label="Email address" placeholder="name@example.com" leading={<Search />} />
<Button icon={<Plus />}>Save changes</Button>
<Tag type="green">Active</Tag>
```

Subpath imports are available for a smaller module graph:
`@scopesky/ui/button`, `/fields`, `/data`, `/feedback`, `/navigation`,
`/overlays`, `/conversation`, `/hooks`, `/icons`, `/utils`.

Interactive components are marked `"use client"`, so they work from Next.js
Server Components without extra wrappers.

## Icons

```tsx
import { Icon, Search } from "@scopesky/ui/icons";

<Icon name="search" className="size-4 text-ink-2" />
<Search className="size-5" strokeWidth={1.5} />
```

Icons take the current text color. The raw SVG files ship too:
`@scopesky/ui/icons/search.svg`.

## Themes, fonts and direction

- Dark mode: `<html data-theme="dark">`.
- Arabic: `<html lang="ar" dir="rtl">`. Components use logical properties and mirror on their own.
- Fonts: the styles use `--font-geist`, `--font-readex` and `--font-geist-mono`
  when they exist (for example from `next/font/google`), and system fonts otherwise.

## Developing the library

The source lives in `packages/ui` of the scopesky-ui repository; the docs site
at the repository root uses it.

| Command (repo root) | What it does |
| --- | --- |
| `npm run dev` | Builds the package, then starts the docs site |
| `npm run dev:ui` | Rebuilds the package on every change (second terminal) |
| `npm run build:ui` | One-off package build into `packages/ui/dist` |
| `npm run pack:ui` | Creates `scopesky-ui-<version>.tgz` to share or install |

To add an icon, drop a 24 × 24 stroke SVG into `packages/ui/icons` (wrap the
shapes in `<g id="icon">`), then rebuild. The build generates
`src/icon-data.ts` from the files.

Bump `version` in `packages/ui/package.json` before each release.
