"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  Eye,
  EyeOff,
  Minus,
  Plus,
  Search as SearchIcon,
  Upload,
  X,
} from "./icons.js";
import { cn, normalizeOptions, type NormalizedOption, type SelectOption } from "./utils.js";
import { useControllableState, useDismiss } from "./hooks.js";
import { formatBytes, useMessages } from "./locale.js";

/* ---------- shared field chrome ---------- */

export type FieldSize = "sm" | "md" | "lg";
const h: Record<FieldSize, string> = { sm: "h-8", md: "h-10", lg: "h-12" };

function assignRef<T>(r: Ref<T> | undefined, el: T | null) {
  if (typeof r === "function") r(el);
  else if (r) (r as { current: T | null }).current = el;
}

/** Sets several refs (a forwarded one and a local one) to the same element. */
function useMergedRef<T>(...refs: (Ref<T> | undefined)[]) {
  const list = useRef(refs);
  useEffect(() => {
    list.current = refs;
  });
  return useCallback((el: T | null) => list.current.forEach((r) => assignRef(r, el)), []);
}

export interface FieldShellProps {
  id: string;
  label?: ReactNode;
  helper?: ReactNode;
  invalid?: ReactNode;
  warn?: ReactNode;
  disabled?: boolean;
  counter?: ReactNode;
  children: ReactNode;
  hideLabel?: boolean;
  className?: string;
}

/** Label, helper / error text and spacing around a field. Use it to build your own fields. */
export function FieldShell({ id, label, helper, invalid, warn, disabled, counter, children, hideLabel, className }: FieldShellProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", disabled && "opacity-60", className)}>
      {(label || counter) && (
        <div className={cn("flex items-baseline justify-between", hideLabel && "sr-only")}>
          {label && (
            <label htmlFor={id} className="text-xs text-ink-2">
              {label}
            </label>
          )}
          {counter && <span className="text-xs text-ink-2">{counter}</span>}
        </div>
      )}
      {children}
      {invalid ? (
        <p id={`${id}-msg`} className="text-xs text-danger-text">
          {invalid}
        </p>
      ) : warn ? (
        <p id={`${id}-msg`} className="text-xs text-ink">
          {warn}
        </p>
      ) : helper ? (
        <p id={`${id}-msg`} className="text-xs text-ink-2">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

const fieldBox = (invalid?: boolean, warn?: boolean) =>
  cn(
    "relative flex w-full items-center rounded-box border bg-field text-sm text-ink transition-colors",
    "focus-within:border-focus focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-focus",
    invalid
      ? "border-danger outline-2 outline-offset-[-2px] outline-danger"
      : warn
        ? "border-warning-strong"
        : "border-line-2 hover:border-line-strong",
  );

const inputCls =
  "h-full w-full min-w-0 bg-transparent px-4 text-sm text-ink placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed";

const describedBy = (id: string, ...msgs: unknown[]) => (msgs.some(Boolean) ? `${id}-msg` : undefined);

/* ---------- text ---------- */

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  helper?: ReactNode;
  /** Error text. Shows the field in its error state. */
  invalid?: ReactNode;
  /** Warning text. */
  warn?: ReactNode;
  size?: FieldSize;
  hideLabel?: boolean;
  trailing?: ReactNode;
  leading?: ReactNode;
}

/** A text field. Every native input prop (value, onChange, name, ref …) passes through to the <input>. */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, helper, invalid, warn, size = "md", hideLabel, trailing, leading, id: idProp, className, ...rest },
  ref,
) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} warn={warn} disabled={rest.disabled} hideLabel={hideLabel} className={className}>
      <div className={cn(fieldBox(!!invalid, !!warn), h[size])}>
        {leading && <span className="ps-3 text-ink-2 [&>svg]:size-4">{leading}</span>}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!invalid || undefined}
          aria-describedby={describedBy(id, invalid, warn, helper)}
          className={cn(inputCls, !!leading && "ps-2")}
          {...rest}
        />
        {!!invalid && <CircleAlert aria-hidden className="me-3 size-4 shrink-0 text-danger" />}
        {!invalid && !!warn && <AlertTriangle aria-hidden className="me-3 size-4 shrink-0 fill-warning text-ink" />}
        {trailing}
      </div>
    </FieldShell>
  );
});

export const PasswordInput = forwardRef<HTMLInputElement, Omit<TextInputProps, "type" | "trailing">>(function PasswordInput(props, ref) {
  const m = useMessages();
  const [show, setShow] = useState(false);
  return (
    <TextInput
      {...props}
      ref={ref}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={props.disabled}
          aria-label={show ? m.hidePassword : m.showPassword}
          title={show ? m.hidePassword : m.showPassword}
          className="flex h-full w-10 shrink-0 items-center justify-center text-ink-2 hover:text-ink focus-visible:outline-offset-[-2px]"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
});

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  helper?: ReactNode;
  invalid?: ReactNode;
  hideLabel?: boolean;
  /** Shows a "12/300" counter and limits the length. */
  maxCount?: number;
}

/** A multi-line text field. Works controlled (value + onChange) or uncontrolled (defaultValue). */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, helper, invalid, hideLabel, maxCount, value, defaultValue, onChange, id: idProp, className, ...rest },
  ref,
) {
  const auto = useId();
  const id = idProp ?? auto;
  const [len, setLen] = useState(() => String(defaultValue ?? "").length);
  const count = value !== undefined && value !== null ? String(value).length : len;
  return (
    <FieldShell
      id={id}
      label={label}
      helper={helper}
      invalid={invalid}
      hideLabel={hideLabel}
      disabled={rest.disabled}
      className={className}
      counter={maxCount ? `${count}/${maxCount}` : undefined}
    >
      <div className={cn(fieldBox(!!invalid), "items-start")}>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          maxLength={maxCount}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            setLen(e.target.value.length);
            onChange?.(e);
          }}
          aria-invalid={!!invalid || undefined}
          aria-describedby={describedBy(id, invalid, helper)}
          className="w-full resize-y bg-transparent px-4 py-3 text-sm text-ink placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed"
          {...rest}
        />
      </div>
    </FieldShell>
  );
});

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "value" | "defaultValue" | "min" | "max" | "step"> {
  label?: ReactNode;
  helper?: ReactNode;
  invalid?: ReactNode;
  hideLabel?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /** null when the field is empty. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { label, helper, invalid, hideLabel, min, max, step = 1, value, defaultValue = null, onValueChange, onChange, id: idProp, className, disabled, ...rest },
  ref,
) {
  const m = useMessages();
  const auto = useId();
  const id = idProp ?? auto;
  const [v, setV] = useControllableState<number | null>(value, defaultValue, onValueChange);
  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const out = v !== null && ((min !== undefined && v < min) || (max !== undefined && v > max));
  const rangeMsg = min !== undefined && max !== undefined ? m.numberOutOfRange(min, max) : undefined;
  const error = invalid || (out && rangeMsg);
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={error} hideLabel={hideLabel} disabled={disabled} className={className}>
      <div className={cn(fieldBox(!!error), "h-10")}>
        <input
          ref={ref}
          id={id}
          type="number"
          inputMode="decimal"
          value={v ?? ""}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy(id, error, helper)}
          onChange={(e) => {
            const n = e.target.valueAsNumber;
            setV(Number.isNaN(n) ? null : n);
            onChange?.(e);
          }}
          className={cn(inputCls, "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none")}
          {...rest}
        />
        {[
          { icon: <Minus className="size-4" />, d: -step, label: m.decrease },
          { icon: <Plus className="size-4" />, d: step, label: m.increase },
        ].map((b) => (
          <button
            key={b.d}
            type="button"
            aria-label={b.label}
            disabled={disabled}
            onClick={() => setV(clamp((v ?? 0) + b.d))}
            className="flex h-full w-10 shrink-0 items-center justify-center border-s border-line text-ink hover:bg-field-hover focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed"
          >
            {b.icon}
          </button>
        ))}
      </div>
    </FieldShell>
  );
});

export interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "type"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called when the user presses Enter. */
  onSearch?: (value: string) => void;
  size?: FieldSize;
  /** Starts as an icon button and opens on click. */
  expandable?: boolean;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { placeholder, size = "md", expandable, value, defaultValue = "", onValueChange, onSearch, onChange, onKeyDown, onBlur, className, ...rest },
  ref,
) {
  const m = useMessages();
  const [v, setV] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(!expandable);
  const local = useRef<HTMLInputElement>(null);
  const setRef = useMergedRef(ref, local);
  const label = rest["aria-label"] ?? placeholder ?? m.search;
  if (!open)
    return (
      <button
        type="button"
        aria-label={m.openSearch}
        onClick={() => {
          setOpen(true);
          setTimeout(() => local.current?.focus(), 0);
        }}
        className={cn("flex items-center justify-center bg-field text-ink hover:bg-field-hover", h[size], size === "sm" ? "w-8" : size === "md" ? "w-10" : "w-12", className)}
      >
        <SearchIcon className="size-4" />
      </button>
    );
  return (
    <div role="search" className={cn(fieldBox(), h[size], className)}>
      <SearchIcon aria-hidden className="ms-3 size-4 shrink-0 text-ink-2" />
      <input
        ref={setRef}
        type="search"
        aria-label={label}
        value={v}
        placeholder={placeholder ?? m.search}
        onChange={(e) => {
          setV(e.target.value);
          onChange?.(e);
        }}
        onBlur={(e) => {
          if (expandable && !v) setOpen(false);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setV("");
          if (e.key === "Enter") onSearch?.(v);
          onKeyDown?.(e);
        }}
        className={cn(inputCls, "ps-2 [&::-webkit-search-cancel-button]:hidden")}
        {...rest}
      />
      {v && (
        <button
          type="button"
          aria-label={m.clearSearch}
          onClick={() => {
            setV("");
            local.current?.focus();
          }}
          className="flex h-full w-10 shrink-0 items-center justify-center text-ink-2 hover:text-ink focus-visible:outline-offset-[-2px]"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
});

/* ---------- selection ---------- */

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: ReactNode;
  options: readonly SelectOption[];
  helper?: ReactNode;
  invalid?: ReactNode;
  hideLabel?: boolean;
  /** Shown while nothing is chosen; the user can't pick it again. */
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

/** A native <select>. value, defaultValue, onChange, name, required and ref all pass through. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, helper, invalid, hideLabel, placeholder, onValueChange, onChange, id: idProp, className, ...rest },
  ref,
) {
  const auto = useId();
  const id = idProp ?? auto;
  const opts = normalizeOptions(options);
  const noValue = rest.value === undefined && rest.defaultValue === undefined;
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} hideLabel={hideLabel} disabled={rest.disabled} className={className}>
      <div className={cn(fieldBox(!!invalid), "h-10")}>
        <select
          ref={ref}
          id={id}
          aria-invalid={!!invalid || undefined}
          aria-describedby={describedBy(id, invalid, helper)}
          defaultValue={placeholder !== undefined && noValue ? "" : undefined}
          onChange={(e) => {
            onValueChange?.(e.target.value);
            onChange?.(e);
          }}
          className="h-full w-full appearance-none bg-transparent px-4 pe-10 text-sm text-ink focus:outline-none disabled:cursor-not-allowed"
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {opts.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute end-3 size-4 text-ink" />
      </div>
    </FieldShell>
  );
});

function Listbox({
  id,
  options,
  selected,
  onChoose,
  multi,
  active,
}: {
  id: string;
  options: NormalizedOption[];
  selected: readonly string[];
  onChoose: (o: NormalizedOption) => void;
  multi?: boolean;
  active: number;
}) {
  const m = useMessages();
  return (
    <ul
      id={id}
      role="listbox"
      aria-multiselectable={multi || undefined}
      className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-box border border-line bg-layer-2 p-1 shadow-[0_8px_24px_rgb(15_23_42/0.12)] animate-pop"
    >
      {options.length === 0 && <li className="px-4 py-3 text-sm text-ink-2">{m.noMatches}</li>}
      {options.map((o, i) => {
        const on = selected.includes(o.value);
        return (
          <li
            key={o.value}
            id={`${id}-${i}`}
            role="option"
            aria-selected={on}
            aria-disabled={o.disabled || undefined}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => !o.disabled && onChoose(o)}
            className={cn(
              "flex h-9 items-center gap-3 rounded-lg px-3 text-sm",
              o.disabled ? "cursor-not-allowed text-placeholder" : "cursor-pointer text-ink-2 hover:bg-layer-hover hover:text-ink",
              on && !multi && "bg-layer-selected text-ink",
              i === active && "outline-2 outline-offset-[-2px] outline-focus",
            )}
          >
            {multi && <CheckBoxGlyph checked={on} />}
            <span className="flex-1 truncate">{o.label}</span>
            {on && !multi && <Check aria-hidden className="size-4 text-ink" />}
          </li>
        );
      })}
    </ul>
  );
}

/** Next enabled option index from `from` in direction `d`, or `from` if there is none. */
const step = (opts: NormalizedOption[], from: number, d: 1 | -1) => {
  for (let i = from + d; i >= 0 && i < opts.length; i += d) if (!opts[i].disabled) return i;
  return from;
};

interface ChoiceProps<V> {
  label?: ReactNode;
  options: readonly SelectOption[];
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  /** Adds a hidden input so the value is sent with a plain form submit. */
  name?: string;
  placeholder?: string;
  helper?: ReactNode;
  invalid?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  id?: string;
}

export type DropdownProps = ChoiceProps<string | null>;

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(function Dropdown(
  { label, options, value, defaultValue = null, onValueChange, name, placeholder, helper, invalid, disabled, required, hideLabel, className, id: idProp },
  ref,
) {
  const m = useMessages();
  const auto = useId();
  const id = idProp ?? auto;
  const opts = normalizeOptions(options);
  const [v, setV] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const ref2 = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const current = opts.find((o) => o.value === v);
  const choose = (o: NormalizedOption) => {
    setV(o.value);
    setOpen(false);
  };
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} disabled={disabled} hideLabel={hideLabel} className={className}>
      <div ref={ref2} className="relative">
        <button
          ref={ref}
          id={id}
          type="button"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-haspopup="listbox"
          aria-invalid={!!invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy(id, invalid, helper)}
          aria-activedescendant={open && active >= 0 ? `${id}-list-${active}` : undefined}
          onClick={() => {
            setOpen((o) => !o);
            setActive(opts.findIndex((o) => o.value === v));
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => step(opts, a, 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => step(opts, a, -1));
            } else if ((e.key === "Enter" || e.key === " ") && open && opts[active] && !opts[active].disabled) {
              e.preventDefault();
              choose(opts[active]);
            }
          }}
          className={cn(fieldBox(!!invalid), "h-10 justify-between px-4 text-start focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed")}
        >
          <span className={cn("truncate", !current && "text-placeholder")}>{current?.label ?? placeholder ?? m.chooseOption}</span>
          <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
        {name && <input type="hidden" name={name} value={v ?? ""} />}
        {open && <Listbox id={`${id}-list`} options={opts} selected={v === null ? [] : [v]} active={active} onChoose={choose} />}
      </div>
    </FieldShell>
  );
});

export interface ComboBoxProps extends ChoiceProps<string | null> {
  /** Called as the user types, for example to load options from a server. */
  onInputChange?: (query: string) => void;
  /** Set to false when you filter `options` yourself (for example on the server). */
  filter?: boolean;
}

export const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(function ComboBox(
  { label, options, value, defaultValue = null, onValueChange, onInputChange, filter = true, name, placeholder, helper, invalid, disabled, required, hideLabel, className, id: idProp },
  ref,
) {
  const m = useMessages();
  const auto = useId();
  const id = idProp ?? auto;
  const opts = normalizeOptions(options);
  const [v, setV] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  // What the user is typing; null shows the chosen option's label.
  const [draft, setDraft] = useState<string | null>(null);
  const [active, setActive] = useState(-1);
  const selectedLabel = opts.find((o) => o.value === v)?.label ?? "";
  const q = draft ?? selectedLabel;
  const close = () => {
    setOpen(false);
    setDraft(null);
  };
  const ref2 = useDismiss<HTMLDivElement>(open, close);
  const list = useMemo(
    () => (filter && draft ? opts.filter((o) => o.label.toLowerCase().includes(draft.toLowerCase())) : opts),
    [opts, draft, filter],
  );
  const choose = (o: NormalizedOption) => {
    setV(o.value);
    close();
  };
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} disabled={disabled} hideLabel={hideLabel} className={className}>
      <div ref={ref2} className="relative">
        <div className={cn(fieldBox(!!invalid), "h-10")}>
          <input
            ref={ref}
            id={id}
            role="combobox"
            disabled={disabled}
            required={required}
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-invalid={!!invalid || undefined}
            aria-describedby={describedBy(id, invalid, helper)}
            aria-activedescendant={open && active >= 0 ? `${id}-list-${active}` : undefined}
            value={q}
            placeholder={placeholder ?? m.typeToFilter}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setDraft(e.target.value);
              onInputChange?.(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setActive((a) => step(list, a, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => step(list, a, -1));
              } else if (e.key === "Enter" && open && list[active] && !list[active].disabled) {
                e.preventDefault();
                choose(list[active]);
              }
            }}
            className={inputCls}
          />
          {q && !disabled && (
            <button
              type="button"
              aria-label={m.clearSelection}
              onClick={() => {
                setV(null);
                setDraft("");
                onInputChange?.("");
              }}
              className="flex h-full w-8 items-center justify-center text-ink-2 hover:text-ink"
            >
              <X className="size-4" />
            </button>
          )}
          <ChevronDown aria-hidden className="me-3 size-4 shrink-0" />
        </div>
        {name && <input type="hidden" name={name} value={v ?? ""} />}
        {open && <Listbox id={`${id}-list`} options={list} selected={v === null ? [] : [v]} active={active} onChoose={choose} />}
      </div>
    </FieldShell>
  );
});

export type MultiSelectProps = ChoiceProps<string[]>;

const EMPTY: string[] = [];

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  { label, options, value, defaultValue = EMPTY, onValueChange, name, placeholder, helper, invalid, disabled, required, hideLabel, className, id: idProp },
  ref,
) {
  const m = useMessages();
  const auto = useId();
  const id = idProp ?? auto;
  const opts = normalizeOptions(options);
  const [sel, setSel] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const ref2 = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const toggle = (o: NormalizedOption) => setSel((s) => (s.includes(o.value) ? s.filter((x) => x !== o.value) : [...s, o.value]));
  const labels = opts.filter((o) => sel.includes(o.value)).map((o) => o.label);
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} disabled={disabled} hideLabel={hideLabel} className={className}>
      <div ref={ref2} className="relative">
        <div className={cn(fieldBox(!!invalid), "h-10 gap-2 ps-4 pe-0")}>
          {sel.length > 0 && !disabled && (
            <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-inverse ps-2 pe-1 text-xs text-inverse-ink">
              {sel.length}
              <button
                type="button"
                aria-label={m.clearAllSelected}
                onClick={() => setSel([])}
                className="inline-flex size-4 items-center justify-center rounded-full hover:bg-white/20"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          <button
            ref={ref}
            id={id}
            type="button"
            role="combobox"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-invalid={!!invalid || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy(id, invalid, helper)}
            aria-activedescendant={open && active >= 0 ? `${id}-list-${active}` : undefined}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setActive((a) => step(opts, a, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => step(opts, a, -1));
              } else if ((e.key === "Enter" || e.key === " ") && open && opts[active] && !opts[active].disabled) {
                e.preventDefault();
                toggle(opts[active]);
              }
            }}
            className="flex h-full min-w-0 flex-1 items-center gap-2 pe-3 text-start focus:outline-none disabled:cursor-not-allowed"
          >
            <span className={cn("flex-1 truncate", !labels.length && "text-placeholder")}>{labels.length ? labels.join(", ") : (placeholder ?? m.chooseOptions)}</span>
            <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
          </button>
        </div>
        {name && sel.map((s) => <input key={s} type="hidden" name={name} value={s} />)}
        {open && <Listbox id={`${id}-list`} multi options={opts} selected={sel} active={active} onChoose={toggle} />}
      </div>
    </FieldShell>
  );
});

export function CheckBoxGlyph({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
        checked || indeterminate ? "border-primary bg-primary text-white" : "border-line-strong bg-bg",
      )}
    >
      {indeterminate ? <Minus className="size-3" strokeWidth={3} /> : checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "defaultChecked"> {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  hideLabel?: boolean;
}

/** A checkbox. name, value, required, onChange and ref pass through to the native <input>. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, checked, defaultChecked = false, onCheckedChange, onChange, indeterminate, hideLabel, className, disabled, ...rest },
  ref,
) {
  const [c, setC] = useControllableState(checked, defaultChecked, onCheckedChange);
  const local = useRef<HTMLInputElement>(null);
  const setRef = useMergedRef(ref, local);
  useEffect(() => {
    if (local.current) local.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <label className={cn("group inline-flex cursor-pointer items-start gap-2 text-sm text-ink", disabled && "cursor-not-allowed opacity-50", className)}>
      <input
        ref={setRef}
        type="checkbox"
        className="peer sr-only"
        checked={c}
        disabled={disabled}
        onChange={(e) => {
          setC(e.target.checked);
          onChange?.(e);
        }}
        {...rest}
      />
      <span className="mt-0.5 rounded-[2px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-focus">
        <CheckBoxGlyph checked={c} indeterminate={indeterminate} />
      </span>
      <span className={cn(hideLabel && "sr-only")}>{label}</span>
    </label>
  );
});

export interface RadioGroupProps {
  legend: ReactNode;
  options: readonly SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function RadioGroup({
  legend,
  options,
  value,
  defaultValue = null,
  onValueChange,
  name: nameProp,
  required,
  disabled,
  orientation = "vertical",
  className,
}: RadioGroupProps) {
  const auto = useId();
  const name = nameProp ?? auto;
  const [v, setV] = useControllableState<string | null>(value, defaultValue, onValueChange as (v: string | null) => void);
  return (
    <fieldset disabled={disabled} className={cn(disabled && "opacity-50", className)}>
      <legend className="mb-2 text-xs text-ink-2">{legend}</legend>
      <div className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap gap-x-6")}>
        {normalizeOptions(options).map((o) => (
          <label key={o.value} className={cn("inline-flex items-center gap-2 text-sm text-ink", o.disabled || disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              disabled={o.disabled}
              className="peer sr-only"
              checked={v === o.value}
              onChange={() => setV(o.value)}
            />
            <span
              aria-hidden
              className={cn(
                "inline-flex size-[18px] items-center justify-center rounded-full border-2 border-line-strong transition-colors",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-focus",
                v === o.value && "border-ink",
              )}
            >
              {v === o.value && <span className="size-2 rounded-full bg-ink animate-fade" />}
            </span>
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export interface ToggleProps {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onText?: ReactNode;
  offText?: ReactNode;
  size?: "sm" | "md";
  disabled?: boolean;
  hideLabel?: boolean;
  /** Sends `value` with the form while the switch is on, like a checkbox. */
  name?: string;
  value?: string;
  className?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { label, checked, defaultChecked = false, onCheckedChange, onText, offText, size = "md", disabled, hideLabel, name, value = "on", className },
  ref,
) {
  const m = useMessages();
  const id = useId();
  const [c, setC] = useControllableState(checked, defaultChecked, onCheckedChange);
  return (
    <div className={cn("flex flex-col gap-2", disabled && "opacity-50", className)}>
      <span id={id} className={cn("text-xs text-ink-2", hideLabel && "sr-only")}>
        {label}
      </span>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={c}
        aria-labelledby={id}
        disabled={disabled}
        onClick={() => setC(!c)}
        className="inline-flex items-center gap-2 text-sm text-ink focus-visible:outline-none disabled:cursor-not-allowed [&:focus-visible>span:first-child]:outline-2 [&:focus-visible>span:first-child]:outline-offset-2 [&:focus-visible>span:first-child]:outline-focus"
      >
        <span
          className={cn(
            "relative inline-flex shrink-0 rounded-full transition-colors duration-150",
            size === "md" ? "h-6 w-12" : "h-4 w-8",
            c ? "bg-success" : "bg-line-strong",
          )}
        >
          <span
            className={cn(
              "absolute top-[3px] rounded-full bg-white transition-[inset-inline-start] duration-150",
              size === "md" ? "size-[18px]" : "size-2.5",
              c ? (size === "md" ? "start-[27px]" : "start-[19px]") : "start-[3px]",
            )}
          />
        </span>
        <span aria-hidden>{c ? (onText ?? m.toggleOn) : (offText ?? m.toggleOff)}</span>
      </button>
      {name && c && <input type="hidden" name={name} value={value} />}
    </div>
  );
});

export interface ContentSwitcherProps {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  className?: string;
}

export function ContentSwitcher({ options, value, defaultValue, onValueChange, label, className }: ContentSwitcherProps) {
  const opts = normalizeOptions(options);
  const [v, setV] = useControllableState(value, defaultValue ?? opts[0]?.value ?? "", onValueChange);
  return (
    <div role="tablist" aria-label={label} className={cn("inline-flex w-full max-w-md gap-1 rounded-box bg-layer p-1", className)}>
      {opts.map((o) => (
        <button
          key={o.value}
          role="tab"
          type="button"
          aria-selected={v === o.value}
          disabled={o.disabled}
          onClick={() => setV(o.value)}
          className={cn(
            "h-8 flex-1 rounded-lg px-4 text-sm transition-colors focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:text-placeholder",
            v === o.value ? "bg-bg font-medium text-ink shadow-[0_1px_3px_rgb(15_23_42/0.12)] ring-1 ring-line" : "bg-transparent text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export interface SliderProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  name?: string;
  unit?: ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, min = 0, max = 100, step: stepBy = 1, value, defaultValue, onValueChange, name, unit, disabled, className, id: idProp },
  ref,
) {
  const m = useMessages();
  const auto = useId();
  const id = idProp ?? auto;
  const [v, setV] = useControllableState(value, defaultValue ?? min, onValueChange);
  const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className={cn("flex w-full flex-col gap-2", disabled && "opacity-50", className)}>
      <label htmlFor={id} className="text-xs text-ink-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink">{min}</span>
        <input
          ref={ref}
          id={id}
          type="range"
          name={name}
          min={min}
          max={max}
          step={stepBy}
          value={v}
          disabled={disabled}
          onChange={(e) => setV(+e.target.value)}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line-2 accent-[var(--text)] disabled:cursor-not-allowed [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
          style={{ background: `linear-gradient(to right, var(--text) ${pct}%, var(--border) ${pct}%)` }}
        />
        <span className="text-sm text-ink">{max}</span>
        <input
          aria-label={m.sliderValue(label)}
          type="number"
          value={v}
          min={min}
          max={max}
          step={stepBy}
          disabled={disabled}
          onChange={(e) => !Number.isNaN(e.target.valueAsNumber) && setV(clamp(e.target.valueAsNumber))}
          className="h-10 w-16 rounded-box border border-line-2 bg-field px-2 text-center text-sm text-ink focus:outline-2 focus:outline-offset-[-2px] focus:outline-focus"
        />
        {unit && <span className="text-sm text-ink-2">{unit}</span>}
      </div>
    </div>
  );
});

/* ---------- date + time ---------- */

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export interface CalendarProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** Days before `min` or after `max` can't be picked. */
  min?: Date;
  max?: Date;
  className?: string;
}

export function Calendar({ value, defaultValue = null, onValueChange, min, max, className }: CalendarProps) {
  const m = useMessages();
  const [v, setV] = useControllableState<Date | null>(value, defaultValue, onValueChange as (d: Date | null) => void);
  const [view, setView] = useState(() => {
    const b = v ?? new Date();
    return new Date(b.getFullYear(), b.getMonth(), 1);
  });
  const today = new Date();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const lead = (view.getDay() + 6) % 7;
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const blocked = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max));
  return (
    <div className={cn("w-72 rounded-box border border-line bg-layer-2 p-2 shadow-[0_8px_24px_rgb(15_23_42/0.12)]", className)}>
      <div className="flex items-center justify-between px-1 pb-2">
        <button type="button" aria-label={m.previousMonth} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-layer-hover rtl:rotate-180">
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-ink" aria-live="polite">
          {m.months[view.getMonth()]} {view.getFullYear()}
        </span>
        <button type="button" aria-label={m.nextMonth} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-layer-hover rtl:rotate-180">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div role="grid" className="grid grid-cols-7 text-center text-sm">
        {m.weekdaysShort.map((d) => (
          <span key={d} role="columnheader" className="py-1 text-xs text-ink-2">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const date = new Date(view.getFullYear(), view.getMonth(), d);
          const sel = !!v && sameDay(date, v);
          const isToday = sameDay(date, today);
          const off = blocked(date);
          return (
            <button
              key={d}
              type="button"
              role="gridcell"
              aria-selected={sel}
              aria-current={isToday ? "date" : undefined}
              disabled={off}
              onClick={() => setV(date)}
              className={cn(
                "relative mx-auto inline-flex size-9 items-center justify-center text-ink hover:bg-layer-hover focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:text-placeholder disabled:hover:bg-transparent",
                sel && "bg-primary text-on-color hover:bg-primary-hover",
                isToday && !sel && "font-semibold text-link after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-link",
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
/** yyyy-mm-dd in local time, the format <input type="date"> and most APIs use. */
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const ddmmyyyy = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

export interface DatePickerProps {
  label?: ReactNode;
  helper?: ReactNode;
  invalid?: ReactNode;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  /** Adds a hidden input with the date as yyyy-mm-dd. */
  name?: string;
  placeholder?: string;
  /** How the chosen date is shown. Defaults to dd/mm/yyyy. */
  formatDate?: (date: Date) => string;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  id?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { label, helper, invalid, value, defaultValue = null, onValueChange, name, placeholder, formatDate = ddmmyyyy, min, max, disabled, required, hideLabel, className, id: idProp },
  ref,
) {
  const m = useMessages();
  const auto = useId();
  const id = idProp ?? auto;
  const [v, setV] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const ref2 = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} disabled={disabled} hideLabel={hideLabel} className={className}>
      <div ref={ref2} className="relative w-full max-w-72">
        <div className={cn(fieldBox(!!invalid), "h-10")}>
          <input
            ref={ref}
            id={id}
            readOnly
            disabled={disabled}
            required={required}
            value={v ? formatDate(v) : ""}
            placeholder={placeholder ?? m.datePlaceholder}
            aria-invalid={!!invalid || undefined}
            aria-describedby={describedBy(id, invalid, helper)}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
            className={cn(inputCls, "cursor-pointer")}
          />
          <button type="button" aria-label={m.openCalendar} aria-expanded={open} disabled={disabled} onClick={() => setOpen((o) => !o)} className="flex h-full w-10 items-center justify-center text-ink disabled:cursor-not-allowed">
            <CalendarDays className="size-4" />
          </button>
        </div>
        {name && <input type="hidden" name={name} value={v ? toISODate(v) : ""} />}
        {open && (
          <div className="absolute start-0 top-full z-30 mt-1 animate-pop">
            <Calendar
              value={v}
              min={min}
              max={max}
              onValueChange={(d) => {
                setV(d);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </FieldShell>
  );
});

export interface TimePickerProps {
  label?: ReactNode;
  helper?: ReactNode;
  /** 24-hour "HH:mm", or null when empty or not valid yet. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Show hh:mm with AM / PM (default) or a 24-hour clock. The value is always 24-hour. */
  hour12?: boolean;
  /** Adds a hidden input with the 24-hour value. */
  name?: string;
  /** Shows a time-zone select when given. */
  timeZones?: readonly SelectOption[];
  timeZone?: string;
  defaultTimeZone?: string;
  onTimeZoneChange?: (timeZone: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

const RE12 = /^(0?[1-9]|1[0-2]):([0-5]\d)$/;
const RE24 = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { label, helper, value, defaultValue = null, onValueChange, hour12 = true, name, timeZones, timeZone, defaultTimeZone, onTimeZoneChange, disabled, required, className, id: idProp },
  ref,
) {
  const m = useMessages();
  const auto = useId();
  const id = idProp ?? auto;
  const [v, setV] = useControllableState(value, defaultValue, onValueChange);
  const zones = timeZones ? normalizeOptions(timeZones) : [];
  const [tz, setTz] = useControllableState(timeZone, defaultTimeZone ?? zones[0]?.value ?? "", onTimeZoneChange);
  const parsed = v && RE24.test(v) ? v.split(":").map(Number) : null;
  const [localPeriod, setLocalPeriod] = useState<"AM" | "PM">("AM");
  const period = parsed ? (parsed[0] < 12 ? "AM" : "PM") : localPeriod;
  const shownValue = parsed ? (hour12 ? `${pad(parsed[0] % 12 || 12)}:${pad(parsed[1])}` : `${pad(parsed[0])}:${pad(parsed[1])}`) : "";
  // What the user is typing; null shows the current value.
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? shownValue;
  const re = hour12 ? RE12 : RE24;
  const ok = text === "" || re.test(text);
  const to24 = (t: string, p: "AM" | "PM") => {
    const [hh, mm] = t.split(":").map(Number);
    const H = hour12 ? (hh % 12) + (p === "PM" ? 12 : 0) : hh;
    return `${pad(H)}:${pad(mm)}`;
  };
  const selCls = "h-10 rounded-box border border-line-2 bg-field px-3 text-sm text-ink focus:outline-2 focus:outline-offset-[-2px] focus:outline-focus disabled:cursor-not-allowed";
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={!ok && m.timeInvalid(hour12)} disabled={disabled} className={className}>
      <div className="flex gap-px">
        <div className={cn(fieldBox(!ok), "h-10 w-28")}>
          <Clock aria-hidden className="ms-3 size-4 text-ink-2" />
          <input
            ref={ref}
            id={id}
            value={text}
            disabled={disabled}
            required={required}
            inputMode="numeric"
            aria-invalid={!ok || undefined}
            aria-describedby={describedBy(id, !ok, helper)}
            onChange={(e) => {
              const t = e.target.value;
              setDraft(t);
              if (t === "") setV(null);
              else if (re.test(t)) setV(to24(t, period));
            }}
            onBlur={() => ok && setDraft(null)}
            placeholder={m.timePlaceholder(hour12)}
            className={cn(inputCls, "ps-2")}
          />
        </div>
        {hour12 && (
          <select
            aria-label={m.amPm}
            value={period}
            disabled={disabled}
            onChange={(e) => {
              const p = e.target.value as "AM" | "PM";
              setLocalPeriod(p);
              if (parsed) setV(to24(shownValue, p));
            }}
            className={selCls}
          >
            <option value="AM">{m.am}</option>
            <option value="PM">{m.pm}</option>
          </select>
        )}
        {zones.length > 0 && (
          <select aria-label={m.timeZone} value={tz} disabled={disabled} onChange={(e) => setTz(e.target.value)} className={selCls}>
            {zones.map((z) => (
              <option key={z.value} value={z.value} disabled={z.disabled}>
                {z.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {name && <input type="hidden" name={name} value={v ?? ""} />}
    </FieldShell>
  );
});

/* ---------- upload ---------- */

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  /** Shown under the file name when status is "error". */
  error?: string;
  /** 0–100, shown while uploading. */
  progress?: number;
}

export interface FileUploaderProps {
  title?: ReactNode;
  note?: ReactNode;
  /** Same format as the native accept attribute: ".pdf,.png,image/*". */
  accept?: string;
  /** Largest allowed file in bytes. Bigger files are listed with an error and not passed to onFilesAdded. */
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** Sends the valid files with a plain form submit (multipart/form-data). */
  name?: string;
  /** The listed files. Update an item's status / progress / error as your upload runs. */
  value?: UploadItem[];
  defaultValue?: UploadItem[];
  onValueChange?: (items: UploadItem[]) => void;
  /** The files that passed the checks, each time the user adds some. Start your uploads here. */
  onFilesAdded?: (items: UploadItem[]) => void;
  onRemove?: (item: UploadItem) => void;
  className?: string;
}

const accepts = (file: File, accept?: string) => {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((t) => (t.startsWith(".") ? name.endsWith(t) : t.endsWith("/*") ? type.startsWith(t.slice(0, -1)) : type === t));
};

let uploadSeq = 0;
const NO_ITEMS: UploadItem[] = [];

export function FileUploader({
  title,
  note,
  accept,
  maxSize,
  multiple = true,
  disabled,
  name,
  value,
  defaultValue = NO_ITEMS,
  onValueChange,
  onFilesAdded,
  onRemove,
  className,
}: FileUploaderProps) {
  const m = useMessages();
  const [items, setItems] = useControllableState(value, defaultValue, onValueChange);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Keep the native input's FileList in step with the list, so a form submit sends it.
  useEffect(() => {
    if (!name || !input.current || typeof DataTransfer === "undefined") return;
    try {
      const dt = new DataTransfer();
      for (const it of items) if (it.status !== "error") dt.items.add(it.file);
      input.current.files = dt.files;
    } catch {
      /* old browsers can't set FileList; the files are still in onValueChange */
    }
  }, [items, name]);

  const add = (list: FileList | null) => {
    if (!list || disabled) return;
    const files = Array.from(list).slice(0, multiple ? undefined : 1);
    const next: UploadItem[] = files.map((file) => {
      const id = `${Date.now().toString(36)}-${(uploadSeq++).toString(36)}`;
      if (!accepts(file, accept)) return { id, file, status: "error", error: m.fileTypeNotAllowed };
      if (maxSize !== undefined && file.size > maxSize) return { id, file, status: "error", error: m.fileTooLarge(formatBytes(maxSize)) };
      return { id, file, status: "pending" };
    });
    setItems((p) => (multiple ? [...p, ...next] : next));
    const ok = next.filter((f) => f.status !== "error");
    if (ok.length) onFilesAdded?.(ok);
  };

  return (
    <div className={cn("flex w-full max-w-md flex-col gap-3", disabled && "opacity-60", className)}>
      <div>
        <p className="text-sm font-semibold text-ink">{title ?? m.uploadTitle}</p>
        {note && <p className="mt-1 text-sm text-ink-2">{note}</p>}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-2 border border-dashed px-4 py-6 text-sm transition-colors disabled:cursor-not-allowed",
          over ? "border-focus bg-tint" : "border-line-strong hover:bg-layer-hover",
        )}
      >
        <Upload aria-hidden className="size-5 text-link" />
        <span>
          <span className="text-link underline">{m.chooseFiles}</span> <span className="text-ink-2">{m.dropFilesHint}</span>
        </span>
      </button>
      <input
        ref={input}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          add(e.target.files);
          if (!name) e.target.value = "";
        }}
      />
      {items.length > 0 && (
        <ul className="flex flex-col gap-2" aria-live="polite">
          {items.map((f) => (
            <li key={f.id} className={cn("flex min-h-12 items-center gap-3 bg-layer px-4 py-2 text-sm", f.status === "error" && "outline-2 outline-offset-[-2px] outline-danger")}>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-ink">{f.file.name}</span>
                {f.status === "error" ? (
                  <span className="block text-xs text-danger-text">{f.error}</span>
                ) : f.status === "uploading" && f.progress !== undefined ? (
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-line">
                    <span className="block h-full bg-accent transition-[width]" style={{ width: `${Math.min(100, f.progress)}%` }} />
                  </span>
                ) : (
                  <span className="block text-xs text-ink-2">{formatBytes(f.file.size)}</span>
                )}
              </span>
              {f.status === "uploading" && <span role="img" className="size-4 animate-spin rounded-full border-2 border-line-2 border-t-ink" aria-label={m.uploading} />}
              {f.status === "done" && <Check aria-label={m.uploaded} className="size-4 text-success" />}
              {f.status === "error" && <CircleAlert aria-hidden className="size-4 text-danger" />}
              <button
                type="button"
                aria-label={m.remove(f.file.name)}
                disabled={disabled}
                onClick={() => {
                  setItems((p) => p.filter((x) => x.id !== f.id));
                  onRemove?.(f);
                }}
                className="inline-flex size-8 items-center justify-center text-ink-2 hover:bg-layer-hover hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- groups ---------- */

export function FormGroup({ legend, children, helper, className }: { legend: ReactNode; children: ReactNode; helper?: ReactNode; className?: string }) {
  return (
    <fieldset className={cn("flex w-full flex-col gap-4", className)}>
      <legend className="mb-1 text-sm font-semibold text-ink">{legend}</legend>
      {helper && <p className="-mt-2 text-sm text-ink-2">{helper}</p>}
      {children}
    </fieldset>
  );
}

export interface FluidInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  invalid?: ReactNode;
}

export const FluidInput = forwardRef<HTMLInputElement, FluidInputProps>(function FluidInput({ label, invalid, id: idProp, className, ...rest }, ref) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div
      className={cn(
        "relative flex min-h-16 flex-col justify-center rounded-box border bg-field px-4 pt-2 focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-focus",
        invalid ? "border-danger outline-2 outline-offset-[-2px] outline-danger" : "border-line-2",
        rest.disabled && "opacity-60",
        className,
      )}
    >
      <label htmlFor={id} className="text-xs text-ink-2">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className="h-8 bg-transparent text-sm text-ink placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed"
        aria-invalid={!!invalid || undefined}
        aria-describedby={invalid ? `${id}-msg` : undefined}
        {...rest}
      />
      {invalid && (
        <p id={`${id}-msg`} className="pb-2 text-xs text-danger-text">
          {invalid}
        </p>
      )}
    </div>
  );
});

export function InputGroup({ prefix, suffix, children, className }: { prefix?: ReactNode; suffix?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-10 w-full items-stretch overflow-hidden rounded-box border border-line-2 bg-bg text-sm focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-focus", className)}>
      {prefix && <span className="flex items-center border-e border-line-2 bg-layer px-3 text-ink-2 [&>svg]:size-4">{prefix}</span>}
      {children}
      {suffix && <span className="flex items-center border-s border-line-2 bg-layer px-3 text-ink-2 [&>svg]:size-4">{suffix}</span>}
    </div>
  );
}

export interface InputOTPProps {
  length?: number;
  label?: ReactNode;
  helper?: ReactNode;
  invalid?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (code: string) => void;
  /** Called once every digit is filled in. */
  onComplete?: (code: string) => void;
  /** Adds a hidden input with the code. */
  name?: string;
  disabled?: boolean;
  className?: string;
}

export const InputOTP = forwardRef<HTMLInputElement, InputOTPProps>(function InputOTP(
  { length = 6, label, helper, invalid, value, defaultValue = "", onValueChange, onComplete, name, disabled, className },
  ref,
) {
  const m = useMessages();
  const id = useId();
  const [code, setCode] = useControllableState(value, defaultValue, onValueChange);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const setFirst = useMergedRef(ref, (el: HTMLInputElement | null) => {
    refs.current[0] = el;
  });
  const update = (next: string) => {
    const c = next.slice(0, length);
    setCode(c);
    if (c.length === length && c !== code) onComplete?.(c);
  };
  return (
    <fieldset disabled={disabled} className={cn("flex flex-col gap-2", disabled && "opacity-60", className)} aria-describedby={`${id}-msg`}>
      <legend className="mb-2 text-xs text-ink-2">{label ?? m.otpLabel}</legend>
      <div className="flex items-center gap-2" dir="ltr">
        {Array.from({ length }, (_, i) => (
          <span key={i} className="contents">
            {length % 2 === 0 && length >= 6 && i === length / 2 && <span aria-hidden className="h-px w-3 bg-line-strong" />}
            <input
              ref={
                i === 0
                  ? setFirst
                  : (el) => {
                      refs.current[i] = el;
                    }
              }
              aria-label={m.otpDigit(i + 1, length)}
              aria-invalid={!!invalid || undefined}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={code[i] ?? ""}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "").slice(-1);
                const at = Math.min(i, code.length);
                if (d) {
                  update(code.slice(0, at) + d + code.slice(at + 1));
                  refs.current[Math.min(at + 1, length - 1)]?.focus();
                } else update(code.slice(0, i) + code.slice(i + 1));
              }}
              onFocus={(e) => {
                // Always type into the next empty box.
                if (i > code.length) refs.current[code.length]?.focus();
                else e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) {
                  e.preventDefault();
                  update(code.slice(0, i - 1));
                  refs.current[i - 1]?.focus();
                }
                if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
                if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
              }}
              onPaste={(e) => {
                const d = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
                if (d.length) {
                  e.preventDefault();
                  update(d);
                  refs.current[Math.min(d.length, length - 1)]?.focus();
                }
              }}
              className={cn(
                "size-11 rounded-box border bg-bg text-center font-mono text-lg text-ink transition-colors focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus",
                invalid ? "border-danger" : "border-line-2",
              )}
            />
          </span>
        ))}
      </div>
      {name && <input type="hidden" name={name} value={code} />}
      <p id={`${id}-msg`} className={cn("text-xs", invalid ? "text-danger-text" : "text-ink-2")} aria-live="polite">
        {invalid || helper || m.otpHint(length)}
      </p>
    </fieldset>
  );
});
