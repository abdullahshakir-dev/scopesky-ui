"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@scopesky/ui/icons";

export const themeScript = `(function(){try{var t=localStorage.getItem("ss-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
};
const get = () => document.documentElement.getAttribute("data-theme") ?? "light";

export function useSiteTheme() {
  return useSyncExternalStore(subscribe, get, () => "light");
}

export function ThemeToggle() {
  const theme = useSiteTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem("ss-theme", next);
        } catch {}
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="inline-flex size-9 items-center justify-center rounded-lg text-ink-2 hover:bg-layer-hover hover:text-ink"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
