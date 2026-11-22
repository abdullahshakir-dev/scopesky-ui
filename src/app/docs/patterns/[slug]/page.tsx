import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader, PagerLinks } from "@/components/docs/doc-parts";
import { DataViewPattern, EmptyStatesPattern, RequestFormPattern, SignInPattern } from "@/components/docs/patterns";
import { patterns } from "@/lib/registry";

const views = {
  "sign-in": { Comp: SignInPattern, uses: ["Radio button", "Text input", "Password input", "Checkbox", "Button", "Notification"] },
  "data-view": { Comp: DataViewPattern, uses: ["Tabs", "Data table", "Tag", "Pagination", "Sheet", "Empty"] },
  "request-form": { Comp: RequestFormPattern, uses: ["Progress indicator", "Form group", "Text input", "Dropdown", "Text area", "File uploader"] },
  "empty-states": { Comp: EmptyStatesPattern, uses: ["Empty", "Button"] },
} as const;

export function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/docs/patterns/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = patterns.find((x) => x.slug === slug);
  return p ? { title: `${p.name} pattern`, description: p.description } : {};
}

export default function PatternPage(props: PageProps<"/docs/patterns/[slug]">) {
  return (
    <Suspense fallback={<div className="w-full px-5 py-10 sm:px-10"><div className="h-12 w-64 animate-pulse rounded-md bg-layer" /></div>}>
      <PatternPageBody params={props.params} />
    </Suspense>
  );
}

async function PatternPageBody({ params }: Pick<PageProps<"/docs/patterns/[slug]">, "params">) {
  const { slug } = await params;
  const i = patterns.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = patterns[i];
  const v = views[p.slug as keyof typeof views];
  const prev = patterns[i - 1];
  const next = patterns[i + 1];
  return (
    <div className="w-full px-5 py-10 sm:px-10 lg:py-14">
      <PageHeader eyebrow={<span className="font-semibold text-eyebrow">Patterns</span>} title={p.name} lead={p.description}>
        <p className="text-sm text-ink-2">
          Built from: <span className="text-ink">{v.uses.join(", ")}</span>
        </p>
      </PageHeader>
      <div className="mt-10">
        <v.Comp />
      </div>
      <PagerLinks prev={prev && { href: `/docs/patterns/${prev.slug}`, title: prev.name }} next={next && { href: `/docs/patterns/${next.slug}`, title: next.name }} />
    </div>
  );
}
