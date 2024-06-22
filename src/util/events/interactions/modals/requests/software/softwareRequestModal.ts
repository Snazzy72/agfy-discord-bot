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

export async function handleSoftwareRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  if (await isBlacklisted(interaction.user)) {
    await interaction.reply({
      embeds: [actionWarningEmbed(`**${interaction.user.username}**, you have been blacklisted from making requests.`)],
      ephemeral: true,
    });

    return;
  }

  const softwareRequestModal = new ModalBuilder().setCustomId("software-request-modal").setTitle("Software Request");

  const softwareName = new TextInputBuilder()
    .setCustomId("software-name")
    .setLabel("Software Name")
    .setPlaceholder("Adobe Photoshop")
    .setMinLength(5)
    .setMaxLength(30)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const softwareLink = new TextInputBuilder()
    .setCustomId("software-link")
    .setLabel("Software Link")
    .setPlaceholder("https://")
    .setMinLength(8)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const softwareVersion = new TextInputBuilder()
    .setCustomId("software-version")
    .setLabel("Desired Software Version")
    .setPlaceholder("2024")
    .setMinLength(1)
    .setMaxLength(10)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const softwarePlatform = new TextInputBuilder()
    .setCustomId("software-platform")
    .setLabel("Platform")
    .setPlaceholder("Windows/Mac")
    .setMinLength(3)
    .setMaxLength(7)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const softwareComment = new TextInputBuilder()
    .setCustomId("software-comment")
    .setLabel("Comments")
    .setPlaceholder("Please add x and y")
    .setMinLength(1)
    .setMaxLength(60)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const softwareNameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(softwareName);
  const softwareLinkActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(softwareLink);
  const softwareVersionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    softwareVersion
  );
  const softwarePlatformRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(softwarePlatform);
  const softwareCommentRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(softwareComment);

  softwareRequestModal.addComponents(
    softwareNameActionRow,
    softwareLinkActionRow,
    softwareVersionActionRow,
    softwarePlatformRow,
    softwareCommentRow
  );

  await interaction.showModal(softwareRequestModal);
}
