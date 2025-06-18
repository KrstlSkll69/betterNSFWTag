/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { defineDefault, OptionType } from "@utils/types";

import { reloadBadges } from "../index";
import { AllowLevels, AllowLevelSettings, nsfwBadgeColor } from "./allowlevel";
import Colourfulstyle from "./import/colorfulIcons.css?managed";



const settings = definePluginSettings({
    allowLevel: {
        type: OptionType.COMPONENT,
        component: AllowLevelSettings,
        default: defineDefault<AllowLevels>({
            showTextBadge: true,
            showVoiceBadge: true,
            showStageBadge: true,
            showUnknownBadge: true,
        }),
        onChange: reloadBadges,
    },

    colourfulChannelIcons: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Makes channel icons with symbols more colourful.",
        restartNeeded: true
    },

    showNsfwBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show NSFW badge.",
        onChange: reloadBadges,
    },
    nsfwBadgeLabel: {
        type: OptionType.STRING,
        default: "NSFW",
        placeholder: "NSFW",
        description: "NSFW badge label.",
        onChange: reloadBadges,
    },

    nsfwBadgeColour: {
        type: OptionType.COMPONENT,
        component: nsfwBadgeColor,
    },


    // These exists because plugin wouldn't work with out them
    oneBadgePerChannel: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    unknownBadgeColor: {
        type: OptionType.STRING,
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    unknownBadgeLabel: {
        type: OptionType.STRING,
        default: "",
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
});

const defaultValues = {
    showTextBadge: true,
    showVoiceBadge: true,
    showStageBadge: true,
    showNSFWBadge: true,
    showUnknownBadge: true,

    channelBadges: {
        text: "Text",
        voice: "Voice",
        stage: "Stage",
        nsfw: "NSFW",
        unknown: "Unknown"
    },
    nsfwBadgeTooltip: "This channel is marked as NSFW.",
};

function isEnabled(type: number) {
    const fromValues = settings.store;

    switch (type) {
        case 0:
            return fromValues.allowLevel.showTextBadge;
        case 2:
            return fromValues.allowLevel.showVoiceBadge;
        case 13:
            return fromValues.allowLevel.showStageBadge;
        case 14:
        case 6100:
            return fromValues.showNsfwBadge;
        default:
            return fromValues.allowLevel.showUnknownBadge;
    }
}

function returnChannelBadge(type: number) {
    switch (type) {
        case 0:
            return { css: "text", label: settings.store.unknownBadgeLabel, color: settings.store.unknownBadgeColor };
        case 2:
            return { css: "voice", label: settings.store.unknownBadgeLabel, color: settings.store.unknownBadgeColor };
        case 4:
        case 13:
            return { css: "stage", label: settings.store.unknownBadgeLabel, color: settings.store.unknownBadgeColor };
        case 6100:
            return { css: "nsfw", label: settings.store.nsfwBadgeLabel, color: settings.store.nsfwBadgeColour };
        default:
            return { css: "unknown", label: settings.store.unknownBadgeLabel, color: settings.store.unknownBadgeColor };
    }
}

export { Colourfulstyle, defaultValues, isEnabled, returnChannelBadge, settings };
