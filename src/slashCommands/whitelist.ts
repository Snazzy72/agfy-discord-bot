import {PermissionFlagsBits, SlashCommandBuilder, User} from "discord.js";
import {mongoClient} from "..";
import {SlashCommand} from "../types";
import {actionWarningEmbed} from "../util/functions/requests/embeds/warningEmbed";
import {actionSuccessEmbed} from "../util/functions/requests/embeds/successEmbed";
import {actionErrorEmbed} from "../util/functions/requests/embeds/errorEmbed";

const WhitelistCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Whitelists a user that was previously blacklisted")
    .addUserOption((option) => {
      return option.setName("id").setDescription("ID of the user to whitelist");
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    const user: User = interaction.options.getUser("id") as User;

    await interaction.deferReply({ephemeral: true})
    try {
      const query = {id: user.id};

      const blacklistEntry = await mongoClient.db("Requests").collection("Blacklist").findOne(query);

      if (!blacklistEntry) {
        await interaction.editReply({
          embeds: [actionWarningEmbed(`User **${user.username}** is not blacklisted.`)]
        });
        return;
      }

      await mongoClient.db("Requests").collection("Blacklist").deleteOne(query);

      await interaction.editReply({
        embeds: [actionSuccessEmbed(`User **${user.username}** has been whitelisted.`)]
      });
    } catch (e) {
      console.log(`❌ Failed to execute slash command: ${e instanceof Error ? e.message : e}`);
      await interaction.editReply({
        embeds: [actionErrorEmbed("An error occurred while processing the command. Please try again later.")]
      });
    }
  },
  cooldown: 60,
};

export default WhitelistCommand;
