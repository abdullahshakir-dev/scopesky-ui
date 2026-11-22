// Reads packages/ui/src with the TypeScript compiler and writes
// src/lib/props-data.json: for every exported component, its props with
// type, default (from the destructuring) and whether they are required.
// The docs' Properties tables come from this file, so they always match the code.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = join(root, "packages", "ui");
const config = ts.getParsedCommandLineOfConfigFile(join(pkg, "tsconfig.json"), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
const program = ts.createProgram(config.fileNames, { ...config.options, noEmit: true });
const checker = program.getTypeChecker();

// Props every DOM element accepts; listing them would bury the real API.
const isNoise = (name, decl) => {
  if (name === "key" || name === "ref") return true;
  const file = decl?.getSourceFile().fileName ?? "";
  return file.includes("node_modules");
};

const flags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType;
// Spell out unions of literals ('primary' | 'secondary' …) instead of an alias name like ButtonKind.
const typeText = (t, node) => {
  const parts = t.isUnion() ? t.types.filter((u) => !(u.flags & ts.TypeFlags.Undefined)) : [t];
  if (parts.length > 1 && parts.every((u) => u.isLiteral() || u.flags & ts.TypeFlags.BooleanLiteral)) {
    const lits = parts.map((u) => checker.typeToString(u, node, flags));
    if (lits.length === 2 && lits.includes("true") && lits.includes("false")) return "boolean";
    return lits.join(" | ");
  }
  return rawType(t, node);
};
const rawType = (t, node) =>
  checker
    .typeToString(t, node, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType)
    .replace(/\s*\|\s*undefined$/, "")
    .replace(/^undefined\s*\|\s*/, "");

const out = {};
for (const sf of program.getSourceFiles()) {
  if (!sf.fileName.startsWith(join(pkg, "src").replace(/\\/g, "/"))) continue;
  const moduleSym = checker.getSymbolAtLocation(sf);
  if (!moduleSym) continue;
  for (const exp of checker.getExportsOfModule(moduleSym)) {
    const name = exp.getName();
    if (!/^[A-Z]/.test(name)) continue;
    const decl = exp.valueDeclaration;
    // Re-exports (index.ts) point at the same declarations; read each one where it lives.
    if (!decl || decl.getSourceFile() !== sf) continue;

    // function Foo(props) {}  |  const Foo = forwardRef(function Foo(props, ref) {})
    let fn = ts.isFunctionDeclaration(decl) ? decl : null;
    if (!fn && ts.isVariableDeclaration(decl) && decl.initializer && ts.isCallExpression(decl.initializer)) {
      const arg = decl.initializer.arguments[0];
      if (arg && (ts.isFunctionExpression(arg) || ts.isArrowFunction(arg))) fn = arg;
    }
    const param = fn?.parameters[0];
    if (!param) continue;

    const defaults = {};
    if (ts.isObjectBindingPattern(param.name)) {
      for (const el of param.name.elements) {
        const key = (el.propertyName ?? el.name).getText();
        if (el.initializer) defaults[key] = el.initializer.getText(el.getSourceFile());
      }
    }

    const type = checker.getTypeAtLocation(param);
    const props = [];
    for (const p of type.getProperties()) {
      const pDecl = p.valueDeclaration ?? p.declarations?.[0];
      if (isNoise(p.getName(), pDecl)) continue;
      const pType = checker.getTypeOfSymbolAtLocation(p, param);
      const optional = (p.flags & ts.SymbolFlags.Optional) !== 0;
      props.push({
        name: p.getName(),
        type: typeText(pType, param),
        default: defaults[p.getName()] ?? "",
        required: !optional,
        description: ts.displayPartsToString(p.getDocumentationComment(checker)),
      });
    }
    // Only keep things that look like components (they take a props object).
    if (props.length || ts.isObjectBindingPattern(param.name)) {
      props.sort((a, b) => Number(b.required) - Number(a.required));
      out[name] = props;
    }
  }
}

writeFileSync(join(root, "src", "lib", "props-data.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`props: wrote ${Object.keys(out).length} components to src/lib/props-data.json`);
