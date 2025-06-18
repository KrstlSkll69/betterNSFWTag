/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { ErrorBoundary } from "@components/index";
import { Forms, TextInput } from "@webpack/common";

import { reloadBadges } from "../index";
import { settings } from "./settings";



const nsfwBadgeColor = ErrorBoundary.wrap(() => {
    return (
        <Forms.FormSection>
            <Forms.FormTitle tag="h3">Nsfw Badge Color</Forms.FormTitle>
            <Forms.FormText className="vc-locationsDescription">
                NSFW badge colour. Supports almost any colour format. Default is Red.
            </Forms.FormText>
            <Forms.FormText className="vc-unknownMoreInfo">
                Be sure to include the pound/ hashtag (#) symbol when using Hex code format.
            </Forms.FormText>
            <TextInput
                onChange={v => {
                    settings.store.nsfwBadgeColour = v;
                    reloadBadges;
                }}
                placeholder="#ff0000"
                value={settings.store.nsfwBadgeColour}
            >
            </TextInput>
        </Forms.FormSection>
    );
});

export { nsfwBadgeColor };
