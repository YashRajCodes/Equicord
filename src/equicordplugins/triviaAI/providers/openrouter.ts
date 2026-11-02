/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { BaseAIProvider } from "./base";
import { ProviderSettings } from "./types";

export class OpenRouterProvider extends BaseAIProvider {
    protected getEndpoint(): string {
        return "https://openrouter.ai/api/v1/chat/completions";
    }

    protected getHeaders(settings: ProviderSettings): Record<string, string> {
        return {
            ...super.getHeaders(settings),
            "HTTP-Referer": "https://github.com/Equicord/Equicord",
            "X-Title": "Equicord TriviaAI"
        };
    }
}
