import { CacheType, ModalSubmitInteraction } from "discord.js";
import { handleBrokenLinkRequestModal } from "../../modals/submit/requests/brokenLink/brokenLinkModalSubmit";
import { handleGameRequestModal } from "../../modals/submit/requests/game/gameRequestModalSubmit";
import { handleMPGameRequestModal } from "../../modals/submit/requests/multiplayer/multiplayerRequestModalSubmit";
import { handleNonEpicSteamRequestModal } from "../../modals/submit/requests/nonEpicSteam/nonEpicSteamRequestModalSubmit";
import { handleSoftwareRequestModal } from "../../modals/submit/requests/software/softwareRequestModalSubmit";
import { handleUpdateRequestModal } from "../../modals/submit/requests/update/updateRequestModalSubmit";

type ModalSubmitInteractionHandler = Record<string, (interaction: ModalSubmitInteraction<CacheType>) => Promise<void>>;

export const gameRequestModalHandler: ModalSubmitInteractionHandler = {
  "game-request-modal": handleGameRequestModal,
};

export const brokenLinkRequestModalHandler: ModalSubmitInteractionHandler = {
  "broken-link-request-modal": handleBrokenLinkRequestModal,
};

export const multiplayerGameRequestHandler: ModalSubmitInteractionHandler = {
  "multiplayer-game-request-modal": handleMPGameRequestModal,
};

export const nonEpicSteamGameRequestHandler: ModalSubmitInteractionHandler = {
  "non-epic-steam-game-request-modal": handleNonEpicSteamRequestModal,
};

export const softwareRequestHandler: ModalSubmitInteractionHandler = {
  "software-request-modal": handleSoftwareRequestModal,
};

export const updateGameRequestHandler: ModalSubmitInteractionHandler = {
  "update-game-request-modal": handleUpdateRequestModal,
};
