import {ButtonInteraction, ButtonStyle, CacheType, EmbedBuilder, GuildMember} from "discord.js";
import {actionRow, requestButton} from "../../../slashCommands/init";
import {notifyUsers} from "../../reactions";
import {noPermissionEmbed} from "./permissionsEmbed";

export async function handleAcceptRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  const member = interaction.member as GuildMember;
  if (member.permissions.has("Administrator")) {
    const originalEmbed = interaction.message.embeds[0];

    originalEmbed.fields.forEach((field) => {
      if (field.name === "**Request Status**") {
        field.value = "Approved";
      }
    });

    const updatedEmbed = new EmbedBuilder(originalEmbed.data).setColor("#00ff00");

    await interaction.message.edit({
      embeds: [updatedEmbed],
      components: [
        actionRow(
          requestButton("accept-request", "Approved", ButtonStyle.Success, true),
          requestButton("deny-request", "Deny", ButtonStyle.Danger, true),
          requestButton("reset-request", "Reset", ButtonStyle.Secondary)
        ),
      ],
    });

    await interaction.reply({
      content: "Request status updated to: **Approved**. To reset the status, use the reset button.",
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

    await notifyUsers(interaction.message.reactions.cache, interaction, originalEmbed, "Approved");
  } else {
    await interaction.reply({
      embeds: [noPermissionEmbed()],
      ephemeral: true,
    });
  }
}
