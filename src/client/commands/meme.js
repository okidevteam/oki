const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'meme',
  data: new SlashCommandBuilder()
    .setName('meme')
		.setDescription('look, a meme!'),
  async execute(interaction, Discord, fetch) {
    try {
      let subreddits = ["r/memes", "r/funny", "r/cursedcomments", "r/surrealmemes", "r/cursedmemes"]
      let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)]
      const url = await fetch(`https://www.reddit.com/${subreddit}/random/.json`);
      const random = await url.json();
      const embed = new Discord.MessageEmbed()
      .setTitle(`${random[0].data.children[0].data.title}`)
      .setURL("https://reddit.com" + random[0].data.children[0].data.permalink)
      .setImage(random[0].data.children[0].data.url)
      .setColor("ORANGE")
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  },
  async exe(message , Discord, fetch) {
    try {
      let subreddits = ["r/memes", "r/funny", "r/cursedcomments", "r/surrealmemes", "r/cursedmemes"]
      let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)]
      const url = await fetch(`https://www.reddit.com/${subreddit}/random/.json`);
      const random = await url.json();
      const embed = new Discord.MessageEmbed()
      .setTitle(`${random[0].data.children[0].data.title}`)
      .setURL("https://reddit.com" + random[0].data.children[0].data.permalink)
      .setImage(random[0].data.children[0].data.url)
      .setColor("ORANGE")
      await message.reply({ embeds: [embed] });

    } catch (err) {
      console.log(err);
    }
  }
}