import {EmbedBuilder} from "discord.js";

export function actionSuccessEmbed(text: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Success")
    .setDescription(text)
    .setColor("#00ff00")
}