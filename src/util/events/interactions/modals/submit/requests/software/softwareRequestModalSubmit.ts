import {ModalSubmitInteraction, CacheType, TextChannel, ButtonStyle} from "discord.js";
import {client} from "../../../../../../..";
import {actionRow, requestButton} from "../../../../../../../slashCommands/init";
import {isDuplicateRequest, fetchDuplicateRequest} from "../../../../../../functions/requests/duplicates";
import {createSoftwareRequestEmbed} from "../../../../../../functions/requests/embeds/successfullRequest";
import {Constants} from "../../../../../../constants";
import {actionErrorEmbed} from "../../../../../../functions/requests/embeds/errorEmbed";
import {actionWarningEmbed} from "../../../../../../functions/requests/embeds/warningEmbed";
import {actionSuccessEmbed} from "../../../../../../functions/requests/embeds/successEmbed";

export async function handleSoftwareRequestModal(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
  try {
    const softwareRequestChannel = client.channels.cache.get(Constants.SoftwareRequestChannel) as TextChannel;

    const softwareName = interaction.fields.getTextInputValue("software-name");
    const softwareLink = interaction.fields.getTextInputValue("software-link");
    const softwareVersion = interaction.fields.getTextInputValue("software-version");
    const softwarePlatform = interaction.fields.getTextInputValue("software-platform").toLowerCase();
    const softwareComments = interaction.fields.getTextInputValue("software-comment");

    if (!softwareLink.startsWith("https://")) {
      await interaction.reply({
        embeds: [actionErrorEmbed("Invalid link provided. Software links should start with **https://**")],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ephemeral: true});

    if (softwareRequestChannel && softwareRequestChannel.isTextBased()) {
      const duplicateRequest = await isDuplicateRequest(softwareRequestChannel, softwareLink);

      if (duplicateRequest) {
        const duplicateRequestUrl = await fetchDuplicateRequest(softwareRequestChannel, softwareLink);

        await interaction.editReply({
          embeds: [actionWarningEmbed(`A similar request is already pending in the channel. [View](${duplicateRequestUrl})`)]
        });

        return;
      }

      if (softwarePlatform !== "windows" && softwarePlatform !== "mac") {
        await interaction.editReply({embeds: [actionWarningEmbed("Provided platform is neither Windows nor Mac.")]})

        return;
      }

      const userRequest = await softwareRequestChannel.send({
        embeds: [
          createSoftwareRequestEmbed(
            "Software Request",
            softwareLink,
            interaction.user,
            softwareName,
            softwareVersion,
            softwarePlatform,
            softwareComments
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
        embeds: [actionWarningEmbed("Software Request channel not found. Please set up a channel for software requests.")]
      });
    }
  } catch (e) {
    console.error(e);
    await interaction.reply({
      embeds: [actionErrorEmbed(`Request by **${interaction.user.username}** failed and cannot be processed. Dump: **SRMS-84**`)],
      ephemeral: true,
    });
  }
}
