// Source of truth for the palette, taken from "05 Foundations — Colors".

export type Rating = "AAA" | "AA" | "AA large" | "—";

export interface ScaleStep {
  step: string;
  hex: string;
  vsWhite: string;
  vsWhiteRating: Rating;
  vsBlack: string;
  vsBlackRating: Rating;
  usage: string;
}

export const brand = [
  {
    name: "Sky Blue",
    hex: "#0094DA",
    rgb: "0, 148, 218",
    token: "--ss-blue-500",
    usage:
      "Signature brand color: logo, header stripe, illustrations and large display text. Not for small text or white-text buttons (3.4:1).",
  },
  {
    name: "Ocean Blue",
    hex: "#0183BE",
    rgb: "1, 131, 190",
    token: "--ss-blue-600",
    usage: "Focus rings, active borders, selected tabs, icons and large text.",
  },
  {
    name: "Deep Navy",
    hex: "#004969",
    rgb: "0, 73, 105",
    token: "--ss-blue-900",
    usage: "Pressed states, dark brand surfaces and brand headings on light backgrounds.",
  },
];

export const supporting = [
  { name: "White", hex: "#FFFFFF", rgb: "255, 255, 255", token: "--ss-white", usage: "Page background in the light theme." },
  { name: "Near Black", hex: "#111111", rgb: "17, 17, 17", token: "--ss-near-black", usage: "Page background in the dark theme." },
  { name: "Cool Gray", hex: "#F4F7FA", rgb: "244, 247, 250", token: "--ss-cool-gray", usage: "Secondary surfaces, input fields and tiles on white." },
];

export const blueScale: ScaleStep[] = [
  { step: "50", hex: "#EAF7FD", vsWhite: "1.09:1", vsWhiteRating: "—", vsBlack: "17.28:1", vsBlackRating: "AAA", usage: "Brand tints; blue table zebra" },
  { step: "75", hex: "#DFEAF3", vsWhite: "1.22:1", vsWhiteRating: "—", vsBlack: "15.46:1", vsBlackRating: "AAA", usage: "Blue table: row hover" },
  { step: "100", hex: "#CDEBFA", vsWhite: "1.24:1", vsWhiteRating: "—", vsBlack: "15.16:1", vsBlackRating: "AAA", usage: "Highlights" },
  { step: "125", hex: "#D6E5F0", vsWhite: "1.28:1", vsWhiteRating: "—", vsBlack: "14.67:1", vsBlackRating: "AAA", usage: "Blue table: selected rows" },
  { step: "150", hex: "#CCDEEB", vsWhite: "1.38:1", vsWhiteRating: "—", vsBlack: "13.68:1", vsBlackRating: "AAA", usage: "Blue table: selected row on hover" },
  { step: "175", hex: "#C1D6E6", vsWhite: "1.49:1", vsWhiteRating: "—", vsBlack: "12.61:1", vsBlackRating: "AAA", usage: "Blue table: pressed rows" },
  { step: "200", hex: "#9DD8F3", vsWhite: "1.54:1", vsWhiteRating: "—", vsBlack: "12.18:1", vsBlackRating: "AAA", usage: "Links on dark (hover)" },
  { step: "300", hex: "#65C0E9", vsWhite: "2.04:1", vsWhiteRating: "—", vsBlack: "9.23:1", vsBlackRating: "AAA", usage: "Links on dark" },
  { step: "400", hex: "#2BA7DF", vsWhite: "2.72:1", vsWhiteRating: "—", vsBlack: "6.91:1", vsBlackRating: "AA", usage: "Interactive on dark" },
  { step: "500", hex: "#0094DA", vsWhite: "3.36:1", vsWhiteRating: "AA large", vsBlack: "5.61:1", vsBlackRating: "AA", usage: "Sky Blue: accent, selected-row bar" },
  { step: "600", hex: "#0183BE", vsWhite: "4.20:1", vsWhiteRating: "AA large", vsBlack: "4.48:1", vsBlackRating: "AA large", usage: "Ocean Blue: focus rings, borders" },
  { step: "700", hex: "#006B9B", vsWhite: "5.87:1", vsWhiteRating: "AA", vsBlack: "3.21:1", vsBlackRating: "AA large", usage: "Buttons and links" },
  { step: "800", hex: "#00547B", vsWhite: "8.22:1", vsWhiteRating: "AAA", vsBlack: "2.29:1", vsBlackRating: "—", usage: "Hover" },
  { step: "900", hex: "#004969", vsWhite: "9.73:1", vsWhiteRating: "AAA", vsBlack: "1.93:1", vsBlackRating: "—", usage: "Deep Navy: pressed" },
  { step: "950", hex: "#003044", vsWhite: "13.94:1", vsWhiteRating: "AAA", vsBlack: "1.35:1", vsBlackRating: "—", usage: "Deepest brand surface" },
];

export const neutralScale: ScaleStep[] = [
  { step: "50", hex: "#F8FAFC", vsWhite: "1.04:1", vsWhiteRating: "—", vsBlack: "18.04:1", vsBlackRating: "AAA", usage: "Page backgrounds, expanded-row details" },
  { step: "100", hex: "#F1F5F9", vsWhite: "1.09:1", vsWhiteRating: "—", vsBlack: "17.23:1", vsBlackRating: "AAA", usage: "Surfaces, hover on white; grey zebra" },
  { step: "150", hex: "#EAEEF3", vsWhite: "1.16:1", vsWhiteRating: "—", vsBlack: "16.20:1", vsBlackRating: "AAA", usage: "Grey table: row and control hover" },
  { step: "200", hex: "#E2E8F0", vsWhite: "1.23:1", vsWhiteRating: "—", vsBlack: "15.31:1", vsBlackRating: "AAA", usage: "Borders, dividers; grey selected rows" },
  { step: "250", hex: "#DAE1E9", vsWhite: "1.31:1", vsWhiteRating: "—", vsBlack: "14.32:1", vsBlackRating: "AAA", usage: "Selected hover, pressed, row dividers" },
  { step: "300", hex: "#CBD5E1", vsWhite: "1.48:1", vsWhiteRating: "—", vsBlack: "12.71:1", vsBlackRating: "AAA", usage: "Table outline, header line, controls" },
  { step: "400", hex: "#94A3B8", vsWhite: "2.56:1", vsWhiteRating: "—", vsBlack: "7.36:1", vsBlackRating: "AAA", usage: "Muted icons, decorative only" },
  { step: "500", hex: "#64748B", vsWhite: "4.75:1", vsWhiteRating: "AA", vsBlack: "3.96:1", vsBlackRating: "AA large", usage: "Input and checkbox borders, placeholder" },
  { step: "550", hex: "#5E6E84", vsWhite: "5.19:1", vsWhiteRating: "AA", vsBlack: "3.63:1", vsBlackRating: "AA large", usage: "Muted text on table rows" },
  { step: "600", hex: "#475569", vsWhite: "7.57:1", vsWhiteRating: "AAA", vsBlack: "2.42:1", vsBlackRating: "—", usage: "Secondary text; text on selected rows" },
  { step: "800", hex: "#1E293B", vsWhite: "14.62:1", vsWhiteRating: "AAA", vsBlack: "1.29:1", vsBlackRating: "—", usage: "Headings" },
  { step: "950", hex: "#0F172A", vsWhite: "17.85:1", vsWhiteRating: "AAA", vsBlack: "1.05:1", vsBlackRating: "—", usage: "Primary text" },
];

export const contrastChecks = [
  { pair: "Text on primary button", fg: "#FFFFFF", bg: "#006B9B", context: "Light", ratio: "5.87:1", needs: "4.5:1", result: "Pass" },
  { pair: "Link on page background", fg: "#006B9B", bg: "#FFFFFF", context: "Light", ratio: "5.87:1", needs: "4.5:1", result: "Pass" },
  { pair: "Secondary text on Cool Gray", fg: "#475569", bg: "#F4F7FA", context: "Light", ratio: "7.04:1", needs: "4.5:1", result: "Pass" },
  { pair: "Placeholder text in fields", fg: "#64748B", bg: "#F4F7FA", context: "Light", ratio: "4.42:1", needs: "4.5:1", result: "Below AA" },
  { pair: "Input border on page", fg: "#64748B", bg: "#FFFFFF", context: "Light", ratio: "4.75:1", needs: "3:1", result: "Pass" },
  { pair: "Focus ring on page", fg: "#0183BE", bg: "#FFFFFF", context: "Light", ratio: "4.20:1", needs: "3:1", result: "Pass" },
  { pair: "Link on dark background", fg: "#65C0E9", bg: "#111111", context: "Dark", ratio: "9.23:1", needs: "4.5:1", result: "Pass" },
  { pair: "White text on Sky Blue", fg: "#FFFFFF", bg: "#0094DA", context: "Reference", ratio: "3.36:1", needs: "4.5:1", result: "Large text only" },
  { pair: "White text on Ocean Blue", fg: "#FFFFFF", bg: "#0183BE", context: "Reference", ratio: "4.20:1", needs: "4.5:1", result: "Large text only" },
  { pair: "Muted link on a grey zebra row", fg: "#5E6E84", bg: "#F1F5F9", context: "Grey table", ratio: "4.74:1", needs: "4.5:1", result: "Pass" },
  { pair: "Muted link on a blue zebra row", fg: "#5E6E84", bg: "#EAF7FD", context: "Blue table", ratio: "4.75:1", needs: "4.5:1", result: "Pass" },
  { pair: "Text on a selected row", fg: "#475569", bg: "#E2E8F0", context: "Grey table", ratio: "6.14:1", needs: "4.5:1", result: "Pass" },
  { pair: "Text on a pressed row", fg: "#475569", bg: "#C1D6E6", context: "Blue table", ratio: "5.06:1", needs: "4.5:1", result: "Pass" },
  { pair: "Checkbox border on a pressed row", fg: "#64748B", bg: "#C1D6E6", context: "Blue table", ratio: "3.17:1", needs: "3:1", result: "Pass" },
  { pair: "Focus ring on a blue zebra row", fg: "#0183BE", bg: "#EAF7FD", context: "Blue table", ratio: "3.85:1", needs: "3:1", result: "Pass" },
  { pair: "Sky Blue focus on a pressed blue row", fg: "#0094DA", bg: "#C1D6E6", context: "Reference", ratio: "2.24:1", needs: "3:1", result: "Below 3:1" },
];

export const statusColors = [
  { status: "Success", arabic: "نجاح", label: "Active", labelAr: "نشط", accent: "#24A148", solid: "#15803D", tint: "#DEFBE6", text: "#0E6027" },
  { status: "Warning", arabic: "تحذير", label: "In progress", labelAr: "قيد التنفيذ", accent: "#F1C21B", solid: "#B45309", tint: "#FCF4D6", text: "#8A3C04" },
  { status: "Danger", arabic: "خطأ", label: "On hold", labelAr: "متوقف", accent: "#DA1E28", solid: "#B91C1C", tint: "#FFF1F1", text: "#A2191F" },
  { status: "Info", arabic: "معلومات", label: "New", labelAr: "جديد", accent: "#0183BE", solid: "#006B9B", tint: "#EAF7FD", text: "#004969" },
  { status: "Neutral", arabic: "محايد", label: "Draft", labelAr: "مسودة", accent: "#64748B", solid: "#475569", tint: "#F1F5F9", text: "#1E293B" },
];

export const typeScale = [
  { token: "display-01", size: 42, line: 63, weight: 400, sample: "ScopeSky UI", use: "Page titles" },
  { token: "heading-04", size: 28, line: 42, weight: 400, sample: "Start here", use: "Section titles" },
  { token: "body-lead", size: 20, line: 30, weight: 400, sample: "Components, tokens and patterns for every ScopeSky website.", use: "Page lead" },
  { token: "heading-02", size: 16, line: 24, weight: 600, sample: "When to use", use: "Sub-headings, tile titles" },
  { token: "body-01", size: 14, line: 21, weight: 400, sample: "Run this library, then use Carbon with the ScopeSky theme.", use: "Body copy, nav" },
  { token: "code-01", size: 13, line: 20, weight: 400, sample: "#0094DA · RGB 0, 148, 218", use: "Hex values, token names" },
  { token: "label-01", size: 12, line: 18, weight: 400, sample: "Email address", use: "Field labels, helper text" },
];

export const spacing = [
  { token: "spacing-01", px: 2 },
  { token: "spacing-02", px: 4 },
  { token: "spacing-03", px: 8 },
  { token: "spacing-04", px: 12 },
  { token: "spacing-05", px: 16 },
  { token: "spacing-06", px: 24 },
  { token: "spacing-07", px: 32 },
  { token: "spacing-08", px: 40 },
  { token: "spacing-09", px: 48 },
  { token: "spacing-10", px: 64 },
];
