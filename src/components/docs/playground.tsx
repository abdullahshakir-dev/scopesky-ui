"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown, Languages, Maximize2, Minimize2, RotateCcw } from "@scopesky/ui/icons";
import { cn } from "@scopesky/ui/utils";
import type { ComponentDoc } from "@/lib/types";
import { sourceOf } from "@/lib/source-map";
import { CodeBlock } from "./code-block";
import { defaultValues, getDemo, hasDemo, type Control, type Values } from "./demos";
import { toJSX } from "./to-jsx";

export type UITheme = "white" | "g10" | "g90" | "g100";
const themes: { id: UITheme; label: string }[] = [
  { id: "white", label: "White" },
  { id: "g10", label: "Gray 10" },
  { id: "g90", label: "Gray 90" },
  { id: "g100", label: "Gray 100" },
];

/** Renders a demo inside a scoped preview theme and text direction. */
export function PreviewCanvas({
  slug,
  values,
  theme,
  rtl,
  className,
  compact,
}: {
  slug: string;
  values?: Values;
  theme: UITheme;
  rtl: boolean;
  className?: string;
  compact?: boolean;
}) {
  const demo = getDemo(slug);
  const v = values ?? defaultValues(demo);
  const ctx = useMemo(() => ({ ar: rtl, t: (en: string, ar: string) => (rtl ? ar : en) }), [rtl]);
  return (
    <div
      data-ui-theme={theme}
      dir={rtl ? "rtl" : "ltr"}
      lang={rtl ? "ar" : "en"}
      className={cn(
        "relative flex w-full bg-bg text-ink transition-colors",
        demo.layout === "start" ? "items-start justify-center" : demo.layout === "stretch" ? "items-center justify-stretch" : "items-center justify-center",
        compact ? "p-4" : "p-6 sm:p-10",
        className,
      )}
      style={compact ? undefined : { minHeight: demo.minH ?? 280 }}
    >
      {demo.render(v, ctx)}
    </div>
  );
}

function ControlField({ c, value, onChange }: { c: Control; value: string | boolean; onChange: (v: string | boolean) => void }) {
  const id = useId();
  const label = ("label" in c && c.label) || c.name;
  if (c.type === "boolean")
    return (
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-mono text-xs text-ink-2">
          {label}
        </label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", value ? "bg-primary" : "bg-line-2")}
        >
          <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-[inset-inline-start] duration-150", value ? "start-[18px]" : "start-0.5")} />
        </button>
      </div>
    );
  if (c.type === "select")
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="font-mono text-xs text-ink-2">
          {label}
        </label>
        <div className="relative">
          <select
            id={id}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-full appearance-none rounded-box border border-line-2 bg-bg ps-3 pe-9 text-sm text-ink hover:border-line-strong focus:outline-2 focus:outline-offset-0 focus:outline-focus"
          >
            {c.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
        </div>
      </div>
    );
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-xs text-ink-2">
        {label}
      </label>
      <input
        id={id}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-box border border-line-2 bg-bg px-3 text-sm text-ink hover:border-line-strong focus:outline-2 focus:outline-offset-0 focus:outline-focus"
      />
    </div>
  );
}

export function Playground({ doc }: { doc: ComponentDoc }) {
  const demo = getDemo(doc.slug);
  const defaults = useMemo(() => defaultValues(demo), [demo]);
  const [values, setValues] = useState<Values>(defaults);
  const [theme, setTheme] = useState<UITheme>("white");
  const [rtl, setRtl] = useState(false);
  const [key, setKey] = useState(0);
  const [wide, setWide] = useState(false);
  const controls = demo.controls ?? [];
  // The code is generated from the preview itself, in the language shown.
  const code = useMemo(() => {
    if (!hasDemo(doc.slug)) return sourceOf(doc.slug).importLine;
    const t = (en: string, ar: string) => (rtl ? ar : en);
    return toJSX(demo.render(values, { ar: rtl, t }));
  }, [demo, doc.slug, values, rtl]);
  const live = controls.length > 0;
  const changed = JSON.stringify(values) !== JSON.stringify(defaults) || theme !== "white" || rtl;

  const src = sourceOf(doc.slug);
  const installTab = `npm i @scopesky/ui

${src.importLine}
// Source: ${src.file}`;

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Preview" className="overflow-hidden rounded-box border border-line bg-bg">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
          <span className="me-auto text-sm font-semibold text-ink">Preview</span>
          <div role="radiogroup" aria-label="Preview theme" className="flex items-center rounded-box bg-layer p-0.5">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={theme === t.id}
                onClick={() => setTheme(t.id)}
                title={`${t.label} theme`}
                className={cn("flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs transition-colors", theme === t.id ? "bg-bg font-medium text-ink shadow-sm" : "text-ink-2 hover:text-ink")}
              >
                <span
                  aria-hidden
                  className="size-3 rounded-full border border-black/15"
                  style={{ background: t.id === "white" ? "#fff" : t.id === "g10" ? "#f4f7fa" : t.id === "g90" ? "#1e2125" : "#111" }}
                />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={rtl}
            onClick={() => setRtl(!rtl)}
            className={cn("inline-flex h-8 items-center gap-1.5 rounded-box border px-2.5 text-xs transition-colors", rtl ? "border-focus bg-tint text-ink" : "border-line text-ink-2 hover:text-ink")}
          >
            <Languages className="size-3.5" />
            Arabic / RTL
          </button>
          <button
            type="button"
            onClick={() => {
              setValues(defaults);
              setTheme("white");
              setRtl(false);
              setKey((k) => k + 1);
            }}
            disabled={!changed}
            className="inline-flex h-8 items-center gap-1.5 rounded-box px-2 text-xs text-link hover:bg-layer-hover disabled:text-placeholder disabled:hover:bg-transparent"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
          <button type="button" onClick={() => setWide(!wide)} aria-pressed={wide} aria-label={wide ? "Show properties panel" : "Hide properties panel"} title={wide ? "Show properties" : "Full width preview"} className="hidden size-8 items-center justify-center rounded-md text-ink-2 hover:bg-layer-hover hover:text-ink md:inline-flex">
            {wide ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
        <div className={cn("grid", !wide && controls.length > 0 && demo.layout !== "stretch" && "md:grid-cols-[1fr_15rem]")}>
          <div className="relative flex min-w-0">
            <PreviewCanvas key={key} slug={doc.slug} values={values} theme={theme} rtl={rtl} />
          </div>
          {!wide && controls.length > 0 && (
            <aside
              aria-label="Properties"
              className={cn(
                "gap-4 border-t border-line bg-layer/60 p-4",
                demo.layout === "stretch" ? "grid items-end sm:grid-cols-2 lg:grid-cols-4" : "flex flex-col md:border-s md:border-t-0",
              )}
            >
              <p className={cn("text-sm font-semibold text-ink", demo.layout === "stretch" && "col-span-full")}>Properties</p>
              {controls.map((c) => (
                <ControlField key={c.name} c={c} value={values[c.name]} onChange={(nv) => setValues((p) => ({ ...p, [c.name]: nv }))} />
              ))}
              {controls.some((c) => c.name === "withIcon") && <p className="text-xs text-ink-3">“With icon” is a demo switch, not a component prop.</p>}
            </aside>
          )}
        </div>
      </section>

      <section aria-labelledby="code-h" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="code-h" className="text-xl text-ink">
            Code
          </h2>
          <p className="text-xs text-ink-2">{live ? "Updates as you change properties · " : ""}React + @scopesky/ui</p>
        </div>
        <CodeBlock
          code={code}
          tabs={[
            { label: "Usage (TSX)", code },
            { label: "Import", code: installTab },
          ]}
        />
      </section>
    </div>
  );
}
