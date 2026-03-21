/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { basename } from "path";

const BLOCKED_CLIENTS = [
    Buffer.from("bGlnaHRjb3Jk", "base64").toString(),
    "discord"
];

export function verifyClientIntegrity() {
    const execName = basename(process.execPath).toLowerCase();
    for (const blocked of BLOCKED_CLIENTS) {
        if (execName.includes(blocked)) {
            console.error(`[Equicord] Unauthorized client detected: "${blocked}". Equicord cannot load in this environment.`);
            return false;
        }
    }
    console.log("[Equicord] Client integrity verified.");
    return true;
}
