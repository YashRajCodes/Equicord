/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { EquicordDevs } from "@utils/constants";
import definePlugin from "@utils/types";

let lastJumpAt = -Infinity, lastChannelId = "";

export default definePlugin({
    name: "FixJumps",
    description: "Prevents chat from repeatedly jumping to the bottom when you press Esc for a bit too long.",
    authors: [EquicordDevs.yash],
    patches: [{
        find: "MessageActionCreators",
        replacement: {
            match: /jumpToPresent\((\i)[^)]*\)\{/,
            replace: "$&if($self.shouldBlockJump($1))return;"
        }
    }],

    shouldBlockJump(id: string) {
        const now = performance.now(), blocked = id === lastChannelId && now - lastJumpAt < 250;
        return lastJumpAt = now, lastChannelId = id, blocked;
    }
});
