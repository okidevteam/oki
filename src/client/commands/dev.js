const { SlashCommandBuilder } = require('@discordjs/builders');

function changeAmount(amount) {
  let transformto = amount
  let multiplyby = 1
  if(amount.toLowerCase().includes('k')) {
    transformto = amount.toLowerCase().split('k');
    multiplyby = 1000
  }
  if(amount.toLowerCase().includes('m')) {
    transformto = amount.toLowerCase().split('m');
    multiplyby = 1000000
  }
  if(amount.toLowerCase().includes('b')) {
    transformto = amount.toLowerCase().split('b');
    multiplyby = 1000000000
  }
  if(amount.toLowerCase().includes('t')) {
    transformto = amount.toLowerCase().split('t');
    multiplyby = 1000000000000
  }
  if(typeof transformto === 'object') {
    let a = new Function(`return ${transformto[0]} * ${multiplyby}`)()
    return a
  } else {
    return amount
  }
}

module.exports = {
  name: 'dev',
  async exe(message, args, Discord, db, s, commafy) {
    let user = message.author
    let isdev = db.get(`${user.id}.dev`)
    if(isdev === true) {
      if(!args[0]) {
        await message.reply("Invalid Syntax! Please make sure you enter a subcommand, like: \`oki <dev> <subcommand>\`")
      } else {
        switch(args[0].toLowerCase()) {
          case 'add':
            let to = message.mentions.users.first();
            if(!args[1]) {
              await message.reply("Invalid Syntax! Please make sure the command looks like \`oki <dev> add <quantity> <userMention(optional)>\`")
            } else {
              if(!to) {
                to = user
              }
              let amount = changeAmount(args[1])
              let embed = new Discord.MessageEmbed()
              .setTitle(`Added \`${commafy(amount)}\` ${s} to **${to.username}**'s Wallet!`)
              .setColor("GREEN")
              await message.reply({ embeds: [embed] })
              db.add(`${to.id}.money`, amount)
            }
            break;
          case 'subtract':
            let To = message.mentions.users.first();
            if(!args[1]) {
              await message.reply("Invalid Syntax! Please make sure the command looks like \`oki <dev> subtract <quantity> <userMention(optional)>\`")
            } else {
              if(!To) {
                To = user
              }
              let amount = changeAmount(args[1])
              let embed = new Discord.MessageEmbed()
              .setTitle(`Subtracted \`${commafy(amount)}\` ${s} from **${To.username}**'s Wallet!`)
              .setColor("ORANGE")
              await message.reply({ embeds: [embed] })
              db.subtract(`${To.id}.money`, amount)
            }
            break;
          default:
            return;
        }
      }
    } else {
      return
    }
  }
}