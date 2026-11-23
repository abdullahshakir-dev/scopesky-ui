"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * State that works both ways: controlled when `value` is defined, uncontrolled
 * (starting from `defaultValue`) otherwise. `onChange` fires on every change
 * made through the setter, in both modes.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const v = typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      if (Object.is(v, current)) return;
      if (!controlled) setInner(v);
      onChange?.(v);
    },
    [controlled, current, onChange],
  );
  return [current, set];
}

/** Calls `onAway` when a pointer goes down outside `ref`, or Escape is pressed. */
export function useDismiss<T extends HTMLElement>(open: boolean, onAway: () => void): RefObject<T | null> {
  const ref = useRef<T>(null);
  const cb = useRef(onAway);
  useEffect(() => {
    cb.current = onAway;
  });
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cb.current();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return ref;
}

/** Keeps Tab focus inside `ref` while active, and focuses the first match of `initial`. */
export function useFocusTrap<T extends HTMLElement>(active: boolean, initial?: string): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const sel = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
    const first = (initial && root.querySelector<HTMLElement>(initial)) || root.querySelector<HTMLElement>(sel);
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(sel));
      if (!items.length) return;
      const a = items[0];
      const z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [active, initial]);
  return ref;
}
