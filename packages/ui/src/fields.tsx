"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
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
import { cn } from "./utils.js";
import { useDismiss } from "./hooks.js";

/* ---------- shared field chrome ---------- */

export type FieldSize = "sm" | "md" | "lg";
const h: Record<FieldSize, string> = { sm: "h-8", md: "h-10", lg: "h-12" };

export function FieldShell({
  id,
  label,
  helper,
  invalid,
  warn,
  disabled,
  counter,
  children,
  hideLabel,
}: {
  id: string;
  label?: ReactNode;
  helper?: ReactNode;
  invalid?: string | false;
  warn?: string | false;
  disabled?: boolean;
  counter?: ReactNode;
  children: ReactNode;
  hideLabel?: boolean;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", disabled && "opacity-60")}>
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

export const fieldBox = (invalid?: boolean, warn?: boolean) =>
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

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helper?: string;
  invalid?: string | false;
  warn?: string | false;
  size?: FieldSize;
  hideLabel?: boolean;
  trailing?: ReactNode;
  leading?: ReactNode;
}

export function TextInput({ label, helper, invalid, warn, size = "md", hideLabel, trailing, leading, id: idProp, ...rest }: TextInputProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} warn={warn} disabled={rest.disabled} hideLabel={hideLabel}>
      <div className={cn(fieldBox(!!invalid, !!warn), h[size])}>
        {leading && <span className="ps-3 text-ink-2 [&>svg]:size-4">{leading}</span>}
        <input
          id={id}
          aria-invalid={!!invalid || undefined}
          aria-describedby={invalid || warn || helper ? `${id}-msg` : undefined}
          className={cn(inputCls, leading && "ps-2")}
          {...rest}
        />
        {invalid && <CircleAlert aria-hidden className="me-3 size-4 shrink-0 text-danger" />}
        {!invalid && warn && <AlertTriangle aria-hidden className="me-3 size-4 shrink-0 fill-warning text-ink" />}
        {trailing}
      </div>
    </FieldShell>
  );
}

export function PasswordInput(props: Omit<TextInputProps, "type" | "trailing">) {
  const [show, setShow] = useState(false);
  return (
    <TextInput
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide password" : "Show password"}
          className="flex h-full w-10 shrink-0 items-center justify-center text-ink-2 hover:text-ink focus-visible:outline-offset-[-2px]"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}

export function TextArea({
  label,
  helper,
  invalid,
  maxCount,
  value,
  onChange,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; helper?: string; invalid?: string | false; maxCount?: number }) {
  const id = useId();
  const [inner, setInner] = useState("");
  const v = (value as string) ?? inner;
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={invalid} counter={maxCount ? `${v.length}/${maxCount}` : undefined}>
      <div className={cn(fieldBox(!!invalid), "items-start")}>
        <textarea
          id={id}
          rows={4}
          maxLength={maxCount}
          value={v}
          onChange={(e) => {
            setInner(e.target.value);
            onChange?.(e);
          }}
          aria-invalid={!!invalid || undefined}
          className="w-full resize-y bg-transparent px-4 py-3 text-sm text-ink placeholder:text-placeholder focus:outline-none"
          {...rest}
        />
      </div>
    </FieldShell>
  );
}

export function NumberInput({
  label,
  helper,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 1,
}: {
  label: string;
  helper?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}) {
  const id = useId();
  const [v, setV] = useState(defaultValue);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const out = v < min || v > max;
  return (
    <FieldShell id={id} label={label} helper={helper} invalid={out && `Enter a number from ${min} to ${max}.`}>
      <div className={cn(fieldBox(out), "h-10")}>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={Number.isNaN(v) ? "" : v}
          min={min}
          max={max}
          step={step}
          onChange={(e) => setV(e.target.valueAsNumber)}
          className={cn(inputCls, "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none")}
        />
        {[
          { icon: <Minus className="size-4" />, d: -step, label: "Decrease" },
          { icon: <Plus className="size-4" />, d: step, label: "Increase" },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            aria-label={b.label}
            onClick={() => setV((x) => clamp((Number.isNaN(x) ? 0 : x) + b.d))}
            className="flex h-full w-10 shrink-0 items-center justify-center border-s border-line text-ink hover:bg-field-hover focus-visible:outline-offset-[-2px]"
          >
            {b.icon}
          </button>
        ))}
      </div>
    </FieldShell>
  );
}

export function Search({ placeholder = "Search", size = "md", expandable }: { placeholder?: string; size?: FieldSize; expandable?: boolean }) {
  const [v, setV] = useState("");
  const [open, setOpen] = useState(!expandable);
  const ref = useRef<HTMLInputElement>(null);
  if (!open)
    return (
      <button
        type="button"
        aria-label="Open search"
        onClick={() => {
          setOpen(true);
          setTimeout(() => ref.current?.focus(), 0);
        }}
        className={cn("flex items-center justify-center bg-field text-ink hover:bg-field-hover", h[size], size === "sm" ? "w-8" : size === "md" ? "w-10" : "w-12")}
      >
        <SearchIcon className="size-4" />
      </button>
    );
  return (
    <div role="search" className={cn(fieldBox(), h[size])}>
      <SearchIcon aria-hidden className="ms-3 size-4 shrink-0 text-ink-2" />
      <input
        ref={ref}
        type="search"
        aria-label={placeholder}
        value={v}
        placeholder={placeholder}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => expandable && !v && setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setV("")}
        className={cn(inputCls, "ps-2 [&::-webkit-search-cancel-button]:hidden")}
      />
      {v && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setV("");
            ref.current?.focus();
          }}
          className="flex h-full w-10 shrink-0 items-center justify-center text-ink-2 hover:text-ink focus-visible:outline-offset-[-2px]"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

/* ---------- selection ---------- */

export function Select({ label, options, helper, defaultValue }: { label: string; options: string[]; helper?: string; defaultValue?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} helper={helper}>
      <div className={cn(fieldBox(), "h-10")}>
        <select id={id} defaultValue={defaultValue} className="h-full w-full appearance-none bg-transparent px-4 pe-10 text-sm text-ink focus:outline-none">
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute end-3 size-4 text-ink" />
      </div>
    </FieldShell>
  );
}

function Listbox({
  id,
  options,
  selected,
  onPick,
  multi,
  active,
}: {
  id: string;
  options: string[];
  selected: string[];
  onPick: (o: string) => void;
  multi?: boolean;
  active: number;
}) {
  return (
    <ul
      id={id}
      role="listbox"
      aria-multiselectable={multi || undefined}
      className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-box border border-line bg-layer-2 p-1 shadow-[0_8px_24px_rgb(15_23_42/0.12)] animate-pop"
    >
      {options.length === 0 && <li className="px-4 py-3 text-sm text-ink-2">No matches. Try another word.</li>}
      {options.map((o, i) => {
        const on = selected.includes(o);
        return (
          <li
            key={o}
            role="option"
            aria-selected={on}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPick(o)}
            className={cn(
              "flex h-9 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm text-ink-2 hover:bg-layer-hover hover:text-ink",
              on && !multi && "bg-layer-selected text-ink",
              i === active && "outline-2 outline-offset-[-2px] outline-focus",
            )}
          >
            {multi && <CheckBoxGlyph checked={on} />}
            <span className="flex-1 truncate">{o}</span>
            {on && !multi && <Check aria-hidden className="size-4 text-ink" />}
          </li>
        );
      })}
    </ul>
  );
}

export function Dropdown({ label, options, initial, helper }: { label: string; options: string[]; initial?: string; helper?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initial ?? "");
  const [active, setActive] = useState(-1);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  return (
    <FieldShell id={id} label={label} helper={helper}>
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-haspopup="listbox"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(options.length - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter" && open && active >= 0) {
              e.preventDefault();
              setValue(options[active]);
              setOpen(false);
            }
          }}
          className={cn(fieldBox(), "h-10 justify-between px-4 text-start focus-visible:outline-offset-[-2px]")}
        >
          <span className={cn("truncate", !value && "text-placeholder")}>{value || "Choose an option"}</span>
          <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <Listbox
            id={`${id}-list`}
            options={options}
            selected={[value]}
            active={active}
            onPick={(o) => {
              setValue(o);
              setOpen(false);
            }}
          />
        )}
      </div>
    </FieldShell>
  );
}

export function ComboBox({ label, options, placeholder = "Type to filter" }: { label: string; options: string[]; placeholder?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [value, setValue] = useState("");
  const [active, setActive] = useState(-1);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const list = useMemo(() => options.filter((o) => o.toLowerCase().includes(q.toLowerCase())), [options, q]);
  return (
    <FieldShell id={id} label={label}>
      <div ref={ref} className="relative">
        <div className={cn(fieldBox(), "h-10")}>
          <input
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            value={q}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setActive((a) => Math.min(list.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter" && list[active]) {
                setValue(list[active]);
                setQ(list[active]);
                setOpen(false);
              }
            }}
            className={inputCls}
          />
          {q && (
            <button type="button" aria-label="Clear selection" onClick={() => { setQ(""); setValue(""); }} className="flex h-full w-8 items-center justify-center text-ink-2 hover:text-ink">
              <X className="size-4" />
            </button>
          )}
          <ChevronDown aria-hidden className="me-3 size-4 shrink-0" />
        </div>
        {open && (
          <Listbox
            id={`${id}-list`}
            options={list}
            selected={[value]}
            active={active}
            onPick={(o) => {
              setValue(o);
              setQ(o);
              setOpen(false);
            }}
          />
        )}
      </div>
    </FieldShell>
  );
}

export function MultiSelect({ label, options, initial = [] }: { label: string; options: string[]; initial?: string[] }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string[]>(initial);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  return (
    <FieldShell id={id} label={label}>
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(fieldBox(), "h-10 gap-2 px-4 text-start focus-visible:outline-offset-[-2px]")}
        >
          {sel.length > 0 && (
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-inverse ps-2 pe-1 text-xs text-inverse-ink">
              {sel.length}
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear all selected items"
                onClick={(e) => {
                  e.stopPropagation();
                  setSel([]);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    setSel([]);
                  }
                }}
                className="inline-flex size-4 items-center justify-center rounded-full hover:bg-white/20"
              >
                <X className="size-3" />
              </span>
            </span>
          )}
          <span className={cn("flex-1 truncate", !sel.length && "text-placeholder")}>{sel.length ? sel.join(", ") : "Choose options"}</span>
          <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <Listbox
            id={`${id}-list`}
            multi
            options={options}
            selected={sel}
            active={-1}
            onPick={(o) => setSel((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]))}
          />
        )}
      </div>
    </FieldShell>
  );
}

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

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  indeterminate,
  hideLabel,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  hideLabel?: boolean;
}) {
  return (
    <label className={cn("group inline-flex cursor-pointer items-start gap-2 text-sm text-ink", disabled && "cursor-not-allowed opacity-50")}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? "mixed" : checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="mt-0.5 rounded-[2px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-focus">
        <CheckBoxGlyph checked={checked} indeterminate={indeterminate} />
      </span>
      <span className={cn(hideLabel && "sr-only")}>{label}</span>
    </label>
  );
}

export function RadioGroup({
  legend,
  options,
  value,
  onChange,
  orientation = "vertical",
  labels,
}: {
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  orientation?: "vertical" | "horizontal";
  labels?: Record<string, string>;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-2 text-xs text-ink-2">{legend}</legend>
      <div className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap gap-x-6")}>
        {options.map((o) => (
          <label key={o} className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="radio" name={name} className="peer sr-only" checked={value === o} onChange={() => onChange(o)} />
            <span
              aria-hidden
              className={cn(
                "inline-flex size-[18px] items-center justify-center rounded-full border-2 border-line-strong transition-colors",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-focus",
                value === o && "border-ink",
              )}
            >
              {value === o && <span className="size-2 rounded-full bg-ink animate-fade" />}
            </span>
            {labels?.[o] ?? o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  onText = "On",
  offText = "Off",
  size = "md",
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
  onText?: string;
  offText?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-2", disabled && "opacity-50")}>
      <span id={id} className="text-xs text-ink-2">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="inline-flex items-center gap-2 text-sm text-ink focus-visible:outline-none [&:focus-visible>span:first-child]:outline-2 [&:focus-visible>span:first-child]:outline-offset-2 [&:focus-visible>span:first-child]:outline-focus"
      >
        <span
          className={cn(
            "relative inline-flex shrink-0 rounded-full transition-colors duration-150",
            size === "md" ? "h-6 w-12" : "h-4 w-8",
            checked ? "bg-success" : "bg-line-strong",
          )}
        >
          <span
            className={cn(
              "absolute top-[3px] rounded-full bg-white transition-[inset-inline-start] duration-150",
              size === "md" ? "size-[18px]" : "size-2.5",
              checked ? (size === "md" ? "start-[27px]" : "start-[19px]") : "start-[3px]",
            )}
          />
        </span>
        <span aria-hidden>{checked ? onText : offText}</span>
      </button>
    </div>
  );
}

export function ContentSwitcher({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex w-full max-w-md gap-1 rounded-box bg-layer p-1">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          type="button"
          aria-selected={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "h-8 flex-1 rounded-lg px-4 text-sm transition-colors focus-visible:outline-offset-[-2px]",
            value === o ? "bg-bg font-medium text-ink shadow-[0_1px_3px_rgb(15_23_42/0.12)] ring-1 ring-line" : "bg-transparent text-ink-2 hover:text-ink",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Slider({ label, min = 0, max = 100, defaultValue = 40, unit = "" }: { label: string; min?: number; max?: number; defaultValue?: number; unit?: string }) {
  const id = useId();
  const [v, setV] = useState(defaultValue);
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-xs text-ink-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink">{min}</span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line-2 accent-[var(--text)] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
          style={{ background: `linear-gradient(to right, var(--text) ${pct}%, var(--border) ${pct}%)` }}
        />
        <span className="text-sm text-ink">{max}</span>
        <input
          aria-label={`${label} value`}
          type="number"
          value={v}
          min={min}
          max={max}
          onChange={(e) => setV(Math.min(max, Math.max(min, +e.target.value)))}
          className="h-10 w-16 rounded-box border border-line-2 bg-field px-2 text-center text-sm text-ink focus:outline-2 focus:outline-offset-[-2px] focus:outline-focus"
        />
        {unit && <span className="text-sm text-ink-2">{unit}</span>}
      </div>
    </div>
  );
}

/* ---------- date + time ---------- */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Calendar({ value, onPick }: { value: Date | null; onPick: (d: Date) => void }) {
  const [view, setView] = useState(() => {
    const b = value ?? new Date(2026, 10, 22);
    return new Date(b.getFullYear(), b.getMonth(), 1);
  });
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const lead = (view.getDay() + 6) % 7;
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const today = new Date(2026, 10, 22);
  return (
    <div className="w-72 rounded-box border border-line bg-layer-2 p-2 shadow-[0_8px_24px_rgb(15_23_42/0.12)]">
      <div className="flex items-center justify-between px-1 pb-2">
        <button type="button" aria-label="Previous month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-layer-hover rtl:rotate-180">
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-ink" aria-live="polite">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button type="button" aria-label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-layer-hover rtl:rotate-180">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div role="grid" className="grid grid-cols-7 text-center text-sm">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d} role="columnheader" className="py-1 text-xs text-ink-2">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const date = new Date(view.getFullYear(), view.getMonth(), d);
          const sel = value && date.toDateString() === value.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          return (
            <button
              key={d}
              type="button"
              role="gridcell"
              aria-selected={!!sel}
              aria-current={isToday ? "date" : undefined}
              onClick={() => onPick(date)}
              className={cn(
                "relative mx-auto inline-flex size-9 items-center justify-center text-ink hover:bg-layer-hover focus-visible:outline-offset-[-2px]",
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

export function DatePicker({ label, helper }: { label: string; helper?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Date | null>(null);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  return (
    <FieldShell id={id} label={label} helper={helper ?? "dd/mm/yyyy"}>
      <div ref={ref} className="relative w-full max-w-72">
        <div className={cn(fieldBox(), "h-10")}>
          <input id={id} readOnly value={value ? fmt(value) : ""} placeholder="dd/mm/yyyy" onClick={() => setOpen(true)} className={cn(inputCls, "cursor-pointer")} />
          <button type="button" aria-label="Open calendar" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex h-full w-10 items-center justify-center text-ink">
            <CalendarDays className="size-4" />
          </button>
        </div>
        {open && (
          <div className="absolute start-0 top-full z-30 mt-1 animate-pop">
            <Calendar
              value={value}
              onPick={(d) => {
                setValue(d);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </FieldShell>
  );
}

export function TimePicker({ label }: { label: string }) {
  const id = useId();
  const [t, setT] = useState("09:30");
  const ok = /^(0?[1-9]|1[0-2]):[0-5]\d$/.test(t);
  return (
    <FieldShell id={id} label={label} invalid={!ok && "Use hh:mm, for example 09:30."}>
      <div className="flex gap-px">
        <div className={cn(fieldBox(!ok), "h-10 w-28")}>
          <Clock aria-hidden className="ms-3 size-4 text-ink-2" />
          <input id={id} value={t} onChange={(e) => setT(e.target.value)} placeholder="hh:mm" className={cn(inputCls, "ps-2")} />
        </div>
        <select aria-label="AM or PM" className="h-10 rounded-box border border-line-2 bg-field px-3 text-sm text-ink focus:outline-2 focus:outline-offset-[-2px] focus:outline-focus">
          <option>AM</option>
          <option>PM</option>
        </select>
        <select aria-label="Time zone" className="h-10 rounded-box border border-line-2 bg-field px-3 text-sm text-ink focus:outline-2 focus:outline-offset-[-2px] focus:outline-focus">
          <option>Baghdad (GMT+3)</option>
          <option>UTC</option>
        </select>
      </div>
    </FieldShell>
  );
}

/* ---------- upload ---------- */

export function FileUploader({ title = "Upload files", note = "Max file size is 5 MB. Supported file types are .pdf, .jpg and .png." }: { title?: string; note?: string }) {
  const [files, setFiles] = useState<{ name: string; size: number; state: "uploading" | "done" | "error" }[]>([
    { name: "contract-signed.pdf", size: 812_000, state: "done" },
  ]);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const add = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).map((f) => ({ name: f.name, size: f.size, state: (f.size > 5_000_000 ? "error" : "uploading") as "error" | "uploading" }));
    setFiles((p) => [...p, ...next]);
    setTimeout(() => setFiles((p) => p.map((f) => (f.state === "uploading" ? { ...f, state: "done" } : f))), 1200);
  };
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-2">{note}</p>
      </div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-2 border border-dashed px-4 py-6 text-sm transition-colors",
          over ? "border-focus bg-tint" : "border-line-strong hover:bg-layer-hover",
        )}
      >
        <Upload aria-hidden className="size-5 text-link" />
        <span>
          <span className="text-link underline">Choose files</span> <span className="text-ink-2">or drag and drop them here</span>
        </span>
      </button>
      <input ref={input} type="file" multiple className="sr-only" tabIndex={-1} onChange={(e) => add(e.target.files)} />
      <ul className="flex flex-col gap-2" aria-live="polite">
        {files.map((f, i) => (
          <li key={i} className={cn("flex min-h-12 items-center gap-3 bg-layer px-4 py-2 text-sm", f.state === "error" && "outline-2 outline-offset-[-2px] outline-danger")}>
            <span className="flex-1 truncate text-ink">
              {f.name}
              {f.state === "error" && <span className="block text-xs text-danger-text">File is over 5 MB. Choose a smaller file.</span>}
            </span>
            {f.state === "uploading" && <span className="size-4 animate-spin rounded-full border-2 border-line-2 border-t-ink" aria-label="Uploading" />}
            {f.state === "done" && <Check aria-label="Uploaded" className="size-4 text-success" />}
            {f.state === "error" && <CircleAlert aria-hidden className="size-4 text-danger" />}
            <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="inline-flex size-8 items-center justify-center text-ink-2 hover:bg-layer-hover hover:text-ink">
              <X className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- groups ---------- */

export function FormGroup({ legend, children, helper }: { legend: string; children: ReactNode; helper?: string }) {
  return (
    <fieldset className="flex w-full flex-col gap-4">
      <legend className="mb-1 text-sm font-semibold text-ink">{legend}</legend>
      {helper && <p className="-mt-2 text-sm text-ink-2">{helper}</p>}
      {children}
    </fieldset>
  );
}

export function FluidInput({ label, placeholder, invalid }: { label: string; placeholder?: string; invalid?: string }) {
  const id = useId();
  return (
    <div className={cn("relative flex min-h-16 flex-col justify-center rounded-box border bg-field px-4 pt-2 focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-focus", invalid ? "border-danger outline-2 outline-offset-[-2px] outline-danger" : "border-line-2")}>
      <label htmlFor={id} className="text-xs text-ink-2">
        {label}
      </label>
      <input id={id} placeholder={placeholder} className="h-8 bg-transparent text-sm text-ink placeholder:text-placeholder focus:outline-none" aria-invalid={!!invalid || undefined} />
      {invalid && <p className="pb-2 text-xs text-danger-text">{invalid}</p>}
    </div>
  );
}

export function InputGroup({ prefix, suffix, children }: { prefix?: ReactNode; suffix?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-10 w-full items-stretch overflow-hidden rounded-box border border-line-2 bg-bg text-sm focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-focus">
      {prefix && <span className="flex items-center border-e border-line-2 bg-layer px-3 text-ink-2 [&>svg]:size-4">{prefix}</span>}
      {children}
      {suffix && <span className="flex items-center border-s border-line-2 bg-layer px-3 text-ink-2 [&>svg]:size-4">{suffix}</span>}
    </div>
  );
}

export function InputOTP({ length = 6, label = "Verification code" }: { length?: number; label?: string }) {
  const [vals, setVals] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const done = vals.every(Boolean);
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-xs text-ink-2">{label}</legend>
      <div className="flex items-center gap-2" dir="ltr">
        {vals.map((v, i) => (
          <span key={i} className="contents">
            {i === length / 2 && <span aria-hidden className="h-px w-3 bg-line-strong" />}
            <input
              ref={(el) => {
                refs.current[i] = el;
              }}
              aria-label={`Digit ${i + 1} of ${length}`}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={v}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "").slice(-1);
                setVals((p) => p.map((x, j) => (j === i ? d : x)));
                if (d) refs.current[i + 1]?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !vals[i]) refs.current[i - 1]?.focus();
                if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
                if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
              }}
              onPaste={(e) => {
                const d = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length).split("");
                if (d.length) {
                  e.preventDefault();
                  setVals(Array.from({ length }, (_, j) => d[j] ?? ""));
                  refs.current[Math.min(d.length, length - 1)]?.focus();
                }
              }}
              className="size-11 rounded-box border border-line-2 bg-bg text-center font-mono text-lg text-ink transition-colors focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus"
            />
          </span>
        ))}
      </div>
      <p className="text-xs text-ink-2" aria-live="polite">
        {done ? "Code complete. Checking…" : "Enter the 6-digit code we sent to your phone."}
      </p>
    </fieldset>
  );
}
