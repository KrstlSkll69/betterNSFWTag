/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { ErrorBoundary, Flex, Link } from "@components/index";
import { defineDefault, OptionType } from "@utils/types";
import { Checkbox, Forms, Text } from "@webpack/common";

import { reloadBadges } from "../index";
import Colourfulstyle from "./import/colorfulIcons.css?managed";

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
            <Forms.FormTitle tag="h3">Toggle badge locations</Forms.FormTitle>
            <Forms.FormText className="vc-locationsDescription">Toggle locations badge shows up.</Forms.FormText>
            <Forms.FormText className="vc-unknownMoreInfo">Unknown includes such channels as
                <Link className="vc-mediaChannel" href="https://creator-support.discord.com/hc/en-us/articles/14346342766743-Media-Channels-for-Server-Subscriptions-BETA"> Media</Link>,
                <Link className="vc-mediaChannel" href="https://discord.com/community/creating-value-with-conversation"> Forum</Link>,
                Rules or Guidelines,
                <Link className="vc-mediaChannel" href="https://support.discord.com/hc/en-us/articles/360032008192-Announcement-Channel-FAQ"> Announcement</Link>,
                <Link className="vc-mediaChannel" href="https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ"> Threads</Link>.
                </Forms.FormText>
            <Flex flexDirection="row">
                {Object.keys(settings.store.allowLevel).map(key => (
                    <AllowLevelSetting key={key} settingKey={key as keyof AllowLevels} />
                ))}
            </Flex>
        </Forms.FormSection>
    );
});

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
        type: OptionType.STRING,
        description: "NSFW badge colour. Supports almost any colour format. Default is Red.",
        placeholder: "#ff0000",
        onChange: reloadBadges,
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
