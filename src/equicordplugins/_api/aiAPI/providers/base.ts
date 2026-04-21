/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApiMessage, SettingOption } from "../types";

export abstract class BaseAIProvider {
    static displayName: string;
    static settingOptions: SettingOption[];

    constructor(private fetchSettings: () => Record<string, any>) { }

    protected get settings(): Record<string, any> {
        const liveSettings = this.fetchSettings() || {};
        const mergedSettings = { ...liveSettings };

        const options = (this.constructor as typeof BaseAIProvider).settingOptions;

        options?.forEach(opt => {
            if (mergedSettings[opt.key] === undefined && opt.default !== undefined) {
                mergedSettings[opt.key] = opt.default;
            }
        });

        return mergedSettings;
    }

    abstract createChatCompletion(params: ApiMessage[]): Promise<any>;
}
