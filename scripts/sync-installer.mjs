/**
 * Copy the host-side setup wizard into `public/_setup/`.
 *
 * Runs as this repo's `prebuild` step, so `npm run build` always ships a
 * matching installer: Astro copies `public/` verbatim into `dist/`, the build
 * workflow force-pushes `dist/` onto the orphan `release` branch, and Plesk
 * pulls it. The wizard therefore reaches the host with no pipeline change.
 *
 * Source of truth is `@tracht-digital-solutions/tds-shared/install` — one
 * wizard and one proxy for all three public sites, differing only in the
 * profile copied here as `profile.php`. Keeping three hand-maintained copies is
 * exactly the drift the gateway's `.env` writers taught this project to avoid.
 *
 * Usage: node scripts/sync-installer.mjs <profile-id>
 *
 * A missing package is a WARNING, not an error: `npm install` without registry
 * auth is a normal state for a contributor who only wants to run type-check,
 * and failing the build there would be a worse trade than shipping without the
 * optional installer.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const profileId = process.argv[2];
if (!profileId) {
  console.error("[sync-installer] missing profile id (landingpage | blog | tools)");
  process.exit(1);
}

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "node_modules", "@tracht-digital-solutions", "tds-shared", "install");
const target = join(root, "public", "_setup");

if (!existsSync(source)) {
  console.warn(
    `[sync-installer] ${source} not found — skipping. The deployed site will have no /_setup wizard.`,
  );
  process.exit(0);
}

const profile = join(source, "profiles", `${profileId}.php`);
if (!existsSync(profile)) {
  const available = readdirSync(join(source, "profiles")).join(", ");
  console.error(`[sync-installer] unknown profile "${profileId}". Available: ${available}`);
  process.exit(1);
}

// Wipe first: a profile renamed upstream would otherwise linger here forever,
// and two profile files in _setup/ is not a state the wizard can resolve.
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

for (const file of ["install.php", "proxy.php"]) {
  cpSync(join(source, file), join(target, file));
}
copyFileSync(profile, join(target, "profile.php"));

console.log(`[sync-installer] public/_setup ← tds-shared/install (profile: ${profileId})`);
