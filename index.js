/* Packages */
const express = require("express")
const Discord = require("discord.js")
const chalk = require("chalk")
const fs = require("fs")
const ywfts = require("ywfts.js")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ms = require("ms")
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
  res.send('https://okidevteam.github.io/oki')
})

app.get("*", (req, res) => {
  res.send('Not Found.')
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
  let str = num.toString().split('.');
  if(str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if(str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
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
    case 'help':
      await client.commands.get('help').exe(message, Discord)
      break;
    case 'inv':
    case 'inventory':
      await client.commands.get('inv').exe(message, Discord, db, client, commafy)
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

client.login(token)