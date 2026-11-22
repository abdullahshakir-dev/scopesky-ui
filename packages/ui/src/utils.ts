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
