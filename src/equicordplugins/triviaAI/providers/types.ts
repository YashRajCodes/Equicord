/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const AIProvider = {
    OpenAICompatible: "openai-compatible",
    OpenRouter: "openrouter",
    GoogleAIStudio: "google-ai-studio"
} as const;

export type AIProvider = typeof AIProvider[keyof typeof AIProvider];

export interface TextPart {
    type: "text";
    text: string;
}

export interface ImagePart {
    type: "image_url";
    image_url: {
        url: string;
        detail?: "auto" | "high" | "low";
    };
}

export type ContentPayload = string | (TextPart | ImagePart)[];

export interface ApiMessage {
    role: "user" | "assistant" | "system";
    content: ContentPayload;
}

export interface ProviderSettings {
    apiKey: string;
    endpoint: string;
    maxTokens: number;
    model: string;
}
