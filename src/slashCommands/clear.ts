import {ChannelType, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../types";
import {actionErrorEmbed} from "../util/functions/requests/embeds/errorEmbed";
import {actionSuccessEmbed} from "../util/functions/requests/embeds/successEmbed";

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes messages from the current channel.")
    .addIntegerOption((option) => {
      return option
        .setMaxValue(100)
        .setMinValue(1)
        .setName("messagecount")
        .setDescription("Message amount to be cleared");
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    let messageCount = Number(interaction.options.get("messagecount")?.value || 1);

    await interaction.deferReply({ephemeral: true})
    try {
      interaction.channel?.messages.fetch({limit: messageCount}).then(async (msgs) => {
        if (interaction.channel?.type === ChannelType.DM) return;

        const deletedMessages = await interaction.channel?.bulkDelete(msgs, true);
        if (deletedMessages?.size === 0) await interaction.editReply({embeds: [actionErrorEmbed("No messages were deleted.")]});
        else await interaction.editReply({embeds: [actionSuccessEmbed(`Deleted **${deletedMessages?.size}** message(s).`)]});
      });
    } catch (e) {
      console.log(`❌ Failed to execute slash command: ${e instanceof Error ? e.message : e}`);
      await interaction.editReply({
        embeds: [actionErrorEmbed("An error occurred while processing this command. Ref: **CSC-33**")]
      });
    }
  },
  cooldown: 10,
};

export default ClearCommand;
