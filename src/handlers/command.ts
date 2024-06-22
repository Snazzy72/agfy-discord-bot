import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { SlashCommand } from "../types";

module.exports = async (client: Client) => {
  const slashCommandBuilder: Array<SlashCommandBuilder> = [];
  const slashCommandDirectory = join(__dirname, "../slashCommands");

  console.log("🔃 Fetching application slash commands...");

  readdirSync(slashCommandDirectory).forEach((file) => {
    try {
      if (!file.endsWith(".js")) return;
      let slashCommand: SlashCommand = require(`${slashCommandDirectory}/${file}`).default;

      slashCommandBuilder.push(slashCommand.command);
      client.slashCommands.set(slashCommand.command.name, slashCommand);

      console.log(`✅ Loaded command: ${slashCommand.command.name}`);
    } catch (e) {
      console.log(`❌ Failed to load command in file: ${file} ->`, e);
    }
  });

  const rest: REST = new REST({ version: "10" }).setToken(process.env.TOKEN);

  await rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: slashCommandBuilder.map((command) => command.toJSON()),
    })
    .then((data: any) => {
      console.log(`✅ Successfully loaded ${data.length} slash command(s)`);
    })
    .catch((e) => {
      console.log(`❌ Failed to register application slash commands: `, e instanceof Error ? e.message : e);
    });
};
