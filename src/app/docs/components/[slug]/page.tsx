import type { Metadata } from "next";
import { Suspense } from "react";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { GuidanceTabs, PagerLinks, Toc } from "@/components/docs/doc-parts";
import { Playground } from "@/components/docs/playground";
import { categorySlug, components, getComponent, neighbours } from "@/lib/registry";
import { sourceOf } from "@/lib/source-map";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/docs/components/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = getComponent(slug);
  return doc ? { title: doc.name, description: doc.description } : {};
}

export default function ComponentPage(props: PageProps<"/docs/components/[slug]">) {
  return (
    <Suspense fallback={<div className="w-full px-5 py-10 sm:px-10"><div className="h-12 w-64 animate-pulse rounded-md bg-layer" /></div>}>
      <ComponentPageBody params={props.params} />
    </Suspense>
  );
}

async function ComponentPageBody({ params }: Pick<PageProps<"/docs/components/[slug]">, "params">) {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) notFound();
  const { prev, next } = neighbours(slug);
  const related = components.filter((c) => c.category === doc.category && c.slug !== doc.slug).slice(0, 6);

  return (
    <div className="flex w-full gap-12 px-5 py-8 sm:px-10 lg:py-10">
      <article className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-ink-2">
            <li>
              <NextLink href="/docs/components" className="text-link hover:underline">
                Components
              </NextLink>
            </li>
            <li aria-hidden>/</li>
            <li>
              <NextLink href={`/docs/components#${categorySlug(doc.category)}`} className="text-link hover:underline">
                {doc.category}
              </NextLink>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {doc.name}
            </li>
          </ol>
        </nav>

        <header className="mt-5">
          <h1 className="text-[2.625rem] font-normal leading-[1.2] tracking-[-0.01em] text-ink">{doc.name}</h1>
          <p className="mt-3 max-w-[46rem] text-xl leading-[1.5] text-ink-2">{doc.overview ?? doc.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-tint px-2.5 py-1 text-eyebrow">{doc.category}</span>
            <span className="rounded-full bg-success-bg px-2.5 py-1 text-success-text">Stable</span>
            {doc.exports.length > 0 && (
              <span className="flex flex-wrap items-center gap-1.5 ps-1 text-ink-2">
                Exports
                {doc.exports.map((e) => (
                  <code key={e} className="rounded-md bg-layer px-1.5 py-0.5 font-mono text-[12px] text-ink">
                    {e}
                  </code>
                ))}
              </span>
            )}
          </div>
        </header>

        <div id="preview" className="mt-10 scroll-mt-20">
          <Playground doc={doc} />
        </div>

        <div className="mt-14">
          <GuidanceTabs doc={doc} />
        </div>

        {related.length > 0 && (
          <section id="related" aria-labelledby="related-h" className="mt-16 scroll-mt-20">
            <h2 id="related-h" className="text-base font-semibold text-ink">
              More in {doc.category}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <NextLink href={`/docs/components/${r.slug}`} className="group block h-full rounded-box border border-line p-4 transition-colors hover:border-line-2 hover:bg-layer">
                    <span className="block text-sm font-semibold text-ink group-hover:text-link">{r.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-ink-2">{r.description}</span>
                  </NextLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <PagerLinks prev={prev && { href: `/docs/components/${prev.slug}`, title: prev.name }} next={next && { href: `/docs/components/${next.slug}`, title: next.name }} />
      </article>

      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
        <Toc
          items={[
            { id: "preview", label: "Preview" },
            { id: "code-h", label: "Code" },
            { id: "guidelines", label: "Usage and accessibility" },
            ...(related.length ? [{ id: "related", label: `More in ${doc.category}` }] : []),
          ]}
        />
        <div className="mt-8 rounded-box bg-layer p-4 text-xs leading-5 text-ink-2">
          <p className="font-semibold text-ink">Import</p>
          <code className="mt-1 block break-all font-mono text-[12px] text-ink">{sourceOf(doc.slug).module ?? "@scopesky/ui"}</code>
          <p className="mt-3 font-semibold text-ink">Source</p>
          <code className="mt-1 block break-all font-mono text-[12px] text-ink">{sourceOf(doc.slug).file}</code>
        </div>
      </aside>
    </div>
  );
}
