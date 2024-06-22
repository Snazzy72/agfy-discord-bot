import {
  ActionRowBuilder,
  ButtonInteraction,
  CacheType,
  Interaction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {getDeniedReasonModal} from "../submit/requests/brokenLink/brokenLinkModalSubmit";

export async function handleDenyRequestModal(interaction: ButtonInteraction<CacheType>): Promise<string> {
  const deniedReasonModal = new ModalBuilder().setCustomId("denied-reason-modal").setTitle("Reason");

  const deniedReason = new TextInputBuilder()
    .setCustomId("denied-reason")
    .setLabel("Reason for denying request")
    .setPlaceholder("No link found / version not available")
    .setMinLength(1)
    .setMaxLength(200)
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph);

  const deniedReasonActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(deniedReason);

  deniedReasonModal.addComponents(deniedReasonActionRow);

  await interaction.showModal(deniedReasonModal);

  return new Promise<string>((resolve) => {
    interaction.client.once("interactionCreate", async (interaction: Interaction) => {
      if (interaction.isModalSubmit()) {
        switch (interaction.customId) {
          case "denied-reason-modal":
            const reason = await getDeniedReasonModal(interaction);
            await interaction.deferUpdate();
            resolve(reason);
        }
      }
    });
  });
}
