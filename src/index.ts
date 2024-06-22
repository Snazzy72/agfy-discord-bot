import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { config } from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { readdirSync } from "fs";
import { join } from "path";
import { SlashCommand } from "./types";

config();

const { Guilds, MessageContent, GuildMessages, GuildMembers, GuildMessageReactions } =
  GatewayIntentBits;

export const client = new Client({
  intents: [Guilds, MessageContent, GuildMessages, GuildMembers, GuildMessageReactions],
  partials: [Partials.Message, Partials.Reaction, Partials.User, Partials.GuildMember],
});

client.slashCommands = new Collection<string, SlashCommand>();
client.cooldowns = new Collection<string, number>();

export const mongoClient = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const handlersDirectory = join(__dirname, "./handlers");
readdirSync(handlersDirectory).forEach((handler) => {
  if (!handler.endsWith(".js")) return;
  require(`${handlersDirectory}/${handler}`)(client);
});

client.login(process.env.TOKEN);
