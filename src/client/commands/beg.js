const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'beg',
  data: new SlashCommandBuilder()
    .setName('beg')
		.setDescription('I need money'),
  async execute(interaction, Discord, db, s, ms, commafy) {
    let user = interaction.user
    let isVip = db.get(`${user.id}.vip`)
    let begCooldown = 10000;
    if(isVip === true) {
      begCooldown = 5000
    }
    let lastbeg = db.get(`${user.id}.cooldowns`)
    if(!lastbeg) {
      lastbeg = { beg: null }
    }
    if (lastbeg.beg !== null && begCooldown - (Date.now() - lastbeg.beg) > 0) {
      let timeleft = ms(begCooldown - (Date.now() - lastbeg.beg));
      let embed = new Discord.MessageEmbed()
      .setTitle(`No...`)
      .setDescription(`Money is great, but spam is not. You have to wait more **${timeleft}** to use this command again!\nThe default cooldown is set to \`10s\`, but VIPs get to wait only \`5s\`.`)
      .setColor("RED")
      await interaction.reply({ embeds: [embed] })
    } else {
      let random = Math.floor(Math.random() * 1000);
      let all = ["Your Mom", "Business Man", "Jake Paul", "Pewdiepie", "Mr Beast", "Boogie Man", "Moist Cr1tikal", "Will Smith", "Drug Dealer", "Pharmacist", "Jesus Christ", "Cristiano Ronaldo", "Messi", "Kim Kardashian", "Tom Holland", "What da dog doin"]
      let neg = ["Ew, poor person.", "No.", "I already gave money to the last begger, sorry", "Get a job!", "I'm cancelling you on twitter instead"];
      let pos = [`Oh no! take these **${commafy(random)}** ${s}`, `Ok, here is **${commafy(random)}** ${s}`, `Aren't you that famous youtuber? Oh my god, take my money **${commafy(random)}** ${s}`, `Just robbed these from another homeless guy, here **${commafy(random)}** ${s}`, `Pff, take these **${commafy(random)}** ${s}, it's just pocket money for someone like me`, `Well, because you were so polite, take these **${commafy(random)}** ${s} as a reward`];
      let randomChosen = all[Math.floor(Math.random() * all.length)];
      let randomNeg = neg[Math.floor(Math.random() * neg.length)]
      let randomPos = pos[Math.floor(Math.random() * pos.length)]
      let ispos = Math.floor(Math.random() * 100);
      let des = randomPos
      let color = "GREEN"
      if(ispos < 30) {
        des = randomNeg
        color = "RED"
      }
      if(des === randomPos) {
        db.add(`${user.id}.money`, random)
      }
      let embed = new Discord.MessageEmbed()
      .setTitle(`${randomChosen}`)
      .setDescription(`${des}`)
      .setColor(color)
      .setFooter({ text: "Bruh" })
      await interaction.reply({ embeds: [embed] })
      db.set(`${user.id}.cooldowns.beg`, Date.now())
    }
  },
  async exe(message, Discord, db, s, ms, commafy) {
    let user = message.author
    let isVip = db.get(`${user.id}.vip`)
    let begCooldown = 10000;
    if(isVip === true) {
      begCooldown = 5000
    }
    let lastbeg = db.get(`${user.id}.cooldowns`)
    if(!lastbeg) {
      lastbeg = { beg: null }
    }
    if (lastbeg.beg !== null && begCooldown - (Date.now() - lastbeg.beg) > 0) {
      let timeleft = ms(begCooldown - (Date.now() - lastbeg.beg));
      let embed = new Discord.MessageEmbed()
      .setTitle(`No...`)
      .setDescription(`Money is great, but spam is not. You have to wait more **${timeleft}** to use this command again!\nThe default cooldown is set to \`10s\`, but VIPs get to wait only \`5s\`.`)
      .setColor("RED")
      await message.reply({ embeds: [embed] })
    } else {
      let random = Math.floor(Math.random() * 1000);
      let all = ["Your Mom", "Business Man", "Jake Paul", "Pewdiepie", "Mr Beast", "Boogie Man", "Moist Cr1tikal", "Will Smith", "Drug Dealer", "Pharmacist", "Jesus Christ", "Cristiano Ronaldo", "Messi", "Kim Kardashian", "Tom Holland", "What da dog doin"]
      let neg = ["Ew, poor person.", "No.", "I already gave money to the last begger, sorry", "Get a job!", "I'm cancelling you on twitter instead"];
      let pos = [`Oh no! take these **${commafy(random)}** ${s}`, `Ok, here is **${commafy(random)}** ${s}`, `Aren't you that famous youtuber? Oh my god, take my money **${commafy(random)}** ${s}`, `Just robbed these from another homeless guy, here **${commafy(random)}** ${s}`, `Pff, take these **${commafy(random)}** ${s}, it's just pocket money for someone like me`, `Well, because you were so polite, take these **${commafy(random)}** ${s} as a reward`];
      let randomChosen = all[Math.floor(Math.random() * all.length)];
      let randomNeg = neg[Math.floor(Math.random() * neg.length)]
      let randomPos = pos[Math.floor(Math.random() * pos.length)]
      let ispos = Math.floor(Math.random() * 100);
      let des = randomPos
      let color = "GREEN"
      if(ispos < 30) {
        des = randomNeg
        color = "RED"
      }
      if(des === randomPos) {
        db.add(`${user.id}.money`, random)
      }
      let embed = new Discord.MessageEmbed()
      .setTitle(`${randomChosen}`)
      .setDescription(`${des}`)
      .setColor(color)
      .setFooter({ text: "Bruh" })
      await message.reply({ embeds: [embed] })
      db.set(`${user.id}.cooldowns.beg`, Date.now())
    }
  }
}