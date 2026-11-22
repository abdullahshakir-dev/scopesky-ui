import NextLink from "next/link";
import { ArrowRight, LayoutGrid, LayoutTemplate, Lightbulb, Palette } from "@scopesky/ui/icons";
import { BlueStairs } from "@/components/docs/blue-stairs";
import { components, patterns } from "@/lib/registry";
import { blueScale, neutralScale } from "@/lib/tokens";

const startHere = [
  { href: "/docs/getting-started", icon: Lightbulb, title: "Getting started", body: "Run this library, then copy the components and theme into your own project." },
  { href: "/docs/foundations/colors", icon: Palette, title: "Foundations", body: "Brand colors, contrast checks, type, spacing and icons, with exportable tokens." },
  { href: "/docs/components", icon: LayoutGrid, title: "Components", body: "Live previews you can configure, with generated code and usage guidelines." },
  { href: "/docs/patterns/sign-in", icon: LayoutTemplate, title: "Patterns", body: "Ready-made page sections: sign-in, request forms and record lists." },
];

const steps = [
  { title: "Find", body: "Search with Ctrl K, or browse the catalog." },
  { title: "Configure", body: "Change props in the panel. Switch theme and Arabic / RTL in the preview toolbar." },
  { title: "Copy", body: "The code updates live. Copy it straight into your page." },
  { title: "Check", body: "Read usage and accessibility notes before shipping." },
];

export default function Home() {
  const facts = [
    ["Components", String(components.length)],
    ["Patterns", String(patterns.length)],
    ["Color tokens", String(blueScale.length + neutralScale.length)],
    ["Themes", "4"],
    ["Directions", "LTR · RTL"],
  ];
  return (
    <div className="w-full px-5 py-8 sm:px-8 lg:px-11 lg:py-10">
      {/* Hero */}
      <section className="grid items-end gap-10 overflow-hidden rounded-[10px] bg-layer p-6 sm:p-10 xl:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-eyebrow">ScopeSky design system</p>
          <h1 className="text-5xl font-light leading-[1.1] tracking-[-0.02em] text-ink sm:text-[3.25rem]">ScopeSky UI</h1>
          <p className="max-w-[36rem] text-xl leading-[1.5] text-ink-2">
            Components, tokens and patterns for every ScopeSky website, hand-built with React and Tailwind CSS and themed in ScopeSky blue. Browse, configure, copy.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <NextLink
              href="/docs/components"
              className="inline-flex h-12 items-center gap-8 rounded-[10px] bg-primary px-5 text-sm font-medium text-on-color transition-colors hover:bg-primary-hover active:bg-primary-active"
            >
              Browse components <ArrowRight className="size-4 rtl:rotate-180" />
            </NextLink>
            <NextLink
              href="/docs/getting-started"
              className="inline-flex h-12 items-center rounded-[10px] border border-primary px-8 text-sm font-medium text-link transition-colors hover:bg-tint"
            >
              Getting started
            </NextLink>
          </div>
        </div>
        <BlueStairs />
      </section>

      {/* Facts */}
      <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
        {facts.map(([k, v]) => (
          <div key={k} className="rounded-[10px] border border-line bg-bg px-5 py-4">
            <dt className="text-xs text-ink-2">{k}</dt>
            <dd className="mt-1 whitespace-nowrap text-[1.75rem] leading-tight text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Start here */}
      <section aria-labelledby="start" className="mt-14">
        <h2 id="start" className="text-[1.75rem] text-ink">
          Start here
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {startHere.map((s) => (
            <NextLink key={s.href} href={s.href} className="group flex flex-col rounded-[10px] bg-layer p-5 transition-colors hover:bg-layer-hover">
              <s.icon className="size-5 text-accent" />
              <span className="mt-9 text-base font-semibold text-ink group-hover:text-link">{s.title}</span>
              <span className="mt-2 text-sm leading-[1.45rem] text-ink-2">{s.body}</span>
            </NextLink>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section aria-labelledby="how" className="mt-14">
        <h2 id="how" className="text-[1.75rem] text-ink">
          How to use this library
        </h2>
        <p className="mt-2 text-sm text-ink-2">Everything runs on your machine. Nothing is hosted or sent anywhere.</p>
        <ol className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-3 rounded-[10px] border border-line bg-bg p-5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-bold text-eyebrow">{i + 1}</span>
              <span className="flex flex-col gap-1">
                <span className="text-sm font-bold text-ink">{s.title}</span>
                <span className="text-sm leading-[1.45rem] text-ink-2">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* What's inside */}
      <section aria-labelledby="inside" className="mt-14">
        <h2 id="inside" className="text-[1.75rem] text-ink">
          What’s inside
        </h2>
        <ul className="mt-5 flex max-w-[52rem] flex-col gap-3 text-sm leading-6 text-ink">
          {[
            <>
              <b className="font-semibold">One package for every project.</b> <code className="rounded-md bg-layer px-1 font-mono text-[13px]">npm i @scopesky/ui</code>. Every component is written by hand in React and styled with Tailwind CSS, with no third-party UI code.
            </>,
            <>
              <b className="font-semibold">Own icon set.</b> Each icon is a plain SVG file in <code className="rounded-md bg-layer px-1 font-mono text-[13px]">packages/ui/icons</code>, built into the package and drawn in the current text color.
            </>,
            <>
              <b className="font-semibold">ScopeSky blues.</b> Buttons and links use Blue 700 (#006B9B) so white text meets WCAG AA; Sky Blue (#0094DA) is the brand accent.
            </>,
            <>
              <b className="font-semibold">Arabic and RTL first.</b> Every preview can switch to Arabic copy in a right-to-left layout set in Geist and Readex Pro.
            </>,
            <>
              <b className="font-semibold">One source of truth.</b> Colors live in <code className="rounded-md bg-layer px-1 font-mono text-[13px]">src/lib/tokens.ts</code>; the theme, this site and the token exports all follow it.
            </>,
          ].map((li, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-[2px] bg-accent" />
              <span>{li}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
