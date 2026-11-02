/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { GoogleAIStudioProvider } from "./google";
import { OpenAIProvider } from "./openai";
import { OpenRouterProvider } from "./openrouter";
import { AIProvider } from "./types";

const providers = {
    [AIProvider.OpenAICompatible]: new OpenAIProvider(),
    [AIProvider.OpenRouter]: new OpenRouterProvider(),
    [AIProvider.GoogleAIStudio]: new GoogleAIStudioProvider()
} satisfies Record<AIProvider, OpenAIProvider | OpenRouterProvider | GoogleAIStudioProvider>;

export function getProvider(name: AIProvider) {
    return providers[name];
}

export * from "./types";
