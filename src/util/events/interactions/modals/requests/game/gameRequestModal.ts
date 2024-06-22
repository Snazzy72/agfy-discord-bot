import {
  ActionRowBuilder,
  ButtonInteraction,
  CacheType,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {isBlacklisted} from "../../../../../../slashCommands/blacklist";
import {Constants} from "../../../../../constants";
import {actionWarningEmbed} from "../../../../../functions/requests/embeds/warningEmbed";

export async function handleGameRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  if (await isBlacklisted(interaction.user)) {
    await interaction.reply({
      embeds: [actionWarningEmbed(`**${interaction.user.username}**, you have been blacklisted from making requests.`)],
      ephemeral: true,
    });

    return;
  }

  const gameRequestModal = new ModalBuilder().setCustomId("game-request-modal").setTitle("Game Request");

  const gameLink = new TextInputBuilder()
    .setCustomId("game-link")
    .setLabel("Steam or Epic Games link")
    .setPlaceholder(Constants.SteamUrl)
    .setMinLength(30)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const gameVersion = new TextInputBuilder()
    .setCustomId("game-version")
    .setLabel("Desired Game Version")
    .setPlaceholder("v1.0.0")
    .setMinLength(1)
    .setMaxLength(10)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const gameOnSiteConfirmation = new TextInputBuilder()
    .setCustomId("game-on-site-confirmation")
    .setLabel("Is the game currently on AGFY?")
    .setPlaceholder("Yes / No")
    .setMinLength(2)
    .setMaxLength(3)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const gameLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(gameLink);
  const gameVersionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(gameVersion);
  const gameOnSiteConfirmationRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    gameOnSiteConfirmation
  );

  gameRequestModal.addComponents(gameLinkActionRow, gameVersionActionRow, gameOnSiteConfirmationRow);

  await interaction.showModal(gameRequestModal);
}
