/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    apiKey: {
        type: OptionType.STRING,
        description: "OpenRouter API Key",
        default: "",
        placeholder: "Enter your OpenRouter.ai API Key here"
    },
    model: {
        type: OptionType.STRING,
        description: "AI Model to use",
        default: "inception/mercury",
        placeholder: "e.g., inception/mercury, openai/gpt-5.2-chat, etc."
    },
    systemPrompt: {
        type: OptionType.STRING,
        description: "System Prompt for the AI",
        default: "You are a helpful assistant.",
        placeholder: "Enter system prompt"
    },
    maxTokens: {
        type: OptionType.NUMBER,
        description: "Maximum number of tokens in the response",
        default: 500
    },
    autoRespond: {
        type: OptionType.BOOLEAN,
        description: "Automatically respond to messages on receiving a response",
        default: true
    }
});
