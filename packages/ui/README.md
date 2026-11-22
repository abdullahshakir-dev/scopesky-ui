# @scopesky/ui

Hand-written React components for ScopeSky websites, styled with Tailwind CSS:
buttons, fields, data tables, menus, overlays, feedback and conversation parts,
plus 95 icons from [Lucide](https://lucide.dev). No runtime dependencies.
Arabic / RTL ready, light and dark themes.

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
`/overlays`, `/conversation`, `/hooks`, `/locale`, `/icons`, `/utils`.

Most components take `className`.

### Forms

Every input works both ways: controlled with `value` + `onValueChange`
(`checked` + `onCheckedChange` for checkboxes and switches), or uncontrolled
with `defaultValue`. Inputs take `name`, so a plain form submit includes them,
and forward their `ref`. Fields built on a native element (`TextInput`,
`TextArea`, `Select`, `Checkbox` …) pass every other prop through to it.

```tsx
const [plan, setPlan] = useState<string | null>("home-100");

<Dropdown
  label="Plan"
  name="plan"
  options={[{ value: "home-100", label: "Home 100 Mbps" }, { value: "biz-500", label: "Business 500" }]}
  value={plan}
  onValueChange={setPlan}
/>

// react-hook-form: register works on the native-backed fields (React 18 and 19)
<TextInput label="Email" {...register("email")} />
// …and Controller works on the rest
<Controller name="date" control={control} render={({ field }) => (
  <DatePicker label="Date" value={field.value} onValueChange={field.onChange} ref={field.ref} />
)} />
```

Callbacks follow one scheme: `onValueChange`, `onCheckedChange`,
`onOpenChange`, `onSelectedChange`, `onPressedChange`, `onItemSelect` (menus).

### Data table

```tsx
import { DataTable, type DataTableColumn } from "@scopesky/ui/data";

const columns: DataTableColumn<Invoice>[] = [
  { key: "number", header: "Invoice" },
  { key: "customer", header: "Customer" },
  { key: "total", header: "Total", align: "end", cell: (r) => r.total.toFixed(2) },
];

<DataTable
  columns={columns}
  data={invoices}
  selectable
  onSelectionChange={setSelected}
  batchActions={(rows) => <button onClick={() => exportRows(rows)}>Export</button>}
/>
```

For server-side data, pass `manual` and read `onFilterChange` / `onSortChange`;
`loading` shows placeholder rows while you fetch.

### Arabic and other languages

The text components write on their own (button labels, empty states,
screen-reader labels) is English by default. Wrap your app to switch it:

```tsx
import { LocaleProvider, arMessages } from "@scopesky/ui/locale";

<LocaleProvider messages={arMessages}>{children}</LocaleProvider>
// or change single strings: <LocaleProvider messages={{ noData: "No invoices yet." }}>
```

## Upgrading from 2.x

3.0.0 changes component APIs. The main renames:

| 2.x | 3.0 |
| --- | --- |
| `Checkbox` / `Toggle` `onChange(checked)` | `onCheckedChange(checked)` (`onChange` is now the native event) |
| `RadioGroup`, `ContentSwitcher`, `ButtonGroup` `onChange` | `onValueChange` |
| `RadioGroup labels={{…}}` | `options={[{ value, label }]}` |
| `Dropdown initial`, `MultiSelect initial` | `defaultValue` |
| `Modal onClose`, `primary`, `secondary` | `onOpenChange`, `primaryText`, `secondaryText`, plus `onPrimaryClick` / `onSecondaryClick` |
| `AlertDialog cancel`, `action` | `cancelText`, `actionText`, plus required `onAction` |
| `Notification action` | `actionText` + `onAction` |
| `DataTable rows` (fixed `Row` type) | `columns` + `data` |
| `StructuredList rows` (`plan/speed/price`) | `columns` + `rows` |
| `BarChart data` (`a`/`b`) | `data` + `categoryKey` + `series` |
| `Collapsible rest` | `children` |
| `Tile onSelect`, `Tag onSelect` | `onSelectedChange` |
| menus `onPick(label)` | `onItemSelect(item)` |
| `Pagination` / `PaginationNav` defaults (237 items, page 4) | `total` / `pages` are required |
| `AILabel` built-in demo text | pass `children` |
| `sampleRows`, `sBtn`, `fieldBox` | removed |

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

The icons are from [Lucide](https://lucide.dev) and are used under Lucide's ISC
license (part of it is MIT, from Feather). They are not covered by ScopeSky's
LICENSE. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md), and keep that
notice with the icons if you copy them elsewhere.

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
