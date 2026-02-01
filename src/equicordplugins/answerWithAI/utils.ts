/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { sendMessage } from "@utils/discord";
import { Message } from "@vencord/discord-types";

import { settings } from "./settings";

type TextPart = {
    type: "text";
    text: string;
};

type ImagePart = {
    type: "image_url";
    image_url: {
        url: string;
        detail?: "auto" | "high" | "low";
    };
};

export type ContentPayload = string | (TextPart | ImagePart)[];

export function parseMessageContent(message: Message): ContentPayload | null {
    if (!settings.store.supportImages) {
        return message.content || null;
    }

    const text = message.content;

    const images = message.attachments
        .filter(att => att.content_type?.startsWith("image/"))
        .map(att => att.url);

    if (images.length === 0) {
        return text || null;
    }

    const payload: (TextPart | ImagePart)[] = [];

    if (text && text.trim().length > 0) {
        payload.push({
            type: "text",
            text: text
        });
    }

    images.forEach(url => {
        payload.push({
            type: "image_url",
            image_url: { url }
        });
    });

    return payload;
}

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

export async function getResponse(payload: ContentPayload): Promise<string> {
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
                    content: payload
                }
            ],
            max_tokens: settings.store.maxTokens,
        })
    });

    const data = await req.json();

    if (data.error) {
        console.log(`API Error: ${data.error.message || "An unknown error occurred"}`);
    }

    const response = data.choices[0].message.content;

    if (!response || response.trim().length === 0) {
        console.log("no response from AI model");
    }

    return response;
}

export function cl(className: string) {
    return `vc-awai-${className}`;
}
