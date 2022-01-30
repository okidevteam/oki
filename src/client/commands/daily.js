const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'daily',
  data: new SlashCommandBuilder()
    .setName('daily')
		.setDescription('Get a daily reward!'),
  async execute(interaction, Discord, db, s, commafy) {
    let user = interaction.user
    let candaily = db.get(`${user.id}.daily`)
    if(!candaily || candaily === "false") {
      let reward = 25000;
      let bonus = db.get(`${user.id}.streaks`)
      let streak = 0
      if(!bonus) {
        bonus = 0
        db.set(`${user.id}.streaks.daily`, 1)
      } else {
        streak = bonus.daily
        if(!streak) {
          streak = 0
        }
        bonus = Math.floor(streak * 500)
        db.add(`${user.id}.streaks.daily`, 1)
      }
      reward += bonus
      let embed = new Discord.MessageEmbed()
      .setDescription(`Thanks for using our bot daily, as a reward, here is \`${commafy(reward)}\` ${s}!\n\nFor now you can't vote for \`oki\` because it is not public, but once it is, the links for it will be added, so you can vote and get awesome rewards from it!\n\nDon't forget to join our community for the best updates, chat and memes sometimes.`)
      .setTitle('Daily Reward')
      .setURL('https://discord.gg/XErKhtJpKU')
      .setFooter({ text: `Streak: ${streak} | Streak reward: ${s} ${commafy(bonus)}` })
      await interaction.reply({ embeds: [embed] })
      db.add(`${user.id}.money`, reward)
      db.set(`${user.id}.daily`, true)
    } else {
      let embed = new Discord.MessageEmbed()
      .setDescription(`Daily resets at \`00:00\` UTC`)
      .setTitle('No...')
      .setColor("RED")
      await interaction.reply({ embeds: [embed] })
    }
  },
  async exe(message, Discord, db, s, commafy) {
    let user = message.author
    let candaily = db.get(`${user.id}.daily`)
    if(!candaily || candaily === "false") {
      let reward = 25000;
      let bonus = db.get(`${user.id}.streaks`)
      let streak = 0
      if(!bonus) {
        bonus = 0
        db.set(`${user.id}.streaks.daily`, 1)
      } else {
        streak = bonus.daily
        if(!streak) {
          streak = 0
        }
        bonus = Math.floor(streak * 500)
        db.add(`${user.id}.streaks.daily`, 1)
      }
      reward += bonus
      let embed = new Discord.MessageEmbed()
      .setDescription(`Thanks for using our bot daily, as a reward, here is \`${commafy(reward)}\` ${s}!\n\nFor now you can't vote for \`oki\` because it is not public, but once it is, the links for it will be added, so you can vote and get awesome rewards from it!\n\nDon't forget to join our community for the best updates, chat and memes sometimes.`)
      .setTitle('Daily Reward')
      .setURL('https://discord.gg/XErKhtJpKU')
      .setFooter({ text: `Streak: ${streak} | Streak reward: ${s} ${commafy(bonus)}` })
      await message.reply({ embeds: [embed] })
      db.add(`${user.id}.money`, reward)
      db.set(`${user.id}.daily`, true)
    } else {
      let embed = new Discord.MessageEmbed()
      .setDescription(`Daily resets at \`00:00\` UTC`)
      .setTitle('No...')
      .setColor("RED")
      await message.reply({ embeds: [embed] })
    }
  }
}