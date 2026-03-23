/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// @ts-check

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { createInterface } from "readline/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PackageJSON = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));

const rawList = execSync("pnpm list --json --depth 0", { cwd: root, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
const pnpmList = JSON.parse(rawList)[0];
const installedDeps = { ...pnpmList.dependencies, ...pnpmList.devDependencies };

const requiredDeps = [
    ...Object.keys(PackageJSON.dependencies || {}),
    ...Object.keys(PackageJSON.devDependencies || {})
];

const missing = requiredDeps.filter(d => {
    const v = PackageJSON.dependencies?.[d] ?? PackageJSON.devDependencies?.[d];
    return !v?.startsWith("link:") && !v?.startsWith("workspace:") && !installedDeps?.[d];
});

if (missing.length) {
    console.error(`\x1b[31mMissing ${missing.length} package(s): ${missing.join(", ")}\x1b[0m`);
    const rl = createInterface({ input: process.stdin, output: process.stderr });
    rl.on("SIGINT", () => { rl.close(); process.exit(1); });
    try {
        const ans = await rl.question("\x1b[33mRun 'pnpm install'? [Y/n]: \x1b[0m");
        if (!ans || /^y/i.test(ans)) execSync("pnpm install --frozen-lockfile", { cwd: root, stdio: "inherit" });
    } finally { rl.close(); }
}

