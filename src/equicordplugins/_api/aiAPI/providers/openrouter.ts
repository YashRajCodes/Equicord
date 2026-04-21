/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApiMessage, SettingOption } from "../types";
import { BaseAIProvider } from "./base";

export class OpenRouterProvider extends BaseAIProvider {
    static displayName = "OpenRouter API";

    static settingOptions: SettingOption[] = [
        { key: "apiKey", label: "API Key", type: "password", placeholder: "sk-..." },
        { key: "model", label: "Model", type: "text", placeholder: "google/gemini-flash-1.5", default: "google/gemini-flash-1.5" },
        { key: "maxTokens", label: "Max Tokens", type: "number", default: 2048 }
    ];

    async createChatCompletion(params: ApiMessage[]): Promise<any> {
        const { apiKey, model, maxTokens } = this.settings;

        if (!apiKey || !model) {
            throw new Error("OpenRouterProvider: API Key and Model are required.");
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://github.com/Equicord/Equicord",
                "X-Title": "Equicord AI"
            },
            body: JSON.stringify({
                model: model,
                messages: params,
                max_tokens: maxTokens,
            })
        });

        const rawBody = await response.text();
        let data: any;
        try {
            data = JSON.parse(rawBody);
        } catch {
            data = { error: { message: rawBody } };
        }

        if (!response.ok || data.error) {
            const errorMsg = data.error?.message ?? data.error ?? `Status ${response.status}`;
            throw new Error(`OpenRouter API Error: ${errorMsg}`);
        }

        return data;
    }
}
