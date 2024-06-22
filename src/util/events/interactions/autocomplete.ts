import { AutocompleteInteraction, CacheType } from "discord.js";

export function handleAutoComplete(interaction: AutocompleteInteraction<CacheType>) {
  const command = interaction.client.slashCommands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    if (command.autocomplete) command.autocomplete(interaction);
  } catch (error) {
    console.error(error);
  }
}
