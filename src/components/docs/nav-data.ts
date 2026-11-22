import { alphabetical, patterns } from "@/lib/registry";

export interface NavLink {
  title: string;
  href: string;
}
export interface NavSection {
  title: string;
  icon: "house" | "lightbulb" | "palette" | "grid" | "template" | "history";
  href?: string;
  items?: NavLink[];
}

export const nav: NavSection[] = [
  { title: "Overview", icon: "house", href: "/" },
  { title: "Getting started", icon: "lightbulb", href: "/docs/getting-started" },
  {
    title: "Foundations",
    icon: "palette",
    items: [
      { title: "Colors", href: "/docs/foundations/colors" },
      { title: "Typography", href: "/docs/foundations/typography" },
      { title: "Spacing and shape", href: "/docs/foundations/spacing" },
      { title: "Icons", href: "/docs/foundations/icons" },
    ],
  },
  {
    title: "Components",
    icon: "grid",
    items: [
      { title: "All components", href: "/docs/components" },
      ...alphabetical().map((c) => ({ title: c.name, href: `/docs/components/${c.slug}`})),
    ],
  },
  {
    title: "Patterns",
    icon: "template",
    items: patterns.map((p) => ({ title: p.name, href: `/docs/patterns/${p.slug}` })),
  },
  { title: "Changelog", icon: "history", href: "/docs/changelog" },
];
