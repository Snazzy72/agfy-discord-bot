import { CacheType, ModalSubmitInteraction, TextChannel } from "discord.js";
import { Constants } from "../../constants";

export async function isDuplicateRequest(requestChannel: TextChannel, gameLink: string): Promise<boolean> {
  const existingRequests = await requestChannel.messages.fetch({ limit: Constants.RequestsFilterLimit });

  const similarRequest = existingRequests.find((request) => {
    let isSimilar = request.embeds.length > 0 && request.embeds[0].url === gameLink;

    if (isSimilar) {
      const requestStatusField = request.embeds[0].fields.find((field) => field.name === "**Request Status**");
      if (requestStatusField && requestStatusField.value === "Unknown") {
        return true;
      }
    }

    return false;
  });

  return !!similarRequest;
}

export async function fetchDuplicateRequest(requestChannel: TextChannel, gameLink: string): Promise<string | null> {
  const existingRequests = await requestChannel.messages.fetch({ limit: Constants.RequestsFilterLimit });

  const similarRequest = existingRequests.find((request) => {
    return request.embeds.length > 0 && request.embeds[0].url === gameLink;
  });

  return similarRequest ? similarRequest.url : null;
}

export async function sendDuplicateRequestWarning(
  interaction: ModalSubmitInteraction<CacheType>,
  duplicateRequestUrl: string
) {
  return await interaction.editReply({
    content: `⚠️ A similar request is already pending in the channel. [View](${duplicateRequestUrl})`,
  });
}
