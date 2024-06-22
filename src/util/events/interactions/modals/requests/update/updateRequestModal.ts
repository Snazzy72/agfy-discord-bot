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

export async function handleUpdateGameRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  if (await isBlacklisted(interaction.user)) {
    await interaction.reply({
      embeds: [actionWarningEmbed(`**${interaction.user.username}**, you have been blacklisted from making requests.`)],
      ephemeral: true
    });

    return;
  }

  const updateRequestModal = new ModalBuilder()
    .setCustomId("update-game-request-modal")
    .setTitle("Update Game Request");

  const updateGameLink = new TextInputBuilder()
    .setCustomId("update-game-link")
    .setLabel("AGFY game link")
    .setPlaceholder(Constants.AGFYUrl)
    .setMinLength(23)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const updateGameSteapEpicLink = new TextInputBuilder()
    .setCustomId("update-game-steam-epic-link")
    .setLabel("Steam or Epic Games link")
    .setPlaceholder(Constants.SteamUrl)
    .setMinLength(30)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const updateGameCurrentVersion = new TextInputBuilder()
    .setCustomId("update-game-current-version")
    .setLabel("Current Game Version")
    .setPlaceholder("v1.0.0")
    .setMinLength(1)
    .setMaxLength(10)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const updateGameConfirmation = new TextInputBuilder()
    .setCustomId("update-confirmation")
    .setLabel("Have you checked if it has an update?")
    .setPlaceholder("Yes / No")
    .setMinLength(2)
    .setMaxLength(3)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const updateGameDesiredVersion = new TextInputBuilder()
    .setCustomId("update-game-desired-version")
    .setLabel("Desired Game Version")
    .setPlaceholder("v2.0.0")
    .setMinLength(1)
    .setMaxLength(10)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const updateGameLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(updateGameLink);
  const updateGameSteamEpicLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    updateGameSteapEpicLink
  );
  const updateGameCurrentVersionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    updateGameCurrentVersion
  );
  const updateGameConfirmationActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    updateGameConfirmation
  );
  const updateGameDesiredVersionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    updateGameDesiredVersion
  );
  updateRequestModal.addComponents(
    updateGameLinkActionRow,
    updateGameSteamEpicLinkActionRow,
    updateGameCurrentVersionActionRow,
    updateGameConfirmationActionRow,
    updateGameDesiredVersionActionRow
  );

  await interaction.showModal(updateRequestModal);
}
