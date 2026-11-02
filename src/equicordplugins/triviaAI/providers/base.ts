/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isObject } from "@utils/misc";

import { ApiMessage, ProviderSettings } from "./types";

export abstract class BaseAIProvider {
    protected abstract getEndpoint(settings: ProviderSettings): string;

    protected getHeaders(settings: ProviderSettings): Record<string, string> {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${settings.apiKey}`
        };
    }

    async createChatCompletion(messages: ApiMessage[], settings: ProviderSettings): Promise<string> {
        if (!settings.apiKey || !settings.model) throw new Error("API key and model are required.");

        const endpoint = this.getEndpoint(settings);
        if (!endpoint) throw new Error("An AI endpoint is required.");

        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.getHeaders(settings),
            body: JSON.stringify({
                model: settings.model,
                messages,
                max_tokens: settings.maxTokens
            })
        });

        const rawBody = await response.text();
        let data: unknown;

        try {
            data = JSON.parse(rawBody);
        } catch {
            data = null;
        }

        const errorData = isObject(data) && "error" in data ? data.error : null;
        const error = isObject(errorData) && "message" in errorData && typeof errorData.message === "string"
            ? errorData.message
            : null;

        if (!response.ok || error) {
            throw new Error(error ?? (rawBody || `The AI provider returned status ${response.status}.`));
        }

        const choices = isObject(data) && "choices" in data && Array.isArray(data.choices) ? data.choices : null;
        const choice = choices?.[0];
        const message = isObject(choice) && "message" in choice ? choice.message : null;
        const content = isObject(message) && "content" in message && typeof message.content === "string"
            ? message.content
            : null;

        if (!content?.trim()) throw new Error("The AI model returned an empty response.");

        return content;
    }
}
