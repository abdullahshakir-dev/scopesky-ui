"use client";

import { forwardRef, useEffect, useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Check, Copy } from "./icons.js";
import { cn, copyText, normalizeOptions, type SelectOption } from "./utils.js";
import { useControllableState } from "./hooks.js";
import { useMessages } from "./locale.js";

export type ButtonKind =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "danger"
  | "danger--tertiary"
  | "danger--ghost";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

const kinds: Record<ButtonKind, string> = {
  primary: "bg-primary text-on-color hover:bg-primary-hover active:bg-primary-active",
  secondary: "bg-[#475569] text-white hover:bg-[#334155] active:bg-[#1e293b] dark:bg-[#64748b] dark:hover:bg-[#475569]",
  tertiary:
    "border border-primary text-link bg-bg hover:bg-tint active:bg-tint-2",
  ghost: "text-link bg-transparent hover:bg-tint active:bg-tint-2",
  danger: "bg-danger-strong text-white hover:bg-[#a2191f] active:bg-[#750e13]",
  "danger--tertiary":
    "border border-danger text-danger bg-transparent hover:bg-danger-strong hover:text-white hover:border-danger-strong",
  "danger--ghost": "text-danger bg-transparent hover:bg-danger-strong hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 text-[13px]",
  md: "h-10 text-sm",
  lg: "h-12 text-sm",
  xl: "h-16 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ButtonKind;
  size?: ButtonSize;
  icon?: ReactNode;
  iconOnly?: boolean;
  full?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { kind = "primary", size = "lg", icon, iconOnly, full, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-between whitespace-nowrap rounded-box font-medium text-start transition-colors duration-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-layer-selected disabled:text-placeholder disabled:opacity-100",
        kinds[kind],
        sizes[size],
        iconOnly ? (size === "sm" ? "w-8 justify-center" : size === "md" ? "w-10 justify-center" : "w-12 justify-center") : icon ? "gap-4 px-4" : "justify-center px-6",
        full && "w-full",
        className,
      )}
      aria-label={iconOnly && typeof children === "string" ? children : rest["aria-label"]}
      title={iconOnly && typeof children === "string" ? children : rest.title}
      {...rest}
    >
      {iconOnly ? icon : (
        <>
          <span>{children}</span>
          {icon && <span className="inline-flex size-4 items-center justify-center [&>svg]:size-4">{icon}</span>}
        </>
      )}
    </button>
  );
});

export interface ButtonGroupProps {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  className?: string;
}

export function ButtonGroup({ options, value, defaultValue, onValueChange, label, className }: ButtonGroupProps) {
  const opts = normalizeOptions(options);
  const [v, setV] = useControllableState(value, defaultValue ?? opts[0]?.value ?? "", onValueChange);
  return (
    <div role="group" aria-label={label} className={cn("inline-flex overflow-hidden rounded-box border border-line-2", className)}>
      {opts.map((o, i) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={v === o.value}
          disabled={o.disabled}
          onClick={() => setV(o.value)}
          className={cn(
            "h-9 px-4 text-sm transition-colors focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:text-placeholder",
            i > 0 && "border-s border-line-2",
            v === o.value ? "bg-inverse text-inverse-ink" : "bg-bg text-ink hover:bg-layer-hover",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export interface ToggleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Accessible name and tooltip; the button usually shows only an icon. */
  label: string;
  children: ReactNode;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { pressed, defaultPressed = false, onPressedChange, label, children, className, ...rest },
  ref,
) {
  const [p, setP] = useControllableState(pressed, defaultPressed, onPressedChange);
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={p}
      aria-label={label}
      title={label}
      onClick={() => setP(!p)}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-box border transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:size-4",
        p ? "border-primary bg-tint text-primary" : "border-line-2 bg-bg text-ink hover:bg-layer-hover",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

export function CopyButton({ value, label, onCopy, className }: { value: string; label?: string; onCopy?: (ok: boolean) => void; className?: string }) {
  const m = useMessages();
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const name = done ? m.copied : (label ?? m.copy);
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(value);
        onCopy?.(ok);
        if (!ok) return;
        setDone(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setDone(false), 1600);
      }}
      aria-label={name}
      title={name}
      className={cn("relative inline-flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-layer-hover hover:text-ink", className)}
    >
      {done ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      <span aria-live="polite" className="sr-only">
        {done ? m.copied : ""}
      </span>
    </button>
  );
}

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  inline?: boolean;
  icon?: ReactNode;
}

/** A styled <a>. Every anchor prop (href, target, onClick, ref …) passes through. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ inline, icon, className, children, ...rest }, ref) {
  return (
    <a
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 text-sm text-link hover:text-link-hover hover:underline active:underline",
        inline && "underline",
        className,
      )}
      {...rest}
    >
      {children}
      {icon && <span className="[&>svg]:size-4">{icon}</span>}
    </a>
  );
});
