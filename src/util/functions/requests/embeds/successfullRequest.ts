import {EmbedBuilder, User} from "discord.js";

export function createGameRequestEmbed(
  reqType: string,
  gameLink: string,
  desiredVersion: string,
  user: User,
  title: string,
  description?: string,
  image?: string
): EmbedBuilder {
  const embedBuilder = new EmbedBuilder()
    .setTitle(title)
    .setURL(gameLink)
    .addFields(
      {
        name: "**Desired Version**",
        value: desiredVersion,
      },
      {
        name: "**Request Type**",
        value: reqType,
      },
      {
        name: "**Request Status**",
        value: "Unknown",
      }
    )
    .setTimestamp()
    .setFooter({text: `Requested by ${user.tag}`});

  if (description) {
    embedBuilder.setDescription(description);
  }

  if (image) {
    embedBuilder.setImage(image);
  }

  return embedBuilder;
}

export function createBrokenLinkRequestEmbed(
  reqType: string,
  gameLink: string,
  comment: string,
  user: User,
  title: string,
  description?: string,
  image?: string
): EmbedBuilder {
  const embedBuilder = new EmbedBuilder()
    .setTitle(title)
    .setURL(gameLink)
    .addFields(
      {
        name: "**Comments**",
        value: comment,
      },
      {
        name: "**Request Type**",
        value: reqType,
      },
      {
        name: "**Request Status**",
        value: "Unknown",
      }
    )
    .setTimestamp()
    .setFooter({text: `Requested by ${user.tag}`});

  if (description) {
    embedBuilder.setDescription(description);
  }

  if (image) {
    embedBuilder.setImage(image);
  }

  return embedBuilder;
}

export function createUpdateRequestEmbed(
  reqType: string,
  gameLink: string,
  user: User,
  title: string,
  currentVersion: string,
  desiredVersion: string,
  description?: string,
  image?: string
): EmbedBuilder {
  const embedBuilder = new EmbedBuilder()
    .setTitle(title)
    .setURL(gameLink)
    .addFields(
      {
        name: "**Current Version**",
        value: currentVersion,
      },
      {
        name: "**Desired Version**",
        value: desiredVersion,
      },
      {
        name: "**Request Type**",
        value: reqType,
      },
      {
        name: "**Request Status**",
        value: "Unknown",
      }
    )
    .setTimestamp()
    .setFooter({text: `Requested by ${user.tag}`});

  if (description) {
    embedBuilder.setDescription(description);
  }

  if (image) {
    embedBuilder.setImage(image);
  }

  return embedBuilder;
}

export function createSoftwareRequestEmbed(
  reqType: string,
  gameLink: string,
  user: User,
  title: string,
  version: string,
  platform: string,
  comment: string,
  description?: string
): EmbedBuilder {

  const formattedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();
  const embedBuilder = new EmbedBuilder()
    .setTitle(title)
    .setURL(gameLink)
    .addFields(
      {
        name: "**Desired Version**",
        value: version,
      },
      {
        name: "**Platform**",
        value: formattedPlatform,
      },
      {
        name: "**Comments**",
        value: comment,
      },
      {
        name: "**Request Type**",
        value: reqType,
      },
      {
        name: "**Request Status**",
        value: "Unknown",
      }
    )
    .setTimestamp()
    .setFooter({text: `Requested by ${user.tag}`});

  if (description) {
    embedBuilder.setDescription(description);
  }

  return embedBuilder;
}

export function createNonEpicSteamRequestEmbed(
  reqType: string,
  gameLink: string,
  user: User,
  title: string,
  version: string,
  comment: string,
  description?: string
): EmbedBuilder {
  const embedBuilder = new EmbedBuilder()
    .setTitle(title)
    .setURL(gameLink)
    .addFields(
      {
        name: "**Desired Version**",
        value: version,
      },
      {
        name: "**Comments**",
        value: comment,
      },
      {
        name: "**Request Type**",
        value: reqType,
      },
      {
        name: "**Request Status**",
        value: "Unknown",
      }
    )
    .setTimestamp()
    .setFooter({text: `Requested by ${user.tag}`});

  if (description) {
    embedBuilder.setDescription(description);
  }

  return embedBuilder;
}