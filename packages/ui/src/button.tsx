"use client";

import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Check, Copy } from "./icons.js";
import { cn, copyText } from "./utils.js";

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

export function ButtonGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex overflow-hidden rounded-box border border-line-2">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "h-9 px-4 text-sm transition-colors focus-visible:outline-offset-[-2px]",
            i > 0 && "border-s border-line-2",
            value === o ? "bg-inverse text-inverse-ink" : "bg-bg text-ink hover:bg-layer-hover",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function ToggleButton({
  pressed,
  onPressedChange,
  label,
  children,
}: {
  pressed: boolean;
  onPressedChange: (p: boolean) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-box border transition-colors [&>svg]:size-4",
        pressed ? "border-primary bg-tint text-primary" : "border-line-2 bg-bg text-ink hover:bg-layer-hover",
      )}
    >
      {children}
    </button>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await copyText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      aria-label={done ? "Copied" : label}
      title={done ? "Copied" : label}
      className="relative inline-flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-layer-hover hover:text-ink"
    >
      {done ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      <span aria-live="polite" className="sr-only">
        {done ? "Copied" : ""}
      </span>
    </button>
  );
}

export function Link({ href = "#", children, inline, icon, onClick }: { href?: string; children: ReactNode; inline?: boolean; icon?: ReactNode; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (href === "#") e.preventDefault();
        onClick?.();
      }}
      className={cn(
        "inline-flex items-center gap-1 text-sm text-link hover:text-link-hover hover:underline active:underline",
        inline && "underline",
      )}
    >
      {children}
      {icon && <span className="[&>svg]:size-4">{icon}</span>}
    </a>
  );
}
