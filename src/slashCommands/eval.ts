import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { actionErrorEmbed } from "../util/functions/requests/embeds/errorEmbed";
import { noPermissionEmbed } from "../util/functions/requests/permissionsEmbed";

const EvalCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluates the given code.")
    .addStringOption((option) =>
      option.setName("code").setDescription("Code to be evaluated.").setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    if (interaction.user.id !== "590154294800416779") {
      return await interaction.reply({ embeds: [noPermissionEmbed()] });
    }
    const evalCode = interaction.options.get("code", true).value as string;

    await interaction.deferReply();

    try {
      let evalResult = eval(evalCode);

      if (evalResult instanceof Promise) {
        evalResult = await evalResult;
      }

      const resultType = capitalizeFirstLetter(typeof evalResult);

      const resultEmbed = new EmbedBuilder()
        .addFields(
          { name: "Input", value: `\`\`\`js\n${evalCode}\`\`\`` },
          { name: "Output", value: `\`\`\`js\n${evalResult.toString()}\`\`\`` },
          { name: "Type", value: `\`\`\`js\n${resultType}\`\`\`` },
        )
        .setColor("#00ff00");

      await interaction.editReply({ embeds: [resultEmbed] });
    } catch (e) {
      try {
        const errorType = capitalizeFirstLetter(typeof e);

        const errorEmbed = new EmbedBuilder()
          .addFields(
            { name: "Input", value: `\`\`\`js\n${evalCode}\`\`\`` },
            { name: "Output", value: `\`\`\`js\n${e}\`\`\`` },
            { name: "Type", value: `\`\`\`js\n${errorType}\`\`\`` },
          )
          .setColor("#ff0000");
        await interaction.editReply({ embeds: [errorEmbed] });
      } catch (e) {
        console.log(e);
        await interaction.editReply({ embeds: [actionErrorEmbed("Something went wrong")] });
      }
    }
  },
  cooldown: 10,
};

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default EvalCommand;
