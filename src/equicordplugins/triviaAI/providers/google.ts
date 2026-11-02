/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isObject } from "@utils/misc";

import { ApiMessage, ContentPayload, ImagePart, ProviderSettings } from "./types";

interface GeminiPart {
    text: string;
}

interface GeminiImagePart {
    inlineData: {
        mimeType: string;
        data: string;
    };
}

type GeminiRequestPart = GeminiPart | GeminiImagePart;

export class GoogleAIStudioProvider {
    async createChatCompletion(messages: ApiMessage[], settings: ProviderSettings): Promise<string> {
        if (!settings.apiKey || !settings.model) throw new Error("API key and model are required.");

        const systemParts = (await Promise.all(
            messages.filter(message => message.role === "system").map(message => toGeminiParts(message.content))
        )).flat();

        const contents = (await Promise.all(
            messages
                .filter(message => message.role !== "system")
                .map(async message => ({
                    role: message.role === "assistant" ? "model" as const : "user" as const,
                    parts: await toGeminiParts(message.content)
                }))
        )).filter(content => content.parts.length > 0);

        if (contents.length === 0) throw new Error("The AI request contains no usable messages.");

        const model = settings.model.replace(/^models\//, "").replace(/^google\//, "");
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": settings.apiKey
                },
                body: JSON.stringify({
                    contents,
                    ...(systemParts.length > 0 ? { systemInstruction: { parts: systemParts } } : {}),
                    generationConfig: { maxOutputTokens: settings.maxTokens }
                })
            }
        );

        const rawBody = await response.text();
        let data: unknown;

        try {
            data = JSON.parse(rawBody);
        } catch {
            data = null;
        }

        const error = getErrorMessage(data);
        if (!response.ok || error) {
            throw new Error(error ?? (rawBody || `The AI provider returned status ${response.status}.`));
        }

        const text = getResponseText(data);
        if (!text.trim()) throw new Error("The AI model returned an empty response.");

        return text;
    }
}

async function toGeminiParts(content: ContentPayload): Promise<GeminiRequestPart[]> {
    if (typeof content === "string") return [{ text: content }];

    return (await Promise.all(content.map(part => part.type === "text" ? { text: part.text } : toGeminiImagePart(part))))
        .filter((part): part is GeminiRequestPart => part !== null);
}

async function toGeminiImagePart(part: ImagePart): Promise<GeminiImagePart | null> {
    const dataUrl = part.image_url.url.match(/^data:([^;,]+);base64,(.+)$/);
    if (dataUrl) {
        return {
            inlineData: {
                mimeType: dataUrl[1],
                data: dataUrl[2]
            }
        };
    }

    const response = await fetch(part.image_url.url);
    if (!response.ok) return null;

    let binary = "";
    const bytes = new Uint8Array(await response.arrayBuffer());
    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }

    return {
        inlineData: {
            mimeType: response.headers.get("content-type")?.split(";", 1)[0] ?? "image/png",
            data: btoa(binary)
        }
    };
}

function getErrorMessage(data: unknown): string | null {
    if (!isObject(data) || !("error" in data) || !isObject(data.error)) return null;

    return "message" in data.error && typeof data.error.message === "string" ? data.error.message : null;
}

function getResponseText(data: unknown): string {
    if (!isObject(data) || !("candidates" in data) || !Array.isArray(data.candidates)) return "";

    const candidate = data.candidates[0];
    if (!isObject(candidate) || !("content" in candidate) || !isObject(candidate.content)) return "";
    if (!("parts" in candidate.content) || !Array.isArray(candidate.content.parts)) return "";

    return candidate.content.parts.flatMap(part =>
        isObject(part) && "text" in part && typeof part.text === "string" ? [part.text] : []
    ).join("");
}
