// PriceProof hand-in for make.fun black-friday-deal-finder-01.
//
// The site lives in app/ next to this file: plain static files (HTML, CSS
// and ES modules, no build step) that any static server can host. This
// program is the only thing the grader runs, on Node 22 with the standard
// library only. It copies app/ and screenshots/ into the output directory
// and writes dossier.json there with the vendored make.fun library, so the
// judge reads exactly the site and screenshots this repository holds.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (In the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used.)
// It must print the same bytes on every run: the copy is a plain recursive
// copy and the dossier is built from the copied files, nothing else.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The caps the gate enforces on the handed-in directory. They mirror the
// competition's rules: at most 4 screenshots of 256 KiB, app/ at most 993
// entries and 16 MiB, and the dossier text at most 160 KiB.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function countEntries(dir: string): number {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    total += 1;
    if (statSync(path).isDirectory()) total += countEntries(path);
  }
  return total;
}

function fail(message: string): never {
  throw new Error(`PriceProof hand-in failed: ${message}`);
}

const appDir = join(repoRoot, "app");
if (!existsSync(appDir) || !statSync(appDir).isDirectory()) fail("app/ is missing");
if (!existsSync(join(appDir, "index.html"))) fail("app/index.html is missing");

const shotsDir = join(repoRoot, "screenshots");
if (!existsSync(shotsDir) || !statSync(shotsDir).isDirectory()) fail("screenshots/ is missing");
const shots = readdirSync(shotsDir).filter((name) => !name.startsWith("."));
if (shots.length < 3 || shots.length > 4) fail(`expected 3 or 4 screenshots, found ${shots.length}`);

mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outDir, CAPS);
writeFileSync(join(outDir, "dossier.json"), dossier);

console.log(
  `PriceProof handed in: ${countEntries(join(outDir, "app"))} app entries, ` +
    `${shots.length} screenshots, dossier ${Buffer.byteLength(dossier)} bytes.`,
);
