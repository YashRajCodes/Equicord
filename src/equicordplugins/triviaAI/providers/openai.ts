/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { BaseAIProvider } from "./base";
import { ProviderSettings } from "./types";

export class OpenAIProvider extends BaseAIProvider {
    protected getEndpoint(settings: ProviderSettings): string {
        return settings.endpoint;
    }
}
