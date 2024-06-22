import {ButtonStyle, CacheType, ModalSubmitInteraction, TextChannel} from "discord.js";
import {client} from "../../../../../../..";
import {actionRow, requestButton} from "../../../../../../../slashCommands/init";
import {EpicResponse, SteamResponse} from "../../../../../../../types";
import {Constants} from "../../../../../../constants";
import {extractGameDataFromEpic} from "../../../../../../data/epic";
import {extractGameDataFromSteam} from "../../../../../../data/steam";
import {validAGFYUrl} from "../../../../../../functions/modals/validateUrl";
import {fetchDuplicateRequest, isDuplicateRequest} from "../../../../../../functions/requests/duplicates";
import {createGameRequestEmbed} from "../../../../../../functions/requests/embeds/successfullRequest";
import {actionErrorEmbed} from "../../../../../../functions/requests/embeds/errorEmbed";
import {actionWarningEmbed} from "../../../../../../functions/requests/embeds/warningEmbed";
import {actionSuccessEmbed} from "../../../../../../functions/requests/embeds/successEmbed";

export async function handleMPGameRequestModal(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
  try {
    const mpGameRequestChannel = client.channels.cache.get(Constants.MultiplayerGameRequestChannel) as TextChannel;

    const mpGameLink = interaction.fields.getTextInputValue("multiplayer-game-link");
    const mpGameSteamEpicLink = interaction.fields.getTextInputValue("multiplayer-game-steam-epic-link");
    const mpGameVersion = interaction.fields.getTextInputValue("multiplayer-game-version");
    const mpGameConfirmation = interaction.fields.getTextInputValue("multiplayer-confirmation").toLowerCase();
    const mpGameHasMpConfirmation = interaction.fields.getTextInputValue("multiplayer-has-mp-confirmation");

    if (!validAGFYUrl(mpGameLink)) {
      await interaction.reply({embeds: [actionErrorEmbed("Provided link was not an AGFY link.")], ephemeral: true});
      return;
    }

    await interaction.deferReply({ephemeral: true});

    let extractedGameData: SteamResponse | EpicResponse | null = null;

    if (mpGameSteamEpicLink.startsWith(Constants.SteamUrl)) {
      extractedGameData = await extractGameDataFromSteam(mpGameSteamEpicLink);
    } else if (mpGameSteamEpicLink.startsWith(Constants.EpicUrl)) {
      extractedGameData = await extractGameDataFromEpic(mpGameSteamEpicLink);
    } else {
      await interaction.editReply({embeds: [actionErrorEmbed("Provided link is neither a Steam nor Epic Games link.")]});
      return;
    }

    if (!extractedGameData) {
      await interaction.editReply({embeds: [actionErrorEmbed("Failed to extract game data. Ref: **APIResponseError**")]});
      return;
    }

    if (mpGameConfirmation === "no") {
      await interaction.editReply({
        embeds: [actionWarningEmbed("You said **No**. Please check if the game supports multiplayer. If it does, make a new request.")]
      });
      return;
    }

    if (mpGameHasMpConfirmation === "yes") {
      await interaction.editReply({
        embeds: [actionWarningEmbed("You said: **Yes**. If the game already has multiplayer, there is no need to continue this request.")]
      });
      return;
    } else if (mpGameConfirmation === "yes" && mpGameHasMpConfirmation === "no") {
      if (mpGameRequestChannel) {
        const duplicateRequest = await isDuplicateRequest(mpGameRequestChannel, mpGameLink);

        if (duplicateRequest) {
          const duplicateRequestUrl = await fetchDuplicateRequest(mpGameRequestChannel, mpGameLink);

          await interaction.editReply({
            embeds: [actionWarningEmbed(`A similar request is already pending in the channel. [View](${duplicateRequestUrl})`)]
          });

          return;
        }

        const userRequest = await mpGameRequestChannel.send({
          embeds: [
            createGameRequestEmbed(
              "Multiplayer Request",
              mpGameLink,
              mpGameVersion,
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
      await interaction.editReply({embeds: [actionErrorEmbed("Invalid confirmation response.")]});
      return;
    }
  } catch (e) {
    console.error(e);
    await interaction.reply({
      embeds: [actionErrorEmbed(`Request by **${interaction.user.username}** failed and cannot be processed. Dump: **MRMS-109**`)],
      ephemeral: true,
    });
  }
}
