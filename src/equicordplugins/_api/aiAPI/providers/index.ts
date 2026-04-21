/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { OpenRouterProvider } from "./openrouter";

export const providers = {
    openrouter: OpenRouterProvider
} as const;

export type ProviderName = keyof typeof providers;

export const providerOptions = Object.entries(providers).map(([key, provider]) => ({
    label: provider.displayName,
    value: key
}));
