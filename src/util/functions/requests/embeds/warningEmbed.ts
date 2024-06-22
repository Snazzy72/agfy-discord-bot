import {EmbedBuilder} from "discord.js";

export function actionWarningEmbed(text: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Warning")
    .setDescription(text)
    .setColor("#FFFF00")
}