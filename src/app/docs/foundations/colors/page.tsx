import type { Metadata } from "next";
import { PageHeader, Toc } from "@/components/docs/doc-parts";
import { BrandSwatches, ScaleTable } from "@/components/docs/swatches";
import { CodeBlock } from "@/components/docs/code-block";
import { blueScale, brand, contrastChecks, neutralScale, statusColors, supporting } from "@/lib/tokens";
import { cn } from "@scopesky/ui/utils";

export const metadata: Metadata = { title: "Colors" };

const cssTokens = `:root {
${blueScale.map((s) => `  --ss-blue-${s.step}: ${s.hex};`).join("\n")}
${neutralScale.map((s) => `  --ss-gray-${s.step}: ${s.hex};`).join("\n")}
  --ss-white: #FFFFFF;
  --ss-near-black: #111111;
  --ss-cool-gray: #F4F7FA;
}`;

const tailwind = `@theme inline {
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-link: var(--link);
  --color-focus: var(--focus);
  --color-layer: var(--layer);
  --color-ink: var(--text);
  --color-ink-2: var(--text-2);
  --color-line: var(--border-subtle);
}`;

export default function ColorsPage() {
  return (
    <div className="flex w-full gap-12 px-5 py-10 sm:px-10 lg:py-14">
      <article className="min-w-0 flex-1">
        <PageHeader eyebrow={<span className="font-semibold text-eyebrow">Foundations</span>} title="Colors" lead="The ScopeSky palette and how it maps onto the Tailwind theme. Click any swatch to copy its hex value." />

        <section id="brand" className="mt-14 scroll-mt-20">
          <h2 className="text-[1.75rem] text-ink">Primary brand palette</h2>
          <div className="mt-5">
            <BrandSwatches items={brand} />
          </div>
        </section>

        <section id="supporting" className="mt-14 scroll-mt-20">
          <h2 className="text-[1.75rem] text-ink">Supporting colors</h2>
          <div className="mt-5">
            <BrandSwatches items={supporting} />
          </div>
          <div className="mt-6 flex flex-col gap-1 rounded-box border-s-[3px] border-accent bg-tint/60 px-5 py-4 text-sm sm:flex-row sm:gap-6">
            <b className="shrink-0 font-semibold text-ink">Why buttons use Blue 700, not Sky Blue</b>
            <span className="text-ink">White on Sky Blue is 3.4:1; Blue 700 reaches 5.9:1 (WCAG AA needs 4.5:1).</span>
          </div>
        </section>

        <section id="blue" className="mt-14 scroll-mt-20">
          <h2 className="text-[1.75rem] text-ink">Blue scale</h2>
          <p className="mt-2 max-w-[48rem] text-sm leading-6 text-ink-2">
            Contrast measured against White and Near Black. AA = 4.5:1 for text; AA large = 3:1 for large text, icons and borders. Steps 50 and 75–175 carry the blue table’s rows.
          </p>
          <div className="mt-5">
            <ScaleTable name="Blue" steps={blueScale} />
          </div>
        </section>

        <section id="neutral" className="mt-14 scroll-mt-20">
          <h2 className="text-[1.75rem] text-ink">Neutral scale</h2>
          <p className="mt-2 max-w-[48rem] text-sm leading-6 text-ink-2">
            Cool slate grays. Gray 500 was added so input borders reach the 3:1 non-text contrast minimum. 150, 250, 300 and 550 were added for the data tables.
          </p>
          <div className="mt-5">
            <ScaleTable name="Neutral" steps={neutralScale} />
          </div>
        </section>

        <section id="contrast" className="mt-14 scroll-mt-20">
          <h2 className="text-[1.75rem] text-ink">Contrast checks</h2>
          <div className="mt-5 overflow-x-auto rounded-box border border-line">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-layer text-xs text-ink-2">
                <tr>
                  {["Pair", "Sample", "Ratio", "Needs", "Result"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-start font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contrastChecks.map((c) => {
                  const pass = c.result === "Pass";
                  return (
                    <tr key={c.pair} className="border-t border-line">
                      <td className="px-4 py-2.5">
                        <span className="block text-ink">{c.pair}</span>
                        <span className="block font-mono text-[12px] text-ink-2">
                          {c.context} · {c.fg} on {c.bg}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex h-8 w-14 items-center justify-center rounded-sm border border-black/5 text-base font-semibold" style={{ background: c.bg, color: c.fg }}>
                          Aa
                        </span>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums text-ink">{c.ratio}</td>
                      <td className="px-4 py-2.5 tabular-nums text-ink-2">{c.needs}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs", pass ? "bg-success-bg text-success-text" : c.result.startsWith("Large") ? "bg-warning-bg text-warning-text" : "bg-danger-bg text-danger-text")}>{c.result}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="status" className="mt-14 scroll-mt-20">
          <h2 className="text-[1.75rem] text-ink">Status colors</h2>
          <p className="mt-2 max-w-[48rem] text-sm leading-6 text-ink-2">Success, warning, danger, info and neutral. Solid badges use the strong step with white text; tags and notifications use the tint with the text step.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statusColors.map((s) => (
              <div key={s.status} className="overflow-hidden rounded-box border border-line">
                <div className="flex h-1.5" style={{ background: s.accent }} />
                <div className="flex flex-col gap-4 p-4">
                  <p className="text-base text-ink">
                    {s.status} <span className="text-ink-2" lang="ar">· {s.arabic}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-xs text-white" style={{ background: s.solid }}>
                      {s.label}
                    </span>
                    <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: s.tint, color: s.text }}>
                      {s.label}
                    </span>
                    <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: s.tint, color: s.text }} lang="ar" dir="rtl">
                      {s.labelAr}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[12px]">
                    {[
                      ["Accent", s.accent],
                      ["Solid", s.solid],
                      ["Tint", s.tint],
                      ["Text", s.text],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="size-3 rounded-sm border border-black/10" style={{ background: v }} />
                        <dt className="text-ink-2">{k}</dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="tokens" className="mt-14 scroll-mt-20">
          <h2 className="text-[1.75rem] text-ink">Use the tokens</h2>
          <p className="mt-2 max-w-[48rem] text-sm leading-6 text-ink-2">Copy the CSS variables into your global stylesheet, then map them into the Tailwind theme.</p>
          <div className="mt-5">
            <CodeBlock
              code={cssTokens}
              tabs={[
                { label: "CSS variables", code: cssTokens },
                { label: "Tailwind theme (CSS)", code: tailwind },
              ]}
            />
          </div>
        </section>
      </article>
      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
        <Toc
          items={[
            { id: "brand", label: "Primary brand palette" },
            { id: "supporting", label: "Supporting colors" },
            { id: "blue", label: "Blue scale" },
            { id: "neutral", label: "Neutral scale" },
            { id: "contrast", label: "Contrast checks" },
            { id: "status", label: "Status colors" },
            { id: "tokens", label: "Use the tokens" },
          ]}
        />
      </aside>
    </div>
  );
}
