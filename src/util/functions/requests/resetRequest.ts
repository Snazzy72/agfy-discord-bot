import {ButtonInteraction, ButtonStyle, CacheType, EmbedBuilder, GuildMember} from "discord.js";
import {actionRow, requestButton} from "../../../slashCommands/init";
import {notifyUsers} from "../../reactions";
import {noPermissionEmbed} from "./permissionsEmbed";

export async function handleResetRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  const member = interaction.member as GuildMember;
  if (member.permissions.has("Administrator")) {
    const originalEmbed = interaction.message.embeds[0];

    const filteredFields = originalEmbed.fields.filter((field) => field.name !== "**Reason**");

    originalEmbed.fields.forEach((field) => {
      if (field.name === "**Request Status**") {
        field.value = "Unknown";
      }
    });

    const updatedEmbed = new EmbedBuilder(originalEmbed.data).setColor("#23272A").setFields(filteredFields);

    await interaction.message.edit({
      embeds: [updatedEmbed],
      components: [
        actionRow(
          requestButton("accept-request", "Approve", ButtonStyle.Success),
          requestButton("deny-request", "Deny", ButtonStyle.Danger),
          requestButton("reset-request", "Reset", ButtonStyle.Secondary, true)
        ),
      ],
    });

    await interaction.reply({
      content: "Request status has been **reset**. To update the status, either Accept or Deny it.",
      ephemeral: true,
    });

    if (!interaction.message.partial) {
      await interaction.message.fetch();
    }

    // Cache reactions if not already cached
    const reactions = interaction.message.reactions.cache;
    if (!reactions.size) {
      await Promise.all(interaction.message.reactions.cache.map((reaction) => reaction.fetch()));
    }

    await notifyUsers(interaction.message.reactions.cache, interaction, originalEmbed, "Reset");
  } else {
    await interaction.reply({
      embeds: [noPermissionEmbed()],
      ephemeral: true,
    });
  }
}
