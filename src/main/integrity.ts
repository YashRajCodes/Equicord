/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { basename } from "path";

const BLOCKED_CLIENTS = [
    Buffer.from("bGlnaHRjb3Jk", "base64").toString(),
];

export function verifyClientIntegrity() {
    const exeName = basename(process.execPath).toLowerCase();
    for (const blocked of BLOCKED_CLIENTS) {
        if (exeName.includes(blocked)) {
            throw new Error(
                `[Equicord] Unauthorized client detected: "${blocked}". Equicord cannot load in this environment.`
            );
        }
    }
    console.log("[Equicord] Client integrity verified.");
}
