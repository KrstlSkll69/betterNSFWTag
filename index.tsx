/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { disableStyle, enableStyle } from "@api/Styles";
import { Devs } from "@utils/constants";
import { getCurrentGuild } from "@utils/discord";
import definePlugin from "@utils/types";
// eslint-disable-next-line unused-imports/no-unused-imports
import { ChannelStore, Forms, SelectedGuildStore } from "@webpack/common";
import { Channel, Guild } from "discord-types/general";

import { Colourfulstyle, isEnabled, returnChannelBadge, settings } from "./components/settings";

let observer: MutationObserver | null = null;
let currentGuild: Guild | undefined | null = null;

function addBadgesToChannel(element: HTMLElement, channelId: string) {
    const parentContainer: HTMLElement | null = element.querySelector('[class*="linkTop"]');
    if (!parentContainer) return;

    const channel: Channel | undefined = ChannelStore.getChannel(channelId);
    if (!channel || !isEnabled(channel.type)) return;

    const { type, nsfw } = channel;
    const isNSFW = nsfw || channel.isNSFW();

    let badgeContainer: HTMLElement | null = parentContainer.querySelector(".badge-container-main");
    if (!badgeContainer) {
        badgeContainer = document.createElement("div");
        badgeContainer.classList.add("badge-container-main");
        parentContainer.appendChild(badgeContainer);
    }

    const badgeConditions = [
        { id: 6100, condition: isNSFW, title: "This channel is marked as NSFW." },
    ];

    badgeConditions.forEach(({ id, condition, title }) => {
        if (condition && isEnabled(id)) addBadge(badgeContainer!, id, title);
    });

    addBadge(badgeContainer!, type, returnChannelBadge(type).label);
}

function addBadge(container: HTMLElement, id: number, title: string) {
    const { css, label, color } = returnChannelBadge(id);
    const badge = document.createElement("div");
    badge.classList.add("channel-badge-main", `misc-channel-badge-${css}`);
    badge.textContent = label;
    badge.title = title;

    if (color && color !== "") {
        badge.style.backgroundColor = color;
    }

    container.appendChild(badge);
}

function deleteAllBadges() {
    document.querySelectorAll(".channel-badge").forEach(badge => badge.remove());
    document.querySelectorAll('[data-list-item-id^="channels___"][data-scanned]').forEach(element => {
        element.removeAttribute("data-scanned");
    });
}

export function reloadBadges() {
    deleteAllBadges();
    document.querySelectorAll('[data-list-item-id^="channels___"]').forEach(element => {
        const channelId = element.getAttribute("data-list-item-id")?.split("___")[1];
        if (channelId && /^\d+$/.test(channelId)) {
            addBadgesToChannel(element as HTMLElement, channelId);
            element.setAttribute("data-scanned", "true");
        }
    });
}

function observeDomChanges() {
    if (observer) observer.disconnect();

    const handleMutations = (mutations: MutationRecord[]) => {
        const addedElements = new Set<Element>();
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    element.querySelectorAll('[data-list-item-id^="channels___"]:not([data-scanned])').forEach(child => {
                        addedElements.add(child);
                    });
                }
            });
        });

        addedElements.forEach(element => {
            const channelId = element.getAttribute("data-list-item-id")?.split("___")[1];
            if (channelId && /^\d+$/.test(channelId)) {
                addBadgesToChannel(element as HTMLElement, channelId);
                element.setAttribute("data-scanned", "true");
            }
        });
    };

    observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
}

function onGuildChange() {
    const newGuild: Guild | undefined | null = getCurrentGuild();
    if (newGuild !== currentGuild) {
        currentGuild = newGuild;
    }
}

export default definePlugin({
    name: "BetterNSFWTag",
    description: "Adds NSFW badge next to those type of channels.",
    authors: [
        Devs.Nuckyz,
        Devs.sadan,
        // Import from EquicordDev for Equicord
        { name: "creations", id: 209830981060788225n },
        { name: "krystalskullofficial", id: 929208515883569182n },
    ],
    tags: ["Nsfw", "NSFW", "NSFWTag", "Accessibility"],
    settingsAboutComponent: () => <>

    </>,

    settings,

    async start() {
        currentGuild = getCurrentGuild();
        observeDomChanges();
        reloadBadges();
        SelectedGuildStore.addChangeListener(onGuildChange);
        if (settings.store.colourfulChannelIcons) enableStyle(Colourfulstyle);
    },

    stop() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        deleteAllBadges();
        SelectedGuildStore.removeChangeListener(onGuildChange);
        if (settings.store.colourfulChannelIcons) disableStyle(Colourfulstyle);
    },

});
