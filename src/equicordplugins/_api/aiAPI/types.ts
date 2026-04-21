/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

type TextPart = {
    type: "text";
    text: string;
};

type ImagePart = {
    type: "image_url";
    image_url: {
        url: string;
        detail?: "auto" | "high" | "low";
    };
};

export type ContentPayload = string | (TextPart | ImagePart)[];

export type ApiMessage = {
    role: "user" | "assistant" | "system" | "developer" | "tool";
    content: ContentPayload;
};

export interface SettingOption {
    key: string;
    label: string;
    type: "text" | "password" | "number";
    placeholder?: string;
    default?: any;
}
