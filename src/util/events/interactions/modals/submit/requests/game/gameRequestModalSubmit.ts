import {ModalSubmitInteraction, CacheType, TextChannel, ButtonStyle} from "discord.js";
import {client} from "../../../../../../../index.js";
import {actionRow, requestButton} from "../../../../../../../slashCommands/init.js";
import {isDuplicateRequest, fetchDuplicateRequest} from "../../../../../../functions/requests/duplicates.js";
import {Constants} from "../../../../../../constants.js";
import {createGameRequestEmbed} from "../../../../../../functions/requests/embeds/successfullRequest.js";
import {extractGameDataFromSteam} from "../../../../../../data/steam.js";
import {extractGameDataFromEpic} from "../../../../../../data/epic.js";
import {EpicResponse, SteamResponse} from "../../../../../../../types.js";
import {actionErrorEmbed} from "../../../../../../functions/requests/embeds/errorEmbed";
import {actionWarningEmbed} from "../../../../../../functions/requests/embeds/warningEmbed";
import {actionSuccessEmbed} from "../../../../../../functions/requests/embeds/successEmbed";

export async function handleGameRequestModal(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
  try {
    const gameRequestChannel = client.channels.cache.get(Constants.GameRequestChannel) as TextChannel;

    const gameLink = interaction.fields.getTextInputValue("game-link");
    const gameVersion = interaction.fields.getTextInputValue("game-version");
    const gameOnSiteConfirmation = interaction.fields.getTextInputValue("game-on-site-confirmation").toLowerCase();

    await interaction.deferReply({ephemeral: true});

    let extractedGameData: SteamResponse | EpicResponse | null = null;

    if (gameLink.startsWith(Constants.SteamUrl)) {
      extractedGameData = await extractGameDataFromSteam(gameLink);
    } else if (gameLink.startsWith(Constants.EpicUrl)) {
      extractedGameData = await extractGameDataFromEpic(gameLink);
    } else {
      await interaction.editReply({embeds: [actionErrorEmbed("Provided link is neither a Steam nor Epic Games link.")]});
      return;
    }

    if (!extractedGameData) {
      await interaction.editReply({embeds: [actionErrorEmbed("Failed to extract game data. Ref: **APIResponseError**")]});
      return;
    }

    if (gameOnSiteConfirmation === "yes") {
      await interaction.editReply({
        embeds: [actionWarningEmbed("You said **Yes**. If the game is already on site, there is no need to continue this request.")]
      });
      return;
    } else if (gameOnSiteConfirmation === "no") {
      if (gameRequestChannel) {
        const duplicateRequest = await isDuplicateRequest(gameRequestChannel, gameLink);

        if (duplicateRequest) {
          const duplicateRequestUrl = await fetchDuplicateRequest(gameRequestChannel, gameLink);

          await interaction.editReply({
            embeds: [actionWarningEmbed(`A similar request is already pending in the channel. [View](${duplicateRequestUrl})`)]
          });

          return;
        }

        const userRequest = await gameRequestChannel.send({
          embeds: [
            createGameRequestEmbed(
              "Game Request",
              gameLink,
              gameVersion,
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
      } else {
        await interaction.editReply({embeds: [actionWarningEmbed("Game Request channel not found. Please set up a channel for game requests.")]});
        return;
      }
    } else {
      await interaction.editReply({
        embeds: [actionErrorEmbed("Invalid confirmation response.")]
      });
    }
  } catch (e) {
    console.error(e);
    await interaction.editReply({
      embeds: [actionErrorEmbed(`Request by **${interaction.user.username}** failed and cannot be processed. Dump: **GRMS-98**`)],
    });
  }
}
