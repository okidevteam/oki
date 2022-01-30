const { SlashCommandBuilder } = require('@discordjs/builders');
let reply = '<:Reply:936621718900973650>'
let replyand = '<:ReplyAnd:936621719072964648>'

function createEmbed(Discord, message) {
  let homeEmbed = new Discord.MessageEmbed()
  .setTitle(`Need further help? Click me!`)
  .setURL('https://discord.gg/XErKhtJpKU')
  .setDescription(`Here is a resumed list of all commands on \`oki\`! All commands are done like the following \`oki <command>\`. \`WWS\` means \`Works With Slash\`, which means that there is a slash version for that command too. Also OWS means \`Only With Slash\`, which means that the only version for that command is available with slash commands.

  **__Economy__**
  ${replyand} \`bal\` (**WWS**) ─ Checks yours or other person's balance.
  ${replyand} \`beg\` (**WWS**) ─ Beg for money
  ${replyand} \`buy\` (**WWS, Not Working!**) ─ Buy an item from the shop
  ${replyand} \`daily\` (**WWS**) ─ Get a daily reward
  ${replyand} \`inv\` (**WWS**) ─ Check your or someone else's inventory and see their items.
  ${replyand} \`shop\` (**WWS**) ─ See the items for sell or check info about a specific item.
  ${reply} \`work\` (**Working but still on experimental phase**) ─ Work to get some money!
  `)
  message.reply({ embeds: [homeEmbed] })
}

module.exports = {
  name: 'help',
  data: new SlashCommandBuilder()
    .setName('help')
		.setDescription('Get some help'),
  async execute(interaction, Discord) {
    await createEmbed(Discord, interaction)
  },
  async exe(message, Discord) {
    await createEmbed(Discord, message)
  }
}