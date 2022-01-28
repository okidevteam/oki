const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'shop',
  data: new SlashCommandBuilder()
    .setName('shop')
		.setDescription('Check what\'s up on the store or get info about a specific item (sellable or not)')
    .addStringOption(option => 
    option.setName('item')
      .setDescription('Show info about a specific item (no spaces, but it\'s not case sensitive)')
      .setRequired(false)),
  async execute(interaction, Discord, db, s, client, commafy) {
    let itema = interaction.options.get('item')
    if(!itema) {
      let embed = new Discord.MessageEmbed()
      .setTitle(`Shop!`)
      await interaction.reply({ embeds: [embed] })
    } else {
      itema = `${itema.value}`.split(' ').join('').toLowerCase()
      let item = null
      switch(itema) {
        case 'cookie':
          item = client.items.get("cookie")
          break;
        case 'cube':
        case "rubik'scube":
        case "rubikcube":
        case "rubikscube":
        case "magiccube":
        case "rubiks":
        case "rubik's":
          item = client.items.get("cube")
          break;
        case "smiley":
        case "face":
        case "smileyface":
          item = client.items.get("smileyface")
          break;
        default:
          await interaction.reply("This item does not exist!");
          break;
      }
      if(item !== null) {
        if(item.sell === 0) {
          item.sell = 'Not Sellable'
        }
        if(item.buy === 0) {
          item.buy = 'Not Buyable'
        }
        if(item.trade === 0) {
          item.trade = 'Not Tradable'
        }
        let inv = db.get(`${interaction.user.id}.inv`)
        let owned = 0
        if(!inv) {
          owned = 0
        } else {
          owned = inv[itema.toLowerCase()] || 0;
        }
        let tradevalue = [];
        item.trade.forEach(value => {
          tradevalue.push(commafy(value))
        })
        let itemembed = new Discord.MessageEmbed()
        .setTitle(`${item.name} (${owned} owned) ${item.emoji}`)
        .setDescription(`${item.description}`)
        .addFields(
          { name: 'Purchase Price', value: `\`${commafy(item.buy)}\``, inline: true },
          { name: 'Sell Price', value: `\`${commafy(item.sell)}\``, inline: true },
          { name: 'Trading Price', value: `\`${tradevalue.join(' - ')}\``, inline: true },
        )
        .addFields(
          { name: 'Rarity', value: `\`${item.rarity}\``, inline: true },
          { name: 'Type', value: `\`${item.type}\``, inline: true },
        )
        .setColor(item.color)
        .setThumbnail(item.thumb)
        await interaction.reply({ embeds: [itemembed] })
      }
    }
  },
  async exe(message, args, Discord, db, s, client, commafy) {
    let itema = args.slice(0).join('').toLowerCase()
    let embed = new Discord.MessageEmbed()
    .setTitle(`Shop!`)
    if(!itema) {
      await message.channel.send({ embeds: [embed] })
    } else {
      let item = null
      switch(itema) {
        case 'cookie':
          item = client.items.get("cookie")
          break;
        case 'cube':
        case "rubik'scube":
        case "rubikcube":
        case "rubikscube":
        case "magiccube":
        case "rubiks":
        case "rubik's":
          item = client.items.get("cube")
          break;
        case "smiley":
        case "face":
        case "smileyface":
          item = client.items.get("smileyface")
          break;
        default:
          await message.reply("This item does not exist!");
          break;
      }
      if(item !== null) {
        if(item.sell === 0) {
          item.sell = 'Not Sellable'
        }
        if(item.buy === 0) {
          item.buy = 'Not Buyable'
        }
        if(item.trade === 0) {
          item.trade = 'Not Tradable'
        }
        let inv = db.get(`${message.author.id}.inv`)
        let owned = 0
        if(!inv) {
          owned = 0
        } else {
          owned = inv[itema.toLowerCase()] || 0;
        }
        let tradevalue = [];
        item.trade.forEach(value => {
          tradevalue.push(commafy(value))
        })
        let itemembed = new Discord.MessageEmbed()
        .setTitle(`${item.name} (${owned} owned) ${item.emoji}`)
        .setDescription(`${item.description}`)
        .addFields(
          { name: 'Purchase Price', value: `\`${commafy(item.buy)}\``, inline: true },
          { name: 'Sell Price', value: `\`${commafy(item.sell)}\``, inline: true },
          { name: 'Trading Price', value: `\`${tradevalue.join(' - ')}\``, inline: true },
        )
        .addFields(
          { name: 'Rarity', value: `\`${item.rarity}\``, inline: true },
          { name: 'Type', value: `\`${item.type}\``, inline: true },
        )
        .setColor(item.color)
        .setThumbnail(item.thumb)
        await message.channel.send({ embeds: [itemembed] })
      }
    }
  }
}