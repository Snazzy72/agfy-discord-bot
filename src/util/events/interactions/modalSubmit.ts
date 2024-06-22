import { CacheType, ModalSubmitInteraction } from "discord.js";
import {
  brokenLinkRequestModalHandler,
  gameRequestModalHandler,
  multiplayerGameRequestHandler,
  nonEpicSteamGameRequestHandler,
  softwareRequestHandler,
  updateGameRequestHandler,
} from "./handlers/requests/modalSubmitHandler";

export async function handleModalSubmit(interaction: ModalSubmitInteraction<CacheType>) {
  let handlers: Record<string, (interaction: ModalSubmitInteraction<CacheType>) => Promise<void>> | undefined;

  const prefixMappings: [string, Record<string, (interaction: ModalSubmitInteraction<CacheType>) => Promise<void>>][] =
    [
      ["game", gameRequestModalHandler],
      ["multiplayer", multiplayerGameRequestHandler],
      ["broken-link", brokenLinkRequestModalHandler],
      ["update", updateGameRequestHandler],
      ["software", softwareRequestHandler],
      ["non-epic-steam", nonEpicSteamGameRequestHandler],
    ];

  for (const [prefix, group] of prefixMappings) {
    if (interaction.customId.startsWith(prefix)) {
      handlers = group;
      break;
    }
  }

  if (!handlers) {
    handlers = {};
  }

  const handler = handlers[interaction.customId];

  if (handler) {
    await handler(interaction);
  }
}
