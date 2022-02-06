const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'leaderboard',
  data: new SlashCommandBuilder()
    .setName('leaderboard')
		.setDescription('Check the leaderboard for richest users on oki!'),
  async execute(interaction, client, Discord, db, s, commafy) {
    let all = []
    let author = interaction.user
    client.users.cache.forEach(user => {
      all.push({
        username: user.tag,
        id: user.id
      })
    })

    let info = [];
    for(let i = 0; i < all.length; i++) {
      let user = all[i];
      let money = db.get(`${user.id}.money`)
      if(!money || money === null || money === 0) continue;

      info.push({
        user: user,
        money: money
      })
    }

    info.sort((a, b) => b.money - a.money)
    let lb = [];
    let userHighlight = ''
    let mem = 0
    for(let j = 0; j < info.length; j++) {
      mem++
      if(mem >= 10) continue;
      let inf = info[j];
      let emoji = '🔹'
      let sufix = 'th'
      if(j === 0) {
        emoji = '🥇'
        sufix = 'st'
      } else if(j === 1) {
        emoji = ':second_place:'
        sufix = 'nd'
      } else if(j === 2) {
        emoji = ':third_place:'
        sufix = 'rd'
      }
      if(inf.user.id === author.id) {
        userHighlight = `You are on **${j + 1}${sufix} place**`
      }
      lb.push(`${emoji} **${inf.user.username}** - \`${commafy(inf.money)}\` ${s}`)
    }

    let embed = new Discord.MessageEmbed()
    .setTitle(`Top 10 Richest Users`)
    .setDescription(userHighlight + '\n\n' + lb.join('\n'))
    .setColor("GREEN")
    await interaction.reply({ embeds: [embed] })
  },
  async exe(message, client, Discord, db, s, commafy) {
    let all = []
    let author = message.author
    client.users.cache.forEach(user => {
      all.push({
        username: user.tag,
        id: user.id
      })
    })

    let info = [];
    for(let i = 0; i < all.length; i++) {
      let user = all[i];
      let money = db.get(`${user.id}.money`)
      if(!money || money === null || money === 0) continue;

      info.push({
        user: user,
        money: money
      })
    }

    info.sort((a, b) => b.money - a.money)
    let lb = [];
    let userHighlight = ''
    let mem = 0
    for(let j = 0; j < info.length; j++) {
      mem++
      if(mem >= 10) continue;
      let inf = info[j];
      let emoji = '🔹'
      let sufix = 'th'
      if(j === 0) {
        emoji = '🥇'
        sufix = 'st'
      } else if(j === 1) {
        emoji = ':second_place:'
        sufix = 'nd'
      } else if(j === 2) {
        emoji = ':third_place:'
        sufix = 'rd'
      }
      if(inf.user.id === author.id) {
        userHighlight = `You are on **${j + 1}${sufix} place**`
      }
      lb.push(`${emoji} **${inf.user.username}** - \`${commafy(inf.money)}\` ${s}`)
    }

    let embed = new Discord.MessageEmbed()
    .setTitle(`Top 10 Richest Users`)
    .setDescription(userHighlight + '\n\n' + lb.join('\n'))
    .setColor("GREEN")
    await message.reply({ embeds: [embed] })
  }
}