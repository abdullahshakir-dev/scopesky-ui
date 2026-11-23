import type { Metadata } from "next";
import { PageHeader } from "@/components/docs/doc-parts";
import { typeScale } from "@/lib/tokens";

export const metadata: Metadata = { title: "Typography" };

export default function TypographyPage() {
  return (
    <div className="w-full px-5 py-10 sm:px-10 lg:py-14">
      <PageHeader
        eyebrow={<span className="font-semibold text-eyebrow">Foundations</span>}
        title="Typography"
        lead="IBM Plex Sans Arabic for Arabic and Latin, Geist Mono for code. Headings stay light and large; weight is saved for labels and emphasis."
      />

      <section className="mt-14 grid gap-px overflow-hidden rounded-box bg-line sm:grid-cols-2">
        <div className="bg-layer p-8">
          <p className="text-xs text-ink-2">Latin</p>
          <p className="mt-4 text-6xl font-light text-ink">Aa Bb 0123</p>
          <p className="mt-4 text-sm leading-6 text-ink-2">The quick fiber line reached every school in the district before winter.</p>
        </div>
        <div className="bg-layer p-8" dir="rtl" lang="ar">
          <p className="text-xs text-ink-2">العربية</p>
          <p className="mt-4 text-6xl font-light text-ink">أ ب ج ٠١٢٣</p>
          <p className="mt-4 text-sm leading-7 text-ink-2">وصل خط الألياف السريع إلى كل مدارس المنطقة قبل الشتاء.</p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-[1.75rem] text-ink">Type scale</h2>
        <p className="mt-2 text-sm text-ink-2">Sizes and line heights in pixels. Keep body text at 14px or larger and lines under 80 characters.</p>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {typeScale.map((t) => (
            <li key={t.token} className="grid gap-3 py-6 md:grid-cols-[12rem_1fr] md:items-baseline">
              <div className="flex flex-col gap-0.5">
                <code className="font-mono text-[13px] text-ink">{t.token}</code>
                <span className="text-xs text-ink-2">
                  {t.size} / {t.line} · {t.weight === 600 ? "SemiBold" : "Regular"} · {t.use}
                </span>
              </div>
              <p className="min-w-0 truncate text-ink" style={{ fontSize: t.size, lineHeight: `${t.line}px`, fontWeight: t.weight, fontFamily: t.token.startsWith("code") ? "var(--font-mono)" : undefined }}>
                {t.sample}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-box border-t-[3px] border-success bg-layer p-5">
          <h3 className="text-base font-semibold text-ink">Do</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-ink">
            <li>Use sentence case for titles, buttons and labels.</li>
            <li>Give Arabic body text a little more line height (1.75).</li>
            <li>Use tabular figures in tables so numbers line up.</li>
          </ul>
        </div>
        <div className="rounded-box border-t-[3px] border-danger bg-layer p-5">
          <h3 className="text-base font-semibold text-ink">Don’t</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-ink">
            <li>Set whole labels in capitals: Arabic has no case, so they will not match.</li>
            <li>Use italics in Arabic. Use weight for emphasis instead.</li>
            <li>Go below 12px, even for helper text.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
