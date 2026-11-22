export function cn(...classes: unknown[]) {
  return classes.filter((c): c is string => typeof c === "string" && c.length > 0).join(" ");
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** An option for Select, Dropdown, ComboBox, MultiSelect, RadioGroup … A plain string is both value and label. */
export type SelectOption = string | { value: string; label: string; disabled?: boolean };
export interface NormalizedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export function normalizeOptions(options: readonly SelectOption[]): NormalizedOption[] {
  return options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
}
