import type { Metadata } from "next";
import { PageHeader } from "@/components/docs/doc-parts";
import { IconGrid } from "@/components/docs/icon-grid";

export const metadata: Metadata = { title: "Icons" };

export default function IconsPage() {
  return (
    <div className="w-full px-5 py-10 sm:px-10 lg:py-14">
      <PageHeader
        eyebrow={<span className="font-semibold text-eyebrow">Foundations</span>}
        title="Icons"
        lead="Line icons on a 24px grid with a 2px stroke. Each one is a standalone SVG file in packages/ui/icons, built into @scopesky/ui, and takes the current text color. Click an icon to copy its usage."
      />
      <div className="mt-10">
        <IconGrid />
      </div>
    </div>
  );
}
