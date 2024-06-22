import {
  ButtonInteraction,
  CacheType,
  Collection,
  Embed,
  MessageReaction,
} from "discord.js";

const statusEmojis: Record<string, string> = {
  Approved: "👍",
  Denied: "👎",
  Reset: "🔃",
};

export async function notifyUsers(
  reactions: Collection<string, MessageReaction>,
  interaction: ButtonInteraction<CacheType>,
  embed: Embed,
  status: string,
  reason?: string
) {
  const emoji = statusEmojis[status] || "";

  for (const reaction of reactions.values()) {
    const users = await reaction.users.fetch();
    for (const user of users.values()) {
      if (reaction.emoji.name === "🔔" && !user.bot) {
        let message = `The request status for [${embed.data.title}](${interaction.message.url}) has been **${status}** ${emoji}`;
        if (reason) {
          message += ` Reason: **${reason}**`;
        }
        await user.send(message);
      }
    }
  }
}

