import {ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../types.js";
import {initEmbed} from "../util/functions/requests/embeds/init.js";

const init: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("init")
    .setDescription("Initializes the request message in the current channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.channel?.send({
      embeds: [initEmbed()],
      components: [
        actionRow(
          requestButton("game-request", "Game Request", ButtonStyle.Primary),
          requestButton("multiplayer-game-request", "Multiplayer Game Request", ButtonStyle.Primary),
          requestButton("broken-link-request", "Broken Link Request", ButtonStyle.Primary)
        ),
        actionRow(
          requestButton("update-game-request", "Update Game Request", ButtonStyle.Primary),
          requestButton("software-request", "Software Request", ButtonStyle.Primary),
          requestButton("non-epic-steam-game-request", "Non Epic/Steam Game Request", ButtonStyle.Primary)
        ),
      ],
    });
    await interaction.reply({
      content: "Request message has been initialized.",
      ephemeral: true,
    });
  },
  cooldown: 60,
};

export function actionRow(...buttons: Array<ButtonBuilder>): ActionRowBuilder<ButtonBuilder> {
  const actionRowBuilder = new ActionRowBuilder<ButtonBuilder>();
  buttons.forEach((button) => {
    actionRowBuilder.addComponents(button);
  });
  return actionRowBuilder;
}

export function requestButton(id: string, label: string, style: ButtonStyle, disabled?: boolean): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(id)
    .setLabel(label)
    .setStyle(style)
    .setDisabled(!!disabled);
}

export default init;
