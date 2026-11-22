"use client";

import { useState } from "react";
import { Icon, iconNames, Search } from "@scopesky/ui/icons";
import { copyText } from "@scopesky/ui/utils";

export function IconGrid() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState("");
  const list = iconNames.filter((n) => n.includes(q.trim().toLowerCase()));
  return (
    <div>
      <label className="flex h-10 max-w-sm items-center rounded-box border border-line-2 bg-bg px-3 focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-focus">
        <Search className="size-4 text-ink-2" />
        <span className="sr-only">Filter icons</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter icons" className="h-full flex-1 bg-transparent px-2 text-sm text-ink placeholder:text-placeholder focus:outline-none" />
      </label>
      <p className="mt-3 h-5 text-sm text-ink-2" aria-live="polite">
        {copied ? `Copied <Icon name="${copied}" />` : `${list.length} icons`}
      </p>
      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {list.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={async () => {
                await copyText(`<Icon name="${n}" />`);
                setCopied(n);
                setTimeout(() => setCopied(""), 1400);
              }}
              className="flex h-24 w-full flex-col items-center justify-center gap-2.5 rounded-box border border-line bg-bg text-ink transition-colors hover:border-line-2 hover:bg-layer"
            >
              <Icon name={n} className="size-5" />
              <span className="max-w-full truncate px-2 text-[11px] text-ink-2">{n}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
