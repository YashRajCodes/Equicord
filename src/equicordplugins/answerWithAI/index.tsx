/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { EquicordDevs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Message } from "@vencord/discord-types";
import { ChannelStore, Menu } from "@webpack/common";

import { AnswerIcon } from "./answerIcon";
import { settings } from "./settings";
import { getResponse, handleResponse, parseMessageContent } from "./utils";

const messageCtxPatch: NavContextMenuPatchCallback = (children, { message }: { message: Message; }) => {
    const payload = parseMessageContent(message);
    if (!payload) return;

    const group = findGroupChildrenByChildId("copy-text", children);
    if (!group) return;

    group.splice(group.findIndex(c => c?.props?.id === "copy-text") + 1, 0, (
        <Menu.MenuItem
            id="vc-awai"
            label="Answer With AI"
            icon={AnswerIcon}
            action={async () => {
                const ans = await getResponse(payload);
                handleResponse(message, ans);
            }}
        />
    ));
};

function getMessageContent(message: Message) {
    // Message snapshots is an array, which allows for nested snapshots, which Discord does not do yet.
    // no point collecting content or rewriting this to render in a certain way that makes sense
    // for something currently impossible.
    return message.content
        || message.messageSnapshots?.[0]?.message.content
        || message.embeds?.find(embed => embed.type === "auto_moderation_message")?.rawDescription || "";
}

export default definePlugin({
    name: "Answer With AI",
    description: "Adds a button to answer messages using AI.",
    authors: [EquicordDevs.yash],
    settings,
    contextMenus: {
        "message": messageCtxPatch
    },
    messagePopoverButton: {
        icon: AnswerIcon,
        render(message: Message) {
            const payload = parseMessageContent(message);
            if (!payload) return null;

            return {
                label: "Answer With AI",
                icon: AnswerIcon,
                message,
                channel: ChannelStore.getChannel(message.channel_id),
                onClick: async () => {
                    const ans = await getResponse(payload);
                    handleResponse(message, ans);
                }
            };
        }
    }
});
