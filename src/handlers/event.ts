import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "../types";

module.exports = async (client: Client) => {
  const eventBuilder: Array<BotEvent> = [];
  const eventDirectory = join(__dirname, "../events");

  console.log("\n🔃 Fetching application events...");

  readdirSync(eventDirectory).forEach((file) => {
    try {
      if (!file.endsWith(".js")) return;
      let event: BotEvent = require(`${eventDirectory}/${file}`).default;

      event.once
        ? client.once(event.name, (...args) => event.execute(...args))
        : client.on(event.name, (...args) => event.execute(...args));
      eventBuilder.push(event);

      console.log(`✅ Loaded event: ${event.name}`);
    } catch (e) {
      console.log(`❌ Failed to load event in file: ${file}`, e instanceof Error ? e.message : e);
    }
  });
  console.log(`\n✅ Successfully loaded ${eventBuilder.length} event(s)`);
};
