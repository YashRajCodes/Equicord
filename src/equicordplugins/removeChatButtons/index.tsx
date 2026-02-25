/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    hideVencord: {
        type: OptionType.BOOLEAN,
        description: "Hide all the chat buttons from plugins",
        default: false,
    },
    hideGift: {
        type: OptionType.BOOLEAN,
        description: "Hide the gift button",
        default: false,
    },
    hideGif: {
        type: OptionType.BOOLEAN,
        description: "Hide the gif button",
        default: false,
    },
    hideSticker: {
        type: OptionType.BOOLEAN,
        description: "Hide the sticker button",
        default: false,
    },
    hideEmoji: {
        type: OptionType.BOOLEAN,
        description: "Hide the emoji button",
        default: false,
    },
    hideAppLauncher: {
        type: OptionType.BOOLEAN,
        description: "Hide the appLauncher button",
        default: false,
    }
});

export default definePlugin({
    name: "RemoveChatButtons",
    description: "Adds the ability to remove certain chat buttons.",
    authors: [EquicordDevs.yash],
    settings,
    patches: [
        {
            find: '"sticker")',
            replacement: {
                match: /(?<="div",\{.{0,15}children:)(.+?)\}/,
                replace: "$self.removeButtons($1)}"
            }
        }
    ],
    removeButtons(buttons: any[]) {
        return [buttons].flat().filter(button => {
            if (!button?.key) return true;

            const { key } = button;
            if (settings.store.hideVencord && key === "vencord-chat-buttons") return false;
            if (settings.store.hideGift && key === "gift") return false;
            if (settings.store.hideGif && key === "gif") return false;
            if (settings.store.hideSticker && key === "sticker") return false;
            if (settings.store.hideEmoji && key === "emoji") return false;
            if (settings.store.hideAppLauncher && key === "appLauncher") return false;
            return true;
        });
    },
});
