import {ModalSubmitInteraction, CacheType, TextChannel, ButtonStyle} from "discord.js";
import {client} from "../../../../../../..";
import {actionRow, requestButton} from "../../../../../../../slashCommands/init";
import {isDuplicateRequest, fetchDuplicateRequest} from "../../../../../../functions/requests/duplicates";
import {Constants} from "../../../../../../constants";
import {SteamResponse, EpicResponse} from "../../../../../../../types";
import {extractGameDataFromEpic} from "../../../../../../data/epic";
import {extractGameDataFromSteam} from "../../../../../../data/steam";
import {validAGFYUrl} from "../../../../../../functions/modals/validateUrl";
import {
  createUpdateRequestEmbed,
} from "../../../../../../functions/requests/embeds/successfullRequest";
import {actionErrorEmbed} from "../../../../../../functions/requests/embeds/errorEmbed";
import {actionWarningEmbed} from "../../../../../../functions/requests/embeds/warningEmbed";
import {actionSuccessEmbed} from "../../../../../../functions/requests/embeds/successEmbed";

export async function handleUpdateRequestModal(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
  try {
    const updateGameRequestChannel = client.channels.cache.get(Constants.UpdateGameRequestChannel) as TextChannel;

    const updateGameLink = interaction.fields.getTextInputValue("update-game-link");
    const updateGameSteamEpicLink = interaction.fields.getTextInputValue("update-game-steam-epic-link");
    const updateGameCurrentVersion = interaction.fields.getTextInputValue("update-game-current-version");
    const updateGameConfirmation = interaction.fields.getTextInputValue("update-confirmation").toLowerCase();
    const updateGameDesiredVersion = interaction.fields.getTextInputValue("update-game-desired-version");

    if (!validAGFYUrl(updateGameLink)) {
      await interaction.reply({embeds: [actionErrorEmbed("Provided link was not an AGFY link.")], ephemeral: true});
      return;
    }

    await interaction.deferReply({ephemeral: true});

    let extractedGameData: SteamResponse | EpicResponse | null = null;

    if (updateGameSteamEpicLink.startsWith(Constants.SteamUrl)) {
      extractedGameData = await extractGameDataFromSteam(updateGameSteamEpicLink);
    } else if (updateGameSteamEpicLink.startsWith(Constants.EpicUrl)) {
      extractedGameData = await extractGameDataFromEpic(updateGameSteamEpicLink);
    } else {
      await interaction.editReply({embeds: [actionErrorEmbed("Provided link is neither a Steam nor Epic Games link.")]});
      return;
    }

    if (!extractedGameData) {
      await interaction.editReply({embeds: [actionErrorEmbed("Failed to extract game data. Ref: **APIResponseError**")]});
      return;
    }

    if (updateGameConfirmation === "no") {
      await interaction.editReply({
        embeds: [actionWarningEmbed("You said **No**. Please check if the game has an update. If it does, make a new request.")]
      });
      return;
    }
    if (updateGameConfirmation === "yes") {
      if (updateGameRequestChannel && updateGameRequestChannel.isTextBased()) {
        const duplicateRequest = await isDuplicateRequest(updateGameRequestChannel, updateGameLink);

        if (duplicateRequest) {
          const duplicateRequestUrl = await fetchDuplicateRequest(updateGameRequestChannel, updateGameLink);

          await interaction.editReply({
            embeds: [actionWarningEmbed(`A similar request is already pending in the channel. [View](${duplicateRequestUrl})`)]
          });

          return;
        }

        const userRequest = await updateGameRequestChannel.send({
          embeds: [
            createUpdateRequestEmbed(
              "Update Game Request",
              updateGameLink,
              interaction.user,
              extractedGameData.gameName,
              updateGameCurrentVersion,
              updateGameDesiredVersion,
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
      await interaction.editReply({embeds: [actionErrorEmbed("Invalid confirmation response.")]});
      return;
    }
  } catch (e) {
    console.error(e);
    await interaction.reply({
      embeds: [actionErrorEmbed(`Request by **${interaction.user.username}** failed and cannot be processed. Dump: **URMS-106**`)],
      ephemeral: true,
    });
  }
}
