/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./customSize.css";

import { definePluginSettings } from "@api/Settings";
import { ErrorBoundary, Flex } from "@components/index";
import { Margins } from "@utils/index";
import { defineDefault, OptionType } from "@utils/types";
import { Checkbox, Forms, Text } from "@webpack/common";

import { reloadBadges } from "../index";
import Colorfulstyle from "./import/colorfulIcons.css?managed";

interface AllowLevels {
    showTextBadge: boolean;
    showVoiceBadge: boolean;
    showStageBadge: boolean;
    showUnknownBadge: boolean;
}

interface AllowLevelSettingProps {
    settingKey: keyof AllowLevels;
}

function AllowLevelSetting({ settingKey }: AllowLevelSettingProps) {
    const { allowLevel } = settings.use(["allowLevel"]);
    const value = allowLevel[settingKey];

    return (
        <Checkbox
            value={value}
            onChange={(_, newValue) => settings.store.allowLevel[settingKey] = newValue}
            size={20}
        >

            <Text className="vc-badgeLocation-txt">{settingKey[0].toUpperCase() + settingKey.slice(1)}</Text>
        </Checkbox>
    );
}

const AllowLevelSettings = ErrorBoundary.wrap(() => {
    return (
        <Forms.FormSection>
            <Forms.FormTitle tag="h3">Toggle label locations</Forms.FormTitle>
            <Forms.FormText className={Margins.bottom8} type={Forms.FormText.Types.DESCRIPTION}>Toggle locations labels show up.</Forms.FormText>
            <Flex flexDirection="row">
                {Object.keys(settings.store.allowLevel).map(key => (
                    <AllowLevelSetting key={key} settingKey={key as keyof AllowLevels} />
                ))}
            </Flex>
        </Forms.FormSection>
    );
});

const settings = definePluginSettings({
    oneBadgePerChannel: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "",
        hidden: true,
        onChange: reloadBadges,
    },
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

    colorfulChannelIcons: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Makes channel icons with symbols more colorful.",
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

    nsfwBadgeColor: {
        type: OptionType.STRING,
        description: "NSFW badge color. Supports almost any color format.",
        placeholder: "#ff0000",
        onChange: reloadBadges,
    },


    // These exists because plugin wouldn't work with out them
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
            return { css: "nsfw", label: settings.store.nsfwBadgeLabel, color: settings.store.nsfwBadgeColor };
        default:
            return { css: "unknown", label: settings.store.unknownBadgeLabel, color: settings.store.unknownBadgeColor };
    }
}

export { Colorfulstyle, defaultValues, isEnabled, returnChannelBadge, settings };
