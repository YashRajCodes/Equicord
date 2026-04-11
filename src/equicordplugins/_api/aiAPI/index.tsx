/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import SettingsPlugin from "@plugins/_core/settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { IconComponent } from "@utils/types";
import { findExportedComponentLazy } from "@webpack";

import ConfigTab from "./ui/config";

const RobotIconLazy = findExportedComponentLazy("RobotIcon");
const RobotIcon: IconComponent = props => (
    <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RobotIconLazy {...props} style={{ width: "100%", height: "100%" }} />
    </div>
);

export default definePlugin({
    name: "aiAPI",
    description: "API for plugins to interact with AI services",
    authors: [EquicordDevs.yash],
    start() {
        SettingsPlugin.customEntries.push({
            key: "ai_configuration",
            title: "AI Configuration",
            Component: ConfigTab,
            Icon: RobotIcon
        });
    }
});
