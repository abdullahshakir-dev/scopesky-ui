// Builds dist/ui.css: every class the components use, plus the ScopeSky tokens,
// as plain CSS. Projects that don't use Tailwind v4 (Tailwind v3, plain CSS,
// CSS modules …) import this file instead of styles.css.
//
// Tailwind's reset (preflight) is left out so it doesn't fight the project's own,
// and the utilities are not put in a CSS layer: unlayered rules always beat
// layered ones, so a Tailwind v3 reset like `button { background: transparent }`
// would otherwise win over `.bg-primary`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile, optimize } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist", "ui.css");

const input = [
  '@import "tailwindcss/theme.css";',
  '@import "tailwindcss/utilities.css";',
  '@import "./styles.css";',
].join("\n");

const compiler = await compile(input, { base: root, onDependency: () => {} });

const scanner = new Scanner({
  sources: [{ base: path.join(root, "dist"), pattern: "**/*.js", negated: false }],
});
const candidates = scanner.scan();

const css = optimize(compiler.build(candidates), { minify: true }).code;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, css);
console.log(`css: wrote dist/ui.css (${candidates.length} classes scanned, ${(css.length / 1024).toFixed(1)} kB)`);
