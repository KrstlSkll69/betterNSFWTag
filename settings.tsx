/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { reloadBadges } from "./index";
import style from "./triangleRecolor.css?managed";

const settings = definePluginSettings({
    oneBadgePerChannel: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    showTextBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show Text badge",
        hidden: true,
        onChange: reloadBadges,
    },
    showVoiceBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
        description: "Show Voice badge",
        onChange: reloadBadges,
    },
    showStageBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show Stage badge",
        hidden: true,
        onChange: reloadBadges,
    },

    recolorNSFWTriangle:{
        type: OptionType.BOOLEAN,
        default: false,
        description: "Recolor the triangle in the icon for NSFW channels",
        restartNeeded: true
    },

    showNSFWBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show NSFW badge",
        onChange: reloadBadges,
    },
    showUnknownBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show Unknown badge",
        hidden: true,
        onChange: reloadBadges,
    },

    textBadgeLabel: {
        type: OptionType.STRING,
        default: "",
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    voiceBadgeLabel: {
        type: OptionType.STRING,
        default: "",
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    stageBadgeLabel: {
        type: OptionType.STRING,
        default: "",
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    nsfwBadgeLabel: {
        type: OptionType.STRING,
        default: "NSFW",
        description: "NSFW badge label",
        onChange: reloadBadges,
    },
    unknownBadgeLabel: {
        type: OptionType.STRING,
        default: "",
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },


    textBadgeColor: {
        type: OptionType.STRING,
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    voiceBadgeColor: {
        type: OptionType.STRING,
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    stageBadgeColor: {
        type: OptionType.STRING,
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
    nsfwBadgeColor: {
        type: OptionType.STRING,
        description: "NSFW badge color",
        onChange: reloadBadges,
    },
    unknownBadgeColor: {
        type: OptionType.STRING,
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
            return fromValues.showTextBadge;
        case 2:
            return fromValues.showVoiceBadge;
        case 13:
            return fromValues.showStageBadge;
        case 14:
        case 6100:
            return fromValues.showNSFWBadge;
        default:
            return fromValues.showUnknownBadge;
    }
}

function returnChannelBadge(type: number) {
    switch (type) {
        case 0:
            return { css: "text", label: settings.store.textBadgeLabel, color: settings.store.textBadgeColor };
        case 2:
            return { css: "voice", label: settings.store.voiceBadgeLabel, color: settings.store.voiceBadgeColor };
        case 4:
        case 13:
            return { css: "stage", label: settings.store.stageBadgeLabel, color: settings.store.stageBadgeColor };
        case 6100:
            return { css: "nsfw", label: settings.store.nsfwBadgeLabel, color: settings.store.nsfwBadgeColor };
        default:
            return { css: "unknown", label: settings.store.unknownBadgeLabel, color: settings.store.unknownBadgeColor };
    }
}

export { defaultValues, isEnabled, returnChannelBadge, settings, style };
