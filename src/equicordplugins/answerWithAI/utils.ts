/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { sendMessage } from "@utils/discord";
import { Message } from "@vencord/discord-types";

import { settings } from "./settings";

export async function handleResponse(message: Message, response: string): Promise<string> {
    if (settings.store.autoRespond) {
        sendMessage(
            message.channel_id,
            { content: response },
            true,
            { messageReference: { channel_id: message.channel_id, message_id: message.id } }
        );
        return response;
    } else {
        return response;
    }
}

export async function getResponse(prompt: string): Promise<string> {
    const req = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${settings.store.apiKey}`
        },
        body: JSON.stringify({
            model: settings.store.model,
            messages: [
                {
                    role: "system",
                    content: settings.store.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: settings.store.maxTokens,
        })
    });

    const data = await req.json();
    return data.choices[0].message.content;
}

export function cl(className: string) {
    return `vc-awai-${className}`;
}
