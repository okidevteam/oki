const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'balance',
  data: new SlashCommandBuilder()
    .setName('balance')
		.setDescription('Check Someone\'s balance!')
    .addUserOption(option => 
    option.setName('user')
      .setDescription('Optional')
      .setRequired(false)),
  async execute(interaction, Discord, db, s, commafy) {
    let user = interaction.options.get("user")
    if(!user) {
      user = interaction.user
    } else {
      user = user.user
    }
    let money = db.get(`${user.id}.money`)
    let bank = db.get(`${user.id}.bank`)
    let color = db.get(`${user.id}.color`)
    if(!color) {
      color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      db.set(`${user.id}.color`, color)
    }
    if(!money) money = 0;
    if(!bank) bank = 0;
    let embed = new Discord.MessageEmbed()
    .setTitle(`${user.username}'s Balance`)
    .setColor(color)
    .setDescription(`Wallet - ${s} \`${commafy(money)}\` \nBank - ${s} \`${commafy(bank)}\``)
    await interaction.reply({ embeds: [embed] })
  },
  async exe(message, Discord, db, s, commafy) {
    let user = message.mentions.users.first()
    if(!user) {
      user = message.author
    }
    let money = db.get(`${user.id}.money`)
    let bank = db.get(`${user.id}.bank`)
    let color = db.get(`${user.id}.color`)
    if(!color) {
      color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      db.set(`${user.id}.color`, color)
    }
    if(!money) money = 0;
    if(!bank) bank = 0;
    let embed = new Discord.MessageEmbed()
    .setTitle(`${user.username}'s Balance`)
    .setColor(color)
    .setDescription(`Wallet - ${s} \`${commafy(money)}\` \nBank - ${s} \`${commafy(bank)}\``)
    await message.reply({ embeds: [embed] })
  }
}