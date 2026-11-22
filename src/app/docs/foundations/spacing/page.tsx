import type { Metadata } from "next";
import { PageHeader } from "@/components/docs/doc-parts";
import { spacing } from "@/lib/tokens";

export const metadata: Metadata = { title: "Spacing and shape" };

const radii = [
  { name: "Small", px: 6, use: "Kbd, inline code, checkboxes" },
  { name: "Medium", px: 8, use: "Menu items, nav rows, small icon buttons" },
  { name: "Box (rounded-box)", px: 10, use: "Buttons, fields, cards, tables, menus, the app shell" },
  { name: "Large", px: 12, use: "Modals, dialogs, command menu" },
  { name: "Full", px: 999, use: "Avatars, pills, switches" },
];

export default function SpacingPage() {
  return (
    <div className="w-full px-5 py-10 sm:px-10 lg:py-14">
      <PageHeader eyebrow={<span className="font-semibold text-eyebrow">Foundations</span>} title="Spacing and shape" lead="A 2px-based spacing scale and one main corner radius, 10px, used by every control and panel." />

      <section className="mt-14">
        <h2 className="text-[1.75rem] text-ink">Spacing scale</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {spacing.map((s) => (
            <li key={s.token} className="grid grid-cols-[8rem_3rem_1fr] items-center gap-4 text-sm">
              <code className="font-mono text-[13px] text-ink">{s.token}</code>
              <span className="tabular-nums text-ink-2">{s.px}px</span>
              <span className="h-4 bg-accent" style={{ width: s.px * 3 }} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-[1.75rem] text-ink">Corner radius</h2>
        <p className="mt-2 text-sm text-ink-2">Use rounded-box (10px) by default. Go smaller only for parts that sit inside a rounded container.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col gap-3">
              <div className="h-20 border-2 border-primary bg-tint" style={{ borderRadius: Math.min(r.px, 40) }} />
              <p className="text-sm font-semibold text-ink">
                {r.name} <span className="font-normal text-ink-2">{r.px === 999 ? "9999px" : `${r.px}px`}</span>
              </p>
              <p className="text-xs leading-5 text-ink-2">{r.use}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-[1.75rem] text-ink">Control heights</h2>
        <div className="mt-6 flex flex-wrap items-end gap-4">
          {[
            ["sm", 32],
            ["md", 40],
            ["lg", 48],
            ["xl", 64],
          ].map(([n, h]) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className="flex w-24 items-center justify-center bg-primary text-xs text-white" style={{ height: h as number }}>
                {h}px
              </div>
              <code className="font-mono text-xs text-ink-2">{n}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
