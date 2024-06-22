import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { mongoClient } from "..";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: async (client: Client) => {
    try {
      await mongoClient.connect();
      await mongoClient.db("Requests").command({ ping: 1 });
      console.log("\n🍀 Pinged MongoDB deployment. Successfully connected");
    } catch (e) {
      console.log(`❌ Failed to ping MongoDB deployment.`);
      await mongoClient.close();
    }
    client.user?.setActivity({ name: "requests", type: ActivityType.Listening, state: "🌐 https://gamesforyou.co/" });
    console.log(`\n🌐 Bot is running and logged in as ${client.user?.tag}`);
  },
};

export default event;
