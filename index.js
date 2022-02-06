/* Packages */
const express = require("express")
const Discord = require("discord.js")
const chalk = require("chalk")
const fs = require("fs")
const ywfts = require("ywfts.js")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ms = require("ms")
const moment = require("moment")
const fetch = require("node-fetch");
const app = express()
const all = new Discord.Intents(32767)
const client = new Discord.Client({ intents: all })
client.commands = new Discord.Collection()
client.items = new Discord.Collection()
const commandArray = []
const commands = fs.readdirSync('./src/client/commands').filter(file => file.endsWith('.js'))
const items = fs.readdirSync('./src/client/items').filter(file => file.endsWith('.json'))
const token = process.env.token
const rest = new REST({ version: '9' }).setToken(token);
const now = Date.now()
const db = new ywfts.Database()
const s = '❖'

/* app */
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/src/app/index.html')
})

app.get("/file", (req, res) => {
  if(req.query.f.includes('data')) {
    res.send("No, lmao")
  } else {
    res.sendFile(__dirname + '/' + req.query.f)
  }
})

app.get("/invite", (req, res) => {
  res.redirect('https://dsc.gg/oki')
})

app.use("/api/*", (req, res) => {
  if(!req.headers.auth || !process.env.auth.includes(req.headers.auth)) {
    res.status(200).send({ error: "You can't access the api without the proper authorization token provided by the oki developer team. If you believe this is an error and your token is not revoked / is valid, please contact another members of the developer team to discuss about your token. The api is not public, but this could change in the future. For now, you need official auth tokens because we can't just let people with malicious intents have access to our api." })
  }
})

app.get("*", (req, res) => {
  res.send('Not Found.')
})

app.get("/api/g/user", (req, res) => {
  if(!req.query.u || !req.query.k) {
    return res.status(200).send({ error: "Please provide the correct query parameters. Per example: /api/g/user?u=861376659597164545&k=money" })
  } else {
    return res.status(200).send(db.get(`${req.query.u}.${req.query.k}`))
  }
})

app.post("/api/p/user", (req, res) => {
  if(!req.query.u || !req.query.k || !req.query.v) {
    return res.status(200).send({ error: "Please provide the correct query parameters. Per example: /api/g/user?u=861376659597164545&k=money&v=69" })
  } else {
    return res.status(200).send(db.set(`${req.query.u}.${req.query.k}`, req.query.v))
  }
})

app.listen(3000)

/* client */
for(let command of commands) {
  command = require(`./src/client/commands/${command}`)
  if(!command.data) {
    client.commands.set(command.name, command);
  } else {
    client.commands.set(command.name, command)
	  commandArray.push(command.data.toJSON());
  }
}

(async () => {
  console.clear()
	try {
    let time = Date.now()
		console.log(chalk.hex('#faff6b').bold('Started refreshing application (/) commands.'));

    await rest.put(Routes.applicationCommands('933437643281289246'), { body: commandArray });

		console.log(chalk.hex('#59ff96').bold(`Successfully reloaded application (/) commands. (${Date.now() - time}ms)`));
	} catch (error) {
		console.error(chalk.red.bold(error));
	}
})()

function commafy(num) {
  return num.toLocaleString();
}

client.on('interactionCreate', async interaction => {
	if(interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      switch(interaction.commandName) {
        case 'balance':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, db, s, commafy)
            break;
          }

        case 'beg':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, db, s, ms)
            break;
          }

        case 'buy':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, db, s, client, commafy)
            break;
          }

        case 'daily':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, db, s, commafy)
            break;
          }

        case 'help':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord)
            break;
          }

        case 'inv':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, db, s, client, commafy)
            break;
          }
          
        case 'leaderboard':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, client, Discord, db, s, commafy)
            break;
          }
          
        case 'meme':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, fetch)
            break;
          }

        case 'shop':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, db, s, client, commafy)
            break;
          }

        case 'work':
          if(interaction.replied || interaction.deferred) {
            return;
          } else {
            await command.execute(interaction, Discord, db, s, commafy, ms)
            break;
          }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command! \n' + error, ephemeral: true });
    }
  } else {
    return;
  }
});

client.on("messageCreate", async message => {
  let args = message.content.slice(4).trim().split(/ +/g);
  let command = args.shift().toLowerCase()
  if(!message.content.toLowerCase().startsWith("oki")) return;
  switch(command) {
    case 'bal':
    case 'balance':
      await client.commands.get('balance').exe(message, Discord, db, s, commafy)
      break;
    case 'beg':
      await client.commands.get('beg').exe(message, Discord, db, s, ms, commafy)
      break;
    case 'buy':
      await client.commands.get('buy').exe(message, args, Discord, db, s, client)
      break;
    case 'daily':
      await client.commands.get('daily').exe(message, Discord, db, s, commafy)
      break;
    case 'd':
    case 'dev':
    case 'developer':
      await client.commands.get('dev').exe(message, args, Discord, db, s, commafy)
      break;
    case 'help':
      await client.commands.get('help').exe(message, Discord)
      break;
    case 'inv':
    case 'inventory':
      await client.commands.get('inv').exe(message, Discord, db, client, commafy)
      break;
    case 'lb':
    case 'leaderboard':
      await client.commands.get('leaderboard').exe(message, client, Discord, db, s, commafy)
      break;
    case 'meme':
      await client.commands.get('meme').exe(message, Discord, fetch)
      break;
    case 'shop':
      await client.commands.get('shop').exe(message, args, Discord, db, s, client, commafy)
      break;
    case 'work':
      await client.commands.get('work').exe(message, args, Discord, db, s, commafy, ms)
      break;
    default:
      return;
  }
})

client.on("ready", () => {
  let now1 = Date.now()
  let rundelay = Math.floor(now1 - now)
  console.log(chalk.hex("#75c6ff").bold("Ready, took " + rundelay + "ms to login! \nCommands - " + commands.length))
  setInterval(function() {
    for(let item of items) {
      item = require(`./src/client/items/${item}`)
      client.items.set(item.name, item)
    }
  }, 2000)
})

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (oldMember.premiumSince !== newMember.premiumSince) {
    if(newMember.guild.id === '937009105980252170') {
      let user = newMember.user.id;
      db.set(`${user}.vip`, true)
      db.add(`${user}.money`, 500000)
      let inv = db.get(`${user}.inv`)
      if(!inv) {
        db.set(`${user}.inv.premiumpackage`, 1)
      } else {
        db.add(`${user}.inv.premiumpackage`, 1)
      }
      let embed = new Discord.MessageEmbed()
      .setTitle(`New Boost! <:pepe_cool:928992768842407966>`)
      .setColor("PURPLE")
      .setDescription(`**${newMember.user.tag}** boosted our server, so as a reward they got \`500,000\` ${s}, **Vip** and 1 **Premium Package**. For more information, send \`oki help support\`. Thank you so much for your support and hope you like the perks!`)
      .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "This is awesome" })
      await client.channels.cache.get('937009106475155478').send({content: `<@${user}>`, embeds: [embed]})
    } else {
      return;
    }
  }
});

client.login(token)

setInterval(function() {
  if(moment().format('HH:mm:ss') === "00:00:00") {
    client.users.cache.forEach(user => {
      db.set(`${user.id}.daily`, "false")
    })
  }
}, 1000)