import {Colors, EmbedBuilder} from "discord.js";

export function noPermissionEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Error')
    .setDescription('You do not have permission for this')
    .setColor("#ff0000")
}
