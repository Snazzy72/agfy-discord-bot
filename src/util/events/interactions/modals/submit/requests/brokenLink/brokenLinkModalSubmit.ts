import {ButtonStyle, CacheType, ModalSubmitInteraction, TextChannel} from "discord.js";
import {client} from "../../../../../../..";
import {actionRow, requestButton} from "../../../../../../../slashCommands/init";
import {Constants} from "../../../../../../constants";
import {validAGFYUrl} from "../../../../../../functions/modals/validateUrl";
import {fetchDuplicateRequest, isDuplicateRequest} from "../../../../../../functions/requests/duplicates";
import {createBrokenLinkRequestEmbed} from "../../../../../../functions/requests/embeds/successfullRequest";
import {extractGameDataFromSteam} from "../../../../../../data/steam";
import {EpicResponse, SteamResponse} from "../../../../../../../types";
import {extractGameDataFromEpic} from "../../../../../../data/epic";
import {actionErrorEmbed} from "../../../../../../functions/requests/embeds/errorEmbed";
import {actionWarningEmbed} from "../../../../../../functions/requests/embeds/warningEmbed";
import {actionSuccessEmbed} from "../../../../../../functions/requests/embeds/successEmbed";

export async function handleBrokenLinkRequestModal(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
  try {
    const brokenLinksRequestChannel = client.channels.cache.get(Constants.BrokenLinkRequestChannel) as TextChannel;

    const brokenLink = interaction.fields.getTextInputValue("broken-link");
    const brokenSteamEpicLink = interaction.fields.getTextInputValue("broken-steam-epic-link");
    const confirmation = interaction.fields.getTextInputValue("broken-link-confirmation").toLowerCase();
    const comments = interaction.fields.getTextInputValue("broken-link-comment");

    if (!validAGFYUrl(brokenLink)) {
      await interaction.reply({embeds: [actionErrorEmbed("Provided link was not an AGFY link.")], ephemeral: true});
      return;
    }

    await interaction.deferReply({ephemeral: true});

    let extractedGameData: SteamResponse | EpicResponse | null = null;

    if (brokenSteamEpicLink.startsWith(Constants.SteamUrl)) {
      extractedGameData = await extractGameDataFromSteam(brokenSteamEpicLink);
    } else if (brokenSteamEpicLink.startsWith(Constants.EpicUrl)) {
      extractedGameData = await extractGameDataFromEpic(brokenSteamEpicLink);
    } else {
      await interaction.editReply({embeds: [actionErrorEmbed("Provided link is neither a Steam nor Epic Games link")]});
      return;
    }

    if (!extractedGameData) {
      await interaction.editReply({embeds: [actionErrorEmbed("Failed to extract game data. **APIResponseError**")]});
      return;
    }

    if (confirmation === "yes") {
      await interaction.editReply({
        embeds: [actionWarningEmbed(" You said **Yes**. If you are able to download the game, there is no need to continue this request.")],
      });
      return;
    } else if (confirmation === "no") {
      if (brokenLinksRequestChannel) {
        const isDuplicate = await isDuplicateRequest(brokenLinksRequestChannel, brokenLink);

        if (isDuplicate) {
          const duplicateRequestUrl = (await fetchDuplicateRequest(brokenLinksRequestChannel, brokenLink)) as string;
          await interaction.editReply({
            embeds: [actionWarningEmbed(`A similar request is already pending in the channel. [View](${duplicateRequestUrl})`)]
          });

          return;
        }

        const userRequest = await brokenLinksRequestChannel.send({
          embeds: [
            createBrokenLinkRequestEmbed(
              "Broken Link Request",
              brokenLink,
              comments,
              interaction.user,
              extractedGameData.gameName,
              extractedGameData.gameDescription,
              extractedGameData.gameImage
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
      }
    } else {
      await interaction.editReply({
        embeds: [actionErrorEmbed("Invalid confirmation response.")]
      });
    }
  } catch (e) {
    console.error(e);
    await interaction.reply({
      embeds: [actionErrorEmbed(`Request by **${interaction.user.username}** failed and cannot be processed. Dump: **BLMS-102**`)],
      ephemeral: true,
    });
  }
}

export async function getDeniedReasonModal(interaction: ModalSubmitInteraction<CacheType>): Promise<string> {
  return interaction.fields.getTextInputValue("denied-reason");
}
