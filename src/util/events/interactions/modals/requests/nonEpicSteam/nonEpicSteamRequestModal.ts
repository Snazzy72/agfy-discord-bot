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
import {actionWarningEmbed} from "../../../../../functions/requests/embeds/warningEmbed";

export async function handleNonEpicSteamGameRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  if (await isBlacklisted(interaction.user)) {
    await interaction.reply({
      embeds: [actionWarningEmbed(`**${interaction.user.username}**, you have been blacklisted from making requests.`)],
      ephemeral: true,
    });

    return;
  }

  const nonEpicSteamRequestModal = new ModalBuilder()
    .setCustomId("non-epic-steam-game-request-modal")
    .setTitle("Non Epic/Steam Request");

  const nonEpicSteamName = new TextInputBuilder()
    .setCustomId("non-epic-steam-name")
    .setLabel("Game Name")
    .setPlaceholder("Escape From Tarkov")
    .setMinLength(5)
    .setMaxLength(30)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const nonEpicSteamLink = new TextInputBuilder()
    .setCustomId("non-epic-steam-link")
    .setLabel("Game Link")
    .setPlaceholder("https://")
    .setMinLength(8)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const nonEpicSteamVersion = new TextInputBuilder()
    .setCustomId("non-epic-steam-version")
    .setLabel("Desired Game Version")
    .setPlaceholder("v1.0.0")
    .setMinLength(1)
    .setMaxLength(10)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const nonEpicSteamComment = new TextInputBuilder()
    .setCustomId("non-epic-steam-comment")
    .setLabel("Comments")
    .setPlaceholder("Please add x and y")
    .setMinLength(1)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const nonEpicSteamNameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    nonEpicSteamName
  );
  const nonEpicSteamLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    nonEpicSteamLink
  );
  const nonEpicSteamVersionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    nonEpicSteamVersion
  );
  const nonEpicSteamCommentRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    nonEpicSteamComment
  );

  nonEpicSteamRequestModal.addComponents(
    nonEpicSteamNameActionRow,
    nonEpicSteamLinkActionRow,
    nonEpicSteamVersionActionRow,
    nonEpicSteamCommentRow
  );

  await interaction.showModal(nonEpicSteamRequestModal);
}
