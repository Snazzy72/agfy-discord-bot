import {ButtonStyle, CacheType, ModalSubmitInteraction, TextChannel} from "discord.js";
import {client} from "../../../../../../..";
import {actionRow, requestButton} from "../../../../../../../slashCommands/init";
import {Constants} from "../../../../../../constants";
import {fetchDuplicateRequest, isDuplicateRequest} from "../../../../../../functions/requests/duplicates";
import {
  createNonEpicSteamRequestEmbed,
  createSoftwareRequestEmbed
} from "../../../../../../functions/requests/embeds/successfullRequest";
import {actionErrorEmbed} from "../../../../../../functions/requests/embeds/errorEmbed";
import {actionWarningEmbed} from "../../../../../../functions/requests/embeds/warningEmbed";
import {actionSuccessEmbed} from "../../../../../../functions/requests/embeds/successEmbed";

export async function handleNonEpicSteamRequestModal(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
  try {
    const nonEpicSteamRequestChannel = client.channels.cache.get(
      Constants.NonEpicSteamGameRequestChannel
    ) as TextChannel;

    const nonEpicSteamName = interaction.fields.getTextInputValue("non-epic-steam-name");
    const nonEpicSteamLink = interaction.fields.getTextInputValue("non-epic-steam-link");
    const nonEpicSteamVersion = interaction.fields.getTextInputValue("non-epic-steam-version");
    const nonEpicSteamComments = interaction.fields.getTextInputValue("non-epic-steam-comment");

    if (!nonEpicSteamLink.startsWith("https://")) {
      await interaction.reply({
        embeds: [actionErrorEmbed("Invalid link provided. Game links should start with **https://**")],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ephemeral: true});

    if (nonEpicSteamRequestChannel && nonEpicSteamRequestChannel.isTextBased()) {
      const duplicateRequest = await isDuplicateRequest(nonEpicSteamRequestChannel, nonEpicSteamLink);

      if (duplicateRequest) {
        const duplicateRequestUrl = await fetchDuplicateRequest(nonEpicSteamRequestChannel, nonEpicSteamLink);

        await interaction.editReply({
          embeds: [actionWarningEmbed(`A similar request is already pending in the channel. [View](${duplicateRequestUrl})`)]
        });

        return;
      }

      const userRequest = await nonEpicSteamRequestChannel.send({
        embeds: [
          createNonEpicSteamRequestEmbed(
            "Non Epic/Steam Request",
            nonEpicSteamLink,
            interaction.user,
            nonEpicSteamName,
            nonEpicSteamVersion,
            nonEpicSteamComments
          ),
        ],
        components: [
          actionRow(
            requestButton("accept-request", "Approve", ButtonStyle.Success),
            requestButton("deny-request", "Deny", ButtonStyle.Danger),
            requestButton("reset-request", "Reset", ButtonStyle.Secondary, true)
          ),
        ],
      });

      await userRequest.react("🔔");
      await interaction.editReply({
        embeds: [actionSuccessEmbed(`Request by **${interaction.user.username}** has been received and is being processed. 
          [View](${userRequest.url})`)]
      });
    } else {
      await interaction.editReply({
        embeds: [actionErrorEmbed("Invalid confirmation response.")]
      });
    }
  } catch (e) {
    console.error(e);
    await interaction.reply({
      embeds: [actionErrorEmbed(`Request by **${interaction.user.username}** failed and cannot be processed. Dump: **NESMS-78**`)],
      ephemeral: true,
    });
  }
}
