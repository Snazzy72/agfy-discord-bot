import {Interaction} from "discord.js";
import {BotEvent} from "../types";
import {handleAutoComplete} from "../util/events/interactions/autocomplete";
import {handleChatInputCommand} from "../util/events/interactions/chatInputCommand";
import {handleButtonInteraction} from "../util/events/interactions/button";
import {handleModalSubmit} from "../util/events/interactions/modalSubmit";

const event: BotEvent = {
  name: "interactionCreate",
  execute: async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        handleChatInputCommand(interaction);
      } else if (interaction.isAutocomplete()) {
        handleAutoComplete(interaction);
      } else if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
      } else if (interaction.isModalSubmit()) {
        await handleModalSubmit(interaction);
      }
    } catch (error) {
      console.error("Error handling interaction:", error);
    }
  },
};

export default event;
