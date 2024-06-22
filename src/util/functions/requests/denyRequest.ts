import {ButtonInteraction, ButtonStyle, CacheType, EmbedBuilder, GuildMember} from "discord.js";
import {handleDenyRequestModal} from "../../events/interactions/modals/requests/deny";
import {actionRow, requestButton} from "../../../slashCommands/init";
import {notifyUsers} from "../../reactions";
import {noPermissionEmbed} from "./permissionsEmbed";

export async function handleDenyRequest(interaction: ButtonInteraction<CacheType>): Promise<void> {
  const member = interaction.member as GuildMember;
  if (member.permissions.has("Administrator")) {
    const reason = await handleDenyRequestModal(interaction);

    const originalEmbed = interaction.message.embeds[0];

    originalEmbed.fields.forEach((field) => {
      if (field.name === "**Request Status**") {
        field.value = "Denied";
      }
    });

    const updatedEmbed = new EmbedBuilder(originalEmbed.data).setColor("#ff0000").addFields({
      name: "**Reason**",
      value: reason,
    });

    await interaction.message.edit({
      embeds: [updatedEmbed],
      components: [
        actionRow(
          requestButton("accept-request", "Approve", ButtonStyle.Success, true),
          requestButton("deny-request", "Denied", ButtonStyle.Danger, true),
          requestButton("reset-request", "Reset", ButtonStyle.Secondary)
        ),
      ],
    });

    await interaction.followUp({
      content: "Request status updated to: **Denied**. To reset the status and reason, use the reset button.",
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

    await notifyUsers(interaction.message.reactions.cache, interaction, originalEmbed, "Denied", reason);
  } else {
    await interaction.reply({
      embeds: [noPermissionEmbed()],
      ephemeral: true,
    });
  }
}
