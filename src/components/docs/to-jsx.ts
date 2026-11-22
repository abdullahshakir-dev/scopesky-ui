/**
 * Turns the element tree a demo renders into the JSX a developer would write,
 * with the matching @scopesky/ui imports. Because it reads the real preview,
 * the Code tab always shows our components and current props, never stale examples.
 */
import { Fragment, isValidElement, type ReactElement, type ReactNode } from "react";
import * as button from "@scopesky/ui/button";
import * as conversation from "@scopesky/ui/conversation";
import * as data from "@scopesky/ui/data";
import * as feedback from "@scopesky/ui/feedback";
import * as fields from "@scopesky/ui/fields";
import * as navigation from "@scopesky/ui/navigation";
import * as overlays from "@scopesky/ui/overlays";
import * as icons from "@scopesky/ui/icons";
import propsData from "@/lib/props-data.json";

// Component functions are minified in production builds, so map them back to
// their export name by reference.
const modules: [string, Record<string, unknown>][] = [
  ["@scopesky/ui/button", button],
  ["@scopesky/ui/fields", fields],
  ["@scopesky/ui/feedback", feedback],
  ["@scopesky/ui/navigation", navigation],
  ["@scopesky/ui/data", data],
  ["@scopesky/ui/overlays", overlays],
  ["@scopesky/ui/conversation", conversation],
  ["@scopesky/ui/icons", icons],
];
const origins = new Map<unknown, { name: string; module: string }>();
for (const [module, ns] of modules) {
  for (const [name, value] of Object.entries(ns)) {
    if (/^[A-Z]/.test(name) && value && !origins.has(value)) origins.set(value, { name, module });
  }
}

// Prop defaults as written in the components ("md", true …), so the snippet can leave them out.
const defaults = new Map<string, Map<string, string>>(
  Object.entries(propsData as Record<string, { name: string; default: string }[]>).map(([component, props]) => [
    component,
    new Map(props.filter((p) => p.default).map((p) => [p.name, p.default.replace(/'/g, '"')])),
  ]),
);

const INDENT = "  ";
const WIDTH = 92;
/** Render props are called with this key; it prints as {...props}. */
const SPREAD = "__spread_props__";
/** Handlers with a parameter get this as the value, so we can see where it goes. */
const PROBE = { __probe: true };
/** Controlled props worth printing even when false. */
const CONTROLLED = new Set(["open", "checked", "pressed", "selected"]);

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const isIdent = (k: string) => /^[a-zA-Z_$][\w$]*$/.test(k);

interface Hook {
  name: string;
  initial: unknown;
  setter: (v: unknown) => void;
  calls: unknown[];
}

class Writer {
  used = new Map<string, Set<string>>();
  hooks: Hook[] = [];

  typeName(type: ReactElement["type"]): string {
    if (typeof type === "string") return type;
    const hit = origins.get(type);
    if (hit) {
      if (!this.used.has(hit.module)) this.used.set(hit.module, new Set());
      this.used.get(hit.module)!.add(hit.name);
      return hit.name;
    }
    const t = type as { displayName?: string; name?: string };
    return t.displayName ?? (t.name && t.name.length > 2 ? t.name : "Component");
  }

  /** Print a callback: setters by name, render props as JSX, closures by what they set. */
  fn(f: (...a: unknown[]) => unknown, depth: number): string {
    const own = this.hooks.find((h) => h.setter === f);
    if (own) return `set${cap(own.name)}`;
    for (const h of this.hooks) h.calls = [];
    let result: unknown;
    try {
      result = f.length > 0 ? f({ ...PROBE, [SPREAD]: true }) : f();
    } catch {
      /* handlers that need a real event; nothing to learn */
    }
    if (isValidElement(result)) return `(props) => (\n${this.element(result, depth + 1)}\n${INDENT.repeat(depth)})`;

    const hit = this.hooks.find((h) => h.calls.length);
    if (!hit) return f.length > 0 ? "(value) => {}" : "() => {}";
    const set = `set${cap(hit.name)}`;
    const arg = hit.calls[0];
    if (f.length === 0) return `() => ${set}(${this.literal(arg)})`;
    // (value) => setChecked({ ...checked, email: value })
    if (arg && typeof arg === "object" && !Array.isArray(arg) && !("__probe" in arg)) {
      const changed = Object.entries(arg).filter(([, v]) => v && typeof v === "object" && "__probe" in v);
      if (changed.length === 1) return `(value) => ${set}({ ...${hit.name}, ${changed[0][0]}: value })`;
    }
    return set;
  }

  literal(v: unknown): string {
    if (v === undefined) return "undefined";
    if (v && typeof v === "object" && "__probe" in v) return "value";
    return JSON.stringify(v);
  }

  /** Any JS value inside braces: arrays, objects, elements, callbacks. */
  value(v: unknown, depth: number): string {
    if (isValidElement(v)) return this.element(v, depth).trimStart();
    if (typeof v === "function") return this.fn(v as () => unknown, depth);
    if (Array.isArray(v)) return this.wrap("[", "]", v.map((x) => this.value(x, depth + 1)), depth);
    if (v && typeof v === "object" && !("__probe" in v)) {
      const parts = Object.entries(v)
        .filter(([, x]) => x !== undefined && x !== false)
        .map(([k, x]) => `${isIdent(k) ? k : JSON.stringify(k)}: ${this.value(x, depth + 1)}`);
      return this.wrap("{ ", " }", parts, depth);
    }
    return this.literal(v);
  }

  wrap(open: string, close: string, parts: string[], depth: number) {
    const one = `${open}${parts.join(", ")}${close}`;
    if (!one.includes("\n") && one.length + depth * 2 <= WIDTH) return one;
    const pad = INDENT.repeat(depth + 1);
    return `${open.trim()}\n${parts.map((p) => pad + p).join(",\n")},\n${INDENT.repeat(depth)}${close.trim()}`;
  }

  attr(key: string, v: unknown, depth: number, component: string): string | null {
    if (key === SPREAD) return "{...props}";
    if (key === "__probe" || v === undefined || v === null) return null;
    // A controlled boolean that comes from the demo's state: open={open}
    const hook = CONTROLLED.has(key) && typeof v === "boolean" && this.hooks.find((h) => typeof h.initial === "boolean" && h.initial === v);
    if (hook) return `${key}={${hook.name}}`;
    if (v === false) return CONTROLLED.has(key) ? `${key}={false}` : null;
    const def = defaults.get(component)?.get(key);
    if (def !== undefined && (typeof v === "string" ? JSON.stringify(v) : String(v)) === def) return null;
    if (v === true) return key;
    if (typeof v === "string") return `${key}=${JSON.stringify(v)}`;
    return `${key}={${this.value(v, depth + 1)}}`;
  }

  nodes(c: ReactNode, depth: number): string[] {
    const out: (string | { text: string })[] = [];
    const walk = (n: ReactNode) => {
      if (n === null || n === undefined || typeof n === "boolean" || n === "") return;
      if (Array.isArray(n)) return n.forEach(walk);
      if (typeof n === "string" || typeof n === "number") {
        const last = out[out.length - 1];
        if (last && typeof last === "object") last.text += String(n);
        else out.push({ text: String(n) });
        return;
      }
      if (isValidElement(n)) {
        const el = n as ReactElement<{ children?: unknown; initial?: unknown; name?: string }>;
        if (el.type === Fragment) return walk(el.props.children as ReactNode);
        // A demo's <State name initial>{(value, set) => …}</State> becomes a useState hook.
        if (typeof el.props.children === "function" && "initial" in el.props) {
          const hook: Hook = { name: el.props.name ?? "value", initial: el.props.initial, calls: [], setter: () => {} };
          hook.setter = (x: unknown) => void hook.calls.push(x);
          this.hooks.push(hook);
          return walk((el.props.children as (v: unknown, s: unknown) => ReactNode)(hook.initial, hook.setter));
        }
        out.push(this.element(el, depth));
      }
    };
    walk(c);
    return out
      .map((s) => {
        if (typeof s === "string") return s;
        const text = s.text.replace(/\s+/g, " ").trim();
        if (!text) return "";
        return INDENT.repeat(depth) + (/[{}<>]/.test(text) ? `{${JSON.stringify(text)}}` : text);
      })
      .filter(Boolean);
  }

  element(el: ReactElement, depth: number): string {
    const pad = INDENT.repeat(depth);
    const props = (el.props ?? {}) as Record<string, unknown>;
    const kids = this.nodes(props.children as ReactNode, depth + 1);
    if (el.type === Fragment) return `${pad}<>\n${kids.join("\n")}\n${pad}</>`;

    const name = this.typeName(el.type);
    const attrs = Object.entries(props)
      .filter(([k]) => k !== "children")
      .map(([k, v]) => this.attr(k, v, depth, name))
      .filter((a): a is string => a !== null);

    const inline = attrs.length ? " " + attrs.join(" ") : "";
    const tall = inline.includes("\n") || pad.length + name.length + inline.length + 3 > WIDTH;
    const open = tall ? `<${name}\n${attrs.map((a) => INDENT.repeat(depth + 1) + a).join("\n")}\n${pad}` : `<${name}${inline}`;

    if (!kids.length) return `${pad}${open}${tall ? "/>" : " />"}`;
    if (kids.length === 1 && !tall && !kids[0].includes("\n")) {
      const one = `${pad}${open}>${kids[0].trim()}</${name}>`;
      if (one.length <= WIDTH + 16) return one;
    }
    return `${pad}${open}>\n${kids.join("\n")}\n${pad}</${name}>`;
  }

  imports(): string {
    const lines = this.hooks.length ? [`import { useState } from "react";`] : [];
    for (const [module] of modules) {
      const names = this.used.get(module);
      if (names?.size) lines.push(`import { ${[...names].sort().join(", ")} } from "${module}";`);
    }
    return lines.join("\n");
  }
}

/** JSX + imports for what a demo renders. Demos with local state become a small component. */
export function toJSX(node: ReactNode): string {
  // First pass: how many top-level elements, and is there state?
  const probe = new Writer();
  const multi = probe.nodes(node, 0).length > 1;
  const base = probe.hooks.length ? 2 : 0;

  const w = new Writer();
  const lines = w.nodes(node, base + (multi ? 1 : 0));
  const pad = INDENT.repeat(base);
  const body = (multi ? [`${pad}<>`, ...lines, `${pad}</>`] : lines).join("\n");
  if (!w.hooks.length) return `${w.imports()}\n\n${body}`.trim();

  const hooks = w.hooks.map((h) => `  const [${h.name}, set${cap(h.name)}] = useState(${JSON.stringify(h.initial)});`).join("\n");
  return `${w.imports()}\n\nexport function Example() {\n${hooks}\n\n  return (\n${body}\n  );\n}`;
}
