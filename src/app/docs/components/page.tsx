import type { Metadata } from "next";
import { Catalog } from "@/components/docs/catalog";
import { PageHeader } from "@/components/docs/doc-parts";
import { components } from "@/lib/registry";

export const metadata: Metadata = { title: "All components" };

export default function ComponentsPage() {
  return (
    <div className="w-full px-5 py-10 sm:px-10 lg:py-14">
      <PageHeader
        eyebrow={<span className="font-semibold text-eyebrow">Components</span>}
        title="All components"
        lead={`${components.length} hand-written components in React and Tailwind CSS, themed for ScopeSky and documented with live previews, properties, code and accessibility notes.`}
      />
      <div className="mt-10">
        <Catalog />
      </div>
    </div>
  );
}
