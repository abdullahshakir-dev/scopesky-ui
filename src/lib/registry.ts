import { categories, components as written } from "./components-data";
import { describeProp } from "./prop-descriptions";
import propsData from "./props-data.json";
import { componentName } from "./source-map";
import type { ComponentDoc, PropDoc } from "./types";

type GenProp = { name: string; type: string; default: string; required: boolean; description: string };
const generated = propsData as Record<string, GenProp[]>;

/**
 * The written docs (usage, accessibility, keyboard) plus what the code says:
 * the export name and the real props of the @scopesky/ui component.
 */
const components: ComponentDoc[] = written.map((doc) => {
  const name = componentName(doc.slug);
  if (!name) return { ...doc, props: [] };
  const props: PropDoc[] = (generated[name] ?? []).map((p) => ({
    name: p.name + (p.required ? "" : "?"),
    type: p.type,
    default: p.default,
    description: describeProp(name, p.name, p.description || doc.props.find((o) => o.name === p.name)?.description),
  }));
  return { ...doc, exports: [name], props, propsNote: "Read from the component's TypeScript. Props marked ? are optional; other HTML attributes pass through where the component renders a native element." };
});

export { categories, components };

export const categorySlug = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function getComponent(slug: string): ComponentDoc | undefined {
  return components.find((c) => c.slug === slug);
}

export function byCategory() {
  return categories.map((category) => ({
    category,
    items: components.filter((c) => c.category === category),
  }));
}

export function neighbours(slug: string) {
  const sorted = [...components].sort((a, b) => a.name.localeCompare(b.name));
  const i = sorted.findIndex((c) => c.slug === slug);
  return { prev: sorted[i - 1], next: sorted[i + 1] };
}

export const alphabetical = () => [...components].sort((a, b) => a.name.localeCompare(b.name));

export const patterns = [
  { slug: "sign-in", name: "Sign-in", description: "Bilingual sign-in with phone or email, shown right to left in Arabic." },
  { slug: "data-view", name: "Data view", description: "Filterable record list with toolbar, status tags, pagination and a details sheet." },
  { slug: "request-form", name: "Request form", description: "A service request form using form groups, file upload and inline validation." },
  { slug: "empty-states", name: "Empty states", description: "What to show when a list has no records yet, or a search finds nothing." },
];
