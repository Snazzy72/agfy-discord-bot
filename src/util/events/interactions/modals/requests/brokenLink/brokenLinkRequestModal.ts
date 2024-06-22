import {
  ActionRowBuilder,
  ButtonInteraction,
  CacheType,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {Constants} from "../../../../../constants";
import {isBlacklisted} from "../../../../../../slashCommands/blacklist";
import {actionWarningEmbed} from "../../../../../functions/requests/embeds/warningEmbed";

export async function handleBrokenLinkRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  if (await isBlacklisted(interaction.user)) {
    await interaction.reply({
      embeds: [actionWarningEmbed(`**${interaction.user.username}**, you have been blacklisted from making requests.`)],
      ephemeral: true
    });

    return;
  }

  const brokenLinkRequestModal = new ModalBuilder()
    .setCustomId("broken-link-request-modal")
    .setTitle("Broken Link Request");

  const brokenLink = new TextInputBuilder()
    .setCustomId("broken-link")
    .setLabel("AGFY game link")
    .setPlaceholder(Constants.AGFYUrl)
    .setMinLength(23)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const brokenSteamLink = new TextInputBuilder()
    .setCustomId("broken-steam-epic-link")
    .setLabel("Steam or Epic Games link")
    .setPlaceholder(Constants.SteamUrl)
    .setMinLength(30)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const brokenLinkConfirmation = new TextInputBuilder()
    .setCustomId("broken-link-confirmation")
    .setLabel("Are you able to download this game?")
    .setPlaceholder("Yes / No")
    .setMinLength(2)
    .setMaxLength(3)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const brokenLinkComment = new TextInputBuilder()
    .setCustomId("broken-link-comment")
    .setLabel("Comments")
    .setPlaceholder("Can you fix the torrent download.")
    .setMinLength(1)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const brokenLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(brokenLink);
  const brokenSteamLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    brokenSteamLink
  );
  const brokenLinkConfirmationActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    brokenLinkConfirmation
  );
  const brokenLinkCommentActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    brokenLinkComment
  );

  brokenLinkRequestModal.addComponents(
    brokenLinkActionRow,
    brokenSteamLinkActionRow,
    brokenLinkConfirmationActionRow,
    brokenLinkCommentActionRow
  );

  await interaction.showModal(brokenLinkRequestModal);
}
