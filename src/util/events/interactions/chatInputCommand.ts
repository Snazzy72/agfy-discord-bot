import { CacheType, ChatInputCommandInteraction } from "discord.js";

export function handleChatInputCommand(interaction: ChatInputCommandInteraction<CacheType>) {
  const command = interaction.client.slashCommands.get(interaction.commandName);
  if (!command) return;

  const cooldownKey = `${interaction.commandName}-${interaction.user.username}`;
  const cooldown = interaction.client.cooldowns.get(cooldownKey);

  if (command.cooldown && cooldown && Date.now() < cooldown) {
    const remainingTime = Math.floor(Math.abs(Date.now() - cooldown) / 1000);
    interaction
      .reply(`You have to wait ${remainingTime} second(s) to use this command again.`)
      .then(() => setTimeout(() => interaction.deleteReply(), 5000));
    return;
  }

  if (command.cooldown) {
    interaction.client.cooldowns.set(cooldownKey, Date.now() + command.cooldown * 1000);
    setTimeout(() => interaction.client.cooldowns.delete(cooldownKey), command.cooldown * 1000);
  }

  command.execute(interaction);
}
