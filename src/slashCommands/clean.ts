import {PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../types";
import {actionErrorEmbed} from "../util/functions/requests/embeds/errorEmbed";
import {actionSuccessEmbed} from "../util/functions/requests/embeds/successEmbed";
import {actionWarningEmbed} from "../util/functions/requests/embeds/warningEmbed";

const CleanCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("clean")
    .setDescription(`Deletes all requests that have been Approved or Denied. Range: 1 - 100`)
    .addIntegerOption((option) =>
      option
        .setMaxValue(100)
        .setMinValue(1)
        .setName("range")
        .setDescription("The range to clean. 1 - 100")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    const range = Number(interaction.options.get("range")?.value);
    let deletedRequests = 0;
    try {
      await interaction.deferReply({ephemeral: true})

      const fetchedMessages = await interaction.channel?.messages.fetch({limit: range});

      if (!fetchedMessages) {
        return await interaction.reply({
          embeds: [actionErrorEmbed("No messages found")],
          ephemeral: true,
        });
      }

      for (const request of fetchedMessages.values()) {
        const requestEmbed = request.embeds[0];
        if (!requestEmbed) continue;

        for (const field of requestEmbed.fields) {
          if (field.name === "**Request Status**" && (field.value === "Approved" || field.value === "Denied")) {
            await request.delete();
            deletedRequests++;
            break;
          }
        }
      }

      if (deletedRequests > 0) {
        await interaction.editReply({
          embeds: [actionSuccessEmbed(`Cleaned **${deletedRequests}** request(s) within the given range.`)],
        });
      } else {
        await interaction.editReply({
          embeds: [actionWarningEmbed("Could not find any **Approved** or **Denied** requests with the given range.")],
        });
      }

    } catch (e) {
      console.log(`❌ Failed to execute slash command: ${e instanceof Error ? e.message : e}`);
      await interaction.editReply({
        embeds: [actionErrorEmbed("An error occurred while processing this command. Dump: **CSC-61**")],
      });
    }
  },
  cooldown: 10,
};

export default CleanCommand;