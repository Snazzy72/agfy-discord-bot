import { EmbedBuilder } from "discord.js";

export function initEmbed(): EmbedBuilder {
  return (
    new EmbedBuilder()
      .setTitle(":star2: **New Request System!** :star2:")
      .setDescription(
        "Make use of the below buttons to make requests! Requests will be processed by admins once they get time, so keep an eye on the request status!\nRequests are **not** necassarily processed in order of them being sent.\n"
      )
      .addFields(
        {
          name: "DM's",
          value: `React with :bell: on your request to receive a DM notification when the status of your request changes. Make sure your DMs are enabled to stay updated.\n`,
        },
        {
          name: "Guidelines",
          value: `1. Requirements have been added to avoid misusing the system.
2. Abuse of the system will lead to blacklisting.
3. Feedback welcome.`,
        }
      )
      .setColor("#3498DB")
      //.setThumbnail("https://gamesforyou.co/wp-content/uploads/2023/07/newalgfylogo.png")
      .setFooter({
        text: "gamesforyou.co",
        iconURL: "https://pbs.twimg.com/profile_images/1068690955975475200/SBUkTmyi_400x400.jpg",
      })
  );
}
