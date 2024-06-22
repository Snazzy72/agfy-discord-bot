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

export async function handleMultiplayerGameRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  if (await isBlacklisted(interaction.user)) {
    await interaction.reply({
      embeds: [actionWarningEmbed(`**${interaction.user.username}**, you have been blacklisted from making requests.`)],
      ephemeral: true,
    });

    return;
  }

  const mpGameRequestModal = new ModalBuilder()
    .setCustomId("multiplayer-game-request-modal")
    .setTitle("Multiplayer Game Request");

  const mpGameLink = new TextInputBuilder()
    .setCustomId("multiplayer-game-link")
    .setLabel("AGFY game link")
    .setPlaceholder(Constants.AGFYUrl)
    .setMinLength(23)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const mpGameSteamEpicLink = new TextInputBuilder()
    .setCustomId("multiplayer-game-steam-epic-link")
    .setLabel("Steam or Epic Games link")
    .setPlaceholder(Constants.SteamUrl)
    .setMinLength(30)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const mpGameVersion = new TextInputBuilder()
    .setCustomId("multiplayer-game-version")
    .setLabel("Desired Game Version")
    .setPlaceholder("v1.0.0")
    .setMinLength(1)
    .setMaxLength(10)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const mpGameConfirmation = new TextInputBuilder()
    .setCustomId("multiplayer-confirmation")
    .setLabel("Have you checked if it supports multiplayer?")
    .setPlaceholder("Yes / No")
    .setMinLength(2)
    .setMaxLength(3)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const mpGameHasMpConfirmation = new TextInputBuilder()
    .setCustomId("multiplayer-has-mp-confirmation")
    .setLabel("Does the one on site have multiplayer?")
    .setPlaceholder("Yes / No")
    .setMinLength(2)
    .setMaxLength(3)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const mpGameLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(mpGameLink);
  const mpGameSteamEpicLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    mpGameSteamEpicLink
  );
  const mpGameVersionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(mpGameVersion);
  const mpGameConfirmationRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    mpGameConfirmation
  );
  const mpGameHasMpConfirmationRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    mpGameHasMpConfirmation
  );

  mpGameRequestModal.addComponents(
    mpGameLinkActionRow,
    mpGameSteamEpicLinkActionRow,
    mpGameVersionActionRow,
    mpGameConfirmationRow,
    mpGameHasMpConfirmationRow
  );

  await interaction.showModal(mpGameRequestModal);
}
