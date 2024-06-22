import { PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import { mongoClient } from "..";
import { SlashCommand } from "../types";
import { actionWarningEmbed } from "../util/functions/requests/embeds/warningEmbed";
import { actionSuccessEmbed } from "../util/functions/requests/embeds/successEmbed";
import { actionErrorEmbed } from "../util/functions/requests/embeds/errorEmbed";

const BlacklistCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklists a user from requesting")
    .addUserOption((option) => {
      return option.setName("id").setDescription("ID of the user to blacklist");
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    const user = interaction.options.getUser("id") as User;

    await interaction.deferReply({ ephemeral: true });

    try {
      const query = { user: user, id: user.id, admin: interaction.user.username };

      const blacklistEntry = await isBlacklisted(user);

      if (blacklistEntry) {
        await interaction.editReply({
          embeds: [actionWarningEmbed(`This user has already been blacklisted by **${blacklistEntry.admin}**`)],
        });
        return;
      }

      await mongoClient.db("Requests").collection("Blacklist").insertOne(query);

      await interaction.editReply({
        embeds: [actionSuccessEmbed(`User **${user.username}** has been blacklisted.`)],
      });
    } catch (e) {
      console.log(`❌ Failed to execute slash command: ${e instanceof Error ? e.message : e}`);
      await interaction.editReply({
        embeds: [actionErrorEmbed("An error occurred while processing the command. Please try again later.")],
      });
    }
  },
  cooldown: 60,
};

export async function isBlacklisted(user: User) {
  try {
    return await mongoClient.db("Requests").collection("Blacklist").findOne({ id: user.id });
  } catch (e) {
    console.log(`❌ Failed to check if the user is blacklisted`);
  }
}

export default BlacklistCommand;
