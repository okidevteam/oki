const { SlashCommandBuilder } = require('@discordjs/builders');

function checkItemsInv(client, inv, commafy) {
  let allInv = [];
  if(inv.cookie > 0) {
    let item = client.items.get('cookie')
    allInv.push(`${item.emoji} Cookies ─ \`\`${commafy(inv.cookie)}\`\`\nType ─ _${item.type}_`)
  }
  if(inv.cube > 0) {
    let item = client.items.get('cube')
    allInv.push(`${item.emoji} Cubes ─ \`\`${commafy(inv.cube)}\`\`\nType ─ _${item.type}_`)
  }
  if(inv.smileyface > 0) {
    let item = client.items.get('smileyface')
    allInv.push(`${item.emoji} SmileyFaces ─ \`\`${commafy(inv.cube)}\`\`\nType ─ _${item.type}_`)
  }
  if(allInv.length === 0) {
    allInv = ["This user has no items, LMAO!"]
  }
  return allInv;
}

module.exports = {
  name: 'inv',
  data: new SlashCommandBuilder()
    .setName('inv')
		.setDescription('check your, or someone else\'s inventory.')
    .addUserOption(option =>
      option.setName('user')
      .setDescription("Instead of yours, choose someone else's inventory to see!")
      .setRequired(false)
    ),
  async execute(interaction, Discord, db, s, client, commafy) {
    let user = interaction.options.get('user')
    if(!user) {
      user = interaction.user;
    } else {
      user = user.user
    }
    let inv = db.get(`${user.id}.inv`);
    let color = db.get(`${user.id}.color`)
    if(!color) {
      color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      db.set(`${user.id}.color`, color, commafy)
    }
    let allInv = [];
    if(!inv) {
      allInv = ["This user has no items, LMAO!"]
    } else {
      allInv = checkItemsInv(client, inv)
    }
    let embed = new Discord.MessageEmbed()
    .setTitle(`${user.username}'s Inventory`)
    .setDescription(`${allInv.join('\n\n')}`)
    .setColor(color)
    await interaction.reply({ embeds: [embed] })
  },
  async exe(message, Discord, db, client, commafy) {
    let user = message.mentions.users.first()
    if(!user) user = message.author;
    let inv = db.get(`${user.id}.inv`);
    let color = db.get(`${user.id}.color`)
    if(!color) {
      color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      db.set(`${user.id}.color`, color)
    }
    let allInv = [];
    if(!inv) {
      allInv = ["This user has no items, LMAO!"]
    } else {
      allInv = checkItemsInv(client, inv, commafy)
    }
    let embed = new Discord.MessageEmbed()
    .setTitle(`${user.username}'s Inventory`)
    .setDescription(`${allInv.join('\n\n')}`)
    .setColor(color)
    await message.channel.send({ embeds: [embed] })
  }
}