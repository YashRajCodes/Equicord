/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { SettingsTab, wrapTab } from "@components/settings";

function ConfigTab() {
    return (<SettingsTab>
        Hello World!
    </SettingsTab>);
}

export default wrapTab(ConfigTab, "AI Configuration");
