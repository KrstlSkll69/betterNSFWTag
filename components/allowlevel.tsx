/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { ErrorBoundary, Flex, Link } from "@components/index";
import { Checkbox, Forms, Text } from "@webpack/common";

import { settings } from "./settings";

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
            <Forms.FormTitle tag="h3">Toggle NSFW tag locations</Forms.FormTitle>
            <Forms.FormText className="vc-locationsDescription">Toggle locations the NSFW tag shows up.</Forms.FormText>
            <Forms.FormText className="vc-unknownMoreInfo">Unknown includes such channels as
                <Link className="vc-moreInfo-href" href="https://creator-support.discord.com/hc/en-us/articles/14346342766743-Media-Channels-for-Server-Subscriptions-BETA"> Media</Link>,
                <Link className="vc-moreInfo-href" href="https://discord.com/community/creating-value-with-conversation"> Forum</Link>,
                <Link className="vc-moreInfo-href" href="https://support.discord.com/hc/en-us/articles/360032008192-Announcement-Channel-FAQ"> Announcement</Link>,
                <Link className="vc-moreInfo-href" href="https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ"> Threads</Link>.
            </Forms.FormText>
            <Flex flexDirection="row">
                {Object.keys(settings.store.allowLevel).map(key => (
                    <AllowLevelSetting key={key} settingKey={key as keyof AllowLevels} />
                ))}
            </Flex>
        </Forms.FormSection>
    );
});

export { AllowLevels, AllowLevelSettings };
