import { ButtonInteraction, CacheType } from "discord.js";
import { handleAcceptRequest } from "../../../../functions/requests/acceptRequest";
import { handleBrokenLinkRequest } from "../../modals/requests/brokenLink/brokenLinkRequestModal";
import { handleDenyRequest } from "../../../../functions/requests/denyRequest";
import { handleGameRequest } from "../../modals/requests/game/gameRequestModal";
import { handleMultiplayerGameRequest } from "../../modals/requests/multiplayer/multiplayerGameRequestModal";
import { handleNonEpicSteamGameRequest } from "../../modals/requests/nonEpicSteam/nonEpicSteamRequestModal";
import { handleResetRequest } from "../../../../functions/requests/resetRequest";
import { handleSoftwareRequest } from "../../modals/requests/software/softwareRequestModal";
import { handleUpdateGameRequest } from "../../modals/requests/update/updateRequestModal";

type ButtonInteractionHandler = Record<string, (interaction: ButtonInteraction<CacheType>) => Promise<void>>;

export const gameRequestHandler: ButtonInteractionHandler = {
  "game-request": handleGameRequest,
};

export const brokenLinkRequestHandler: ButtonInteractionHandler = {
  "broken-link-request": handleBrokenLinkRequest,
};

export const multiplayerGameRequestHandler: ButtonInteractionHandler = {
  "multiplayer-game-request": handleMultiplayerGameRequest,
};

export const nonEpicSteamGameRequestHandler: ButtonInteractionHandler = {
  "non-epic-steam-game-request": handleNonEpicSteamGameRequest,
};

export const softwareRequestHandler: ButtonInteractionHandler = {
  "software-request": handleSoftwareRequest,
};

export const updateGameRequestHandler: ButtonInteractionHandler = {
  "update-game-request": handleUpdateGameRequest,
};

export const acceptRequestHandler: ButtonInteractionHandler = {
  "accept-request": handleAcceptRequest,
};

export const denyRequestHandler: ButtonInteractionHandler = {
  "deny-request": handleDenyRequest,
};

export const resetRequestHandler: ButtonInteractionHandler = {
  "reset-request": handleResetRequest,
};
