import {EmbedBuilder} from "discord.js";

export function actionErrorEmbed(text: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Error")
    .setDescription(text)
    .setColor("#ff0000")
}
