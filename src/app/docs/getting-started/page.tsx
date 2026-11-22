import type { Metadata } from "next";
import NextLink from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { PageHeader, PagerLinks } from "@/components/docs/doc-parts";

export const metadata: Metadata = { title: "Getting started" };

const steps = [
  {
    title: "Install the library",
    body: "In any Next.js (or other React + Tailwind CSS v4) project, add @scopesky/ui. It has no dependencies of its own; it only needs React 19.",
    code: `npm i @scopesky/ui`,
    lang: "Terminal",
  },
  {
    title: "Add the styles",
    body: "One line after Tailwind brings in the ScopeSky colors, the 10px radius, animations and base rules, and tells Tailwind to scan the library's class names.",
    code: `/* app/globals.css */
@import "tailwindcss";
@import "@scopesky/ui/styles.css";`,
    lang: "CSS",
  },
  {
    title: "Use a component",
    body: "Import from the package root, or from a subpath such as @scopesky/ui/fields. Named icons come from @scopesky/ui/icons.",
    code: `import { Button, TextInput } from "@scopesky/ui";
import { Plus } from "@scopesky/ui/icons";

export default function Page() {
  return (
    <form className="flex max-w-sm flex-col gap-4 p-8">
      <TextInput label="Email address" placeholder="name@example.com" />
      <Button icon={<Plus />}>Save changes</Button>
    </form>
  );
}`,
    lang: "TSX",
  },
  {
    title: "Fonts, dark mode and Arabic",
    body: "Load Geist and Readex Pro with next/font as --font-geist and --font-readex to match this site (system fonts are used otherwise). Set data-theme=\"dark\" on <html> for dark mode, and lang plus dir for Arabic.",
    code: `<html lang="ar" dir="rtl" data-theme="dark">`,
    lang: "HTML",
  },
  {
    title: "Work on the library itself",
    body: "The package lives in packages/ui of this repository. npm run dev builds it and starts this docs site; run npm run dev:ui in a second terminal to rebuild on every change.",
    code: `npm install
npm run dev        # docs site at http://localhost:3000
npm run dev:ui     # rebuild @scopesky/ui on change
npm run pack:ui    # make scopesky-ui-<version>.tgz to share`,
    lang: "Terminal",
  },
];

export default function GettingStarted() {
  return (
    <div className="w-full px-5 py-10 sm:px-10 lg:py-14">
      <PageHeader eyebrow={<span className="font-semibold text-eyebrow">Docs</span>} title="Getting started" lead="Install @scopesky/ui in any project, add one CSS line, and import the components you need." />
      <ol className="mt-12 flex flex-col">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-6 pb-12 last:pb-0">
            {i < steps.length - 1 && <span aria-hidden className="absolute start-[15px] top-9 bottom-0 w-px bg-line" />}
            <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-bold text-eyebrow">{i + 1}</span>
            <div className="min-w-0 flex-1 pt-1">
              <h2 className="text-xl text-ink">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-2">{s.body}</p>
              <CodeBlock className="mt-4" code={s.code} title={s.lang} />
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-12 text-sm text-ink-2">
        Next, browse the <NextLink href="/docs/components" className="text-link underline">component catalog</NextLink> or see the <NextLink href="/docs/foundations/colors" className="text-link underline">colors</NextLink>.
      </p>
      <PagerLinks prev={{ href: "/", title: "Overview" }} next={{ href: "/docs/foundations/colors", title: "Colors" }} />
    </div>
  );
}
