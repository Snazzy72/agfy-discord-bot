import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
  TextChannel,
  User,
} from "discord.js";

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  modal?: (interaction: ModalSubmitInteraction<CacheType>) => void;
  cooldown?: number;
}

export interface Command {
  name: string;
  execute: (message: Message, args: Array<string>) => void;
  permissions: Array<PermissionResolvable>;
  aliases: Array<string>;
  cooldown?: number;
}

interface GuildOptions {
  prefix: string;
}

export interface IGuild extends mongoose.Document {
  guildID: string;
  options: GuildOptions;
  joinedAt: Date;
}

export interface IBlacklist extends mongoose.Document {
  user: User;
  id: string;
}

export type GuildOption = keyof GuildOptions;
export interface BotEvent {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      CLIENT_ID: string;
      POSTMAN_API_KEY: string;
      PREFIX: string;
      MONGO_URI: string;
      MONGO_DATABASE_NAME: string;
    }
  }
}

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    commands: Collection<string, Command>;
    cooldowns: Collection<string, number>;
  }
}

export interface SteamResponse {
  gameName: string;
  gameDescription: string;
  gameImage: string;
}

export interface EpicResponse {
  gameName: string;
  gameDescription: string;
  gameImage: string;
}
