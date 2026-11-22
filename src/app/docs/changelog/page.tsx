import type { Metadata } from "next";
import { PageHeader } from "@/components/docs/doc-parts";

export const metadata: Metadata = { title: "Changelog" };

const releases = [
  {
    version: "2.0.0",
    date: "22 November 2026",
    notes: [
      "Redesigned the app to the ScopeSky UI design board: floating header, sidebar and content panels on a grey canvas.",
      "Every component is now hand-written React and Tailwind CSS with one 10px corner radius (rounded-box). No UI libraries.",
      "Replaced the icon package with our own SVG files, drawn with <Icon>.",
      "Packaged the components as @scopesky/ui so any project can install them with npm.",
      "Code examples are now generated from each live preview, and Properties tables are read from the components' TypeScript.",
      "New type: Geist for Latin, Readex Pro for Arabic, Geist Mono for code.",
    ],
  },
  {
    version: "1.3.0",
    date: "9 November 2026",
    notes: ["Added 30 shadcn/ui components, from Alert dialog to Trace.", "Added the Conversation category: Bubble, Marker, Message, Message scroller and Trace.", "Every preview can now switch to Arabic copy."],
  },
  {
    version: "1.2.0",
    date: "12 October 2026",
    notes: ["Added grey and sky data table sheets with zebra, hover, selected and pressed rows.", "Added Gray 150, 250, 300 and 550 for table states.", "Gray 500 now passes 3:1 for input borders."],
  },
  {
    version: "1.1.0",
    date: "3 September 2026",
    notes: ["Added the Sign-in and Data view patterns, in English and Arabic.", "Added contrast checks to the Colors page."],
  },
  {
    version: "1.0.0",
    date: "18 August 2026",
    notes: ["First release: 50 Carbon components themed in ScopeSky blue."],
  },
];

export default function Changelog() {
  return (
    <div className="w-full px-5 py-10 sm:px-10 lg:py-14">
      <PageHeader title="Changelog" lead="What changed in each release of ScopeSky UI. These entries are placeholders until the first tagged release." />
      <ol className="mt-12 flex flex-col gap-10">
        {releases.map((r) => (
          <li key={r.version} className="grid gap-3 sm:grid-cols-[9rem_1fr]">
            <div>
              <p className="font-mono text-sm text-ink">v{r.version}</p>
              <p className="text-xs text-ink-2">{r.date}</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm leading-6 text-ink">
              {r.notes.map((n) => (
                <li key={n} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-line-strong" />
                  {n}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
