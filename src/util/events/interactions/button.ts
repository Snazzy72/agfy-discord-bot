import { ButtonInteraction, CacheType } from "discord.js";
import {
  gameRequestHandler,
  multiplayerGameRequestHandler,
  brokenLinkRequestHandler,
  updateGameRequestHandler,
  softwareRequestHandler,
  nonEpicSteamGameRequestHandler,
  acceptRequestHandler,
  denyRequestHandler,
  resetRequestHandler,
} from "./handlers/requests/requestHandler";

export async function handleButtonInteraction(interaction: ButtonInteraction<CacheType>) {
  let handlers: Record<string, (interaction: ButtonInteraction<CacheType>) => Promise<void>> | undefined;

  const prefixMappings: [string, Record<string, (interaction: ButtonInteraction<CacheType>) => Promise<void>>][] = [
    ["game", gameRequestHandler],
    ["multiplayer", multiplayerGameRequestHandler],
    ["broken-link", brokenLinkRequestHandler],
    ["update", updateGameRequestHandler],
    ["software", softwareRequestHandler],
    ["non-epic-steam", nonEpicSteamGameRequestHandler],
    ["accept", acceptRequestHandler],
    ["deny", denyRequestHandler],
    ["reset", resetRequestHandler],
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
