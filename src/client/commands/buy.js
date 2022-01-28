const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'buy',
  data: new SlashCommandBuilder()
    .setName('buy')
		.setDescription('Buy a specific item'),
  async execute(interaction, Discord, db, s) {
  },
  async exe(message, Discord, db, s) {
  }
}