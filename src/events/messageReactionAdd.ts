import {
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User
} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
  name: "messageReactionAdd",
  execute: async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        console.log("Something went wrong when fetching the message: ", e)
      }
    }

    if (reaction.message.partial) {
      try {
        await reaction.message.fetch();
      } catch (e) {
        console.error("Something went wrong when fetching the message: ", e);
        return;
      }
    }

    if (user.partial) {
      try {
        await user.fetch();
      } catch (e) {
        console.error("Something went wrong when fetching the user: ", e);
        return;
      }
    }
  },
};

export default event;