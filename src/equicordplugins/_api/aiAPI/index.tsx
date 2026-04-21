/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import SettingsPlugin from "@plugins/_core/settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { IconComponent, OptionType } from "@utils/types";
import { findExportedComponentLazy } from "@webpack";

import { ProviderName, providerOptions, providers } from "./providers";
import ConfigTab from "./ui/config";

const RobotIconLazy = findExportedComponentLazy("RobotIcon");
const RobotIcon: IconComponent = props => (
    <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RobotIconLazy {...props} style={{ width: "100%", height: "100%" }} />
    </div>
);

const settings = definePluginSettings({
    currentProvider: {
        type: OptionType.SELECT,
        description: "current ai provider being used.",
        options: providerOptions
    },
    providerSettings: {
        type: OptionType.CUSTOM,
        description: "a dict with settings for each provider.",
        hidden: true,
        default: {}
    }
});

const getProvider = (name?: string) => {
    const target = (name ?? settings.store.currentProvider) as ProviderName;
    const ProviderClass = providers[target] ?? providers.openrouter;

    return new ProviderClass(() => settings.store.providerSettings?.[target] ?? {});
};

export default definePlugin({
    name: "aiAPI",
    description: "API for plugins to interact with AI services",
    authors: [EquicordDevs.yash],
    settings,
    getProvider,
    start() {
        SettingsPlugin.customEntries.push({
            key: "ai_configuration",
            title: "AI Configuration",
            Component: ConfigTab,
            Icon: RobotIcon
        });
    },
});
