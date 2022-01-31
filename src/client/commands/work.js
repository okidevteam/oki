const { SlashCommandBuilder } = require('@discordjs/builders');
const worklist = require("../work/worklist.json").works;

function minigame(user, message, db, Discord, s, commafy) {
  const minigametype = Math.floor(Math.random() * 5) + 1;
  const workname = db.get(`${user.id}.work.name`)
  const minigames = require("../work/minigames.json")
  const salary = db.get(`${user.id}.work.salary`)
  db.set(`${user.id}.cooldowns.work`, Date.now())
  switch(minigametype) {
    case 1:
      /* GTN */
      const number = Math.floor(Math.random() * 100) + 1;
      const correct = Math.floor(Math.random() * 100) + 1;
      let row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setCustomId('higher')
        .setLabel('Higher')
        .setStyle('PRIMARY')
        .setDisabled(false),
        new Discord.MessageButton()
        .setCustomId('same')
        .setLabel('Same')
        .setStyle('PRIMARY')
        .setDisabled(false),
        new Discord.MessageButton()
        .setCustomId('lower')
        .setLabel('Lower')
        .setStyle('PRIMARY')
        .setDisabled(false)
      )
      message.reply(`Your number will be **${number}**. Pay close attention though because you will have to guess, if either the number chosen by the bot is higher, the same or lower.`).then(message => {
        setTimeout(function() {
          message.edit({ content: "Higher, same or lower?",  components: [row], ephemeral: true })
          const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 10000 });

          collector.on('collect', i => {
            if(i.user.id === user.id) {
              if(i.customId === 'higher') {
                if(correct > number) {
                  i.update({ content: `You guessed it! The correct number (\`${correct}\`), is higher than your guess (\`${number}\`), so you got your salary of \`\`${commafy(salary)}\`\` ${s}`, components: [], ephemeral: true})
                  db.add(`${user.id}.money`, salary)
                } else {
                  i.update({ content: `Wrong guess! The correct one was \`${correct}\` while yours was \`${number}\`. Better luck next time!`, components: [], ephemeral: true})
                }
              }
              if(i.customId === 'same') {
                if(correct === number) {
                  i.update({ content: `You guessed it! The correct number was \`${correct}\` and your guess was exactly the same. So you got your salary of \`\`${commafy(salary)}\`\` ${s}`, components: [], ephemeral: true})
                  db.add(`${user.id}.money`, salary)
                } else {
                  i.update({ content: `Wrong guess! The correct one was \`${correct}\` while yours was \`${number}\`. Better luck next time!`, components: [], ephemeral: true})
                }
              }
              if(i.customId === 'lower') {
                if(correct < number) {
                  i.update({ content: `You guessed it! The correct number (\`${correct}\`), is lower than your guess (\`${number}\`), so you got your salary of \`\`${commafy(salary)}\`\` ${s}`, components: [], ephemeral: true})
                  db.add(`${user.id}.money`, salary)
                } else {
                  i.update({ content: `Wrong guess! The correct one was \`${correct}\` while yours was \`${number}\`. Better luck next time!`, components: [], ephemeral: true})
                }
              }
            } else {
              i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
          });
        }, 5000)
      })
      break;
    case 2:
    case 3:
    case 4:
    case 5:
      /* Guess the word */
      let words = minigames[workname].gtw;
      let randomword = words[Math.floor(Math.random() * words.length)]
      let randombuttonid = Math.floor(Math.random() * 5) + 1;
      if(randombuttonid === 0) randombuttonid = 1;
      let array = [];
      let n = 10;
      while(array.length < 9) {
        let r = Math.floor(Math.random() * words.length);
        n -= 1;
        let thewordid = n;
        if(thewordid === randombuttonid) {
          n -= 1
          thewordid -= 1;
        }
        let word = words[r];
        if(r === 0 && word === randomword) word = words[r + 1];
        if(word === randomword && r !== 0) word = words[r - 1];
        array.push({ word: word, id: thewordid })
      }
      let button1 = new Discord.MessageButton()
        .setCustomId('1')
        .setStyle('PRIMARY')
        .setDisabled(false)
      let button2 = new Discord.MessageButton()
        .setCustomId('2')
        .setStyle('PRIMARY')
        .setDisabled(false)
      let button3 = new Discord.MessageButton()
        .setCustomId('3')
        .setStyle('PRIMARY')
        .setDisabled(false)
      let button4 = new Discord.MessageButton()
        .setCustomId('4')
        .setStyle('PRIMARY')
        .setDisabled(false)
      let button5 = new Discord.MessageButton()
        .setCustomId('5')
        .setStyle('PRIMARY')
        .setDisabled(false)
      for(let i = 0; i < array.length; i++) {
        switch(array[i].id) {
          case 0:
          case 5:
            button1.setLabel(array[i].word)
            break;
          case 1:
          case 6:
            button2.setLabel(array[i].word)
            break;
          case 2:
          case 7:
            button3.setLabel(array[i].word)
            break;
          case 3:
          case 8:
            button4.setLabel(array[i].word)
            break;
          case 4:
          case 9:
            button5.setLabel(array[i].word)
            break;
        }
        switch(randombuttonid) {
          case 1:
            button1.setLabel(randomword)
            break;
          case 2:
            button2.setLabel(randomword)
            break;
          case 3:
            button3.setLabel(randomword)
            break;
          case 4:
            button4.setLabel(randomword)
            break;
          case 5:
            button5.setLabel(randomword)
            break;
        }
      }

      message.reply(`Your word is \`${randomword}\`. Memorize that word because in a few seconds you will have to click the button with the right word`).then(message => {
        setTimeout(function() {
          let row1 = new Discord.MessageActionRow()
          .addComponents(button1, button2, button3, button4, button5)
          message.edit({ content: "Which of these words was the word given to you before?",  components: [row1], ephemeral: true })
          const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 7000 });

          collector.on('collect', i => {
            let a = new Function(`if(${i.customId} === ${randombuttonid}) return true;`)()
            if(a === true) {
              i.update({ content: `Good work! You guessed the word (\`${randomword}\`) right! Here is your salary of \`\`${commafy(salary)}\`\` ${s}`, components: [], ephemeral: true })
            } else {
              i.update({ content: `Terrible work, you didn't even guess the word (\`${randomword}\`) right. For that you don't get your salary!`, components: [], ephemeral: true })
            }
          })
        }, 5000)
      })
      break;
  }
}

async function newjob(user, db, Discord, s, commafy, message, job) {
  for(let i = 0; i < worklist.length; i++) {
    let work = worklist[i]
    if(work.name === job) {
      let embed = new Discord.MessageEmbed()
      .setTitle("New job!")
      .setColor("GREEN")
      .setDescription(`You just got your first job ever! Wow... here is \`1,500\` ${s} to get you started. \n\n**__Work Info__** \n\nWork Name - **${work.name}** \n\nWork Salary - **${work.salary}** \n_Everytime you work, you have a 3% chance of getting a promotion, which raises your salary by a random amount of money_ \nYou were hired for the first time on <t:${Date.now()}:D>`)
      await message.reply({ embeds: [embed] })
      db.set(`${user.id}.work`, {
        name: work.name,
        salary: work.salary,
        startedWorking: Date.now(),
        firstjob: true,
        hasswitched: false
      })
      db.add(`${user.id}.money`, 1500)
    } else {
      continue;
    }
  }
}

async function switchjob(user, db, Discord, s, commafy, message, job) {
  for(let i = 0; i < worklist.length; i++) {
    let work = worklist[i]
    if(work.name === job) {
      let lastjob = db.get(`${user.id}.work.name`)
      let embed = new Discord.MessageEmbed()
      .setTitle("Switched jobs!")
      .setColor("GREEN")
      .setDescription(`You switched from your last job (worked as \`${lastjob}\`) to work as a \`${job}\` with a salary of \`${work.salary}\``)
      await message.reply({ embeds: [embed] })
      db.set(`${user.id}.work`, {
        name: work.name,
        salary: work.salary,
        startedWorking: Date.now(),
        firstjob: false,
        hasswitched: true
      })
      db.set(`${user.id}.cooldowns.switchjob`, Date.now())
    } else {
      continue;
    }
  }
}

module.exports = {
  name: 'work',
  async exe(message, args, Discord, db, s, commafy, ms) {
    let category = args[0]
    let user = message.author
    if(!category) {
      let work = db.get(`${user.id}.work`)
      if(!work) {
        await message.reply('You do not have a job yet! please check \`oki work list\` and do \`oki work new <work>\`')
      } else {
        let isVip = db.get(`${user.id}.vip`)
        let workCooldown = 3600000;
        if(isVip === true) {
          workCooldown = 3200000;
        }
        let lastwork = db.get(`${user.id}.cooldowns.work`)
        if (lastwork !== null && workCooldown - (Date.now() - lastwork) > 0) {
          let timeleft = ms(workCooldown - (Date.now() - lastwork));
          let embed = new Discord.MessageEmbed()
          .setTitle(`No...`)
          .setDescription(`Money is great, but spam is not. You have to wait more **${timeleft}** to use this command again!\nThe default cooldown is set to \`1h\`, but VIPs get to wait only \`53m\`.`)
          .setColor("RED")
          await message.reply({ embeds: [embed] })
        } else {
          let salary = work.salary
          let random = Math.floor(Math.random() * 100);
          if(random > 97) {
            let randomM = Math.floor(Math.random() * (salary / 10))
            db.add(`${user.id}.work.salary`, randomM)
            await message.reply(`I haven't seen someone like you in years, I think you deserver a good old promotion, don't you? Your new salary is \`${commafy(salary + randomM)} ${s}\``)
          } else {
            await minigame(user, message, db, Discord, s, commafy)
          }
        }
      }
    } else {
      switch(category.toLowerCase()) {
        case 'new':
          if(db.get(`${user.id}.work`)) {
            await message.reply('You already have a job! Use \`switch\` instead of \`new\` if you want to switch jobs!')
            break;
          } else {
            let job = args.slice(1).join('')
            if(!job) {
              await message.reply('Please specify a job to work! \`oki work new <jobName>\`')
              break;
            } else {
              await newjob(user, db, Discord, s, commafy, message, job)
              break;
            }
          }
        case 'list':
          let alljobs = [];
          worklist.forEach(work => {
            alljobs.push(`**${work.show}** - \`\`${commafy(work.salary)}\`\` ${s}`)
          })
          let embed = new Discord.MessageEmbed()
          .setTitle("Work List")
          .setDescription(`Choose one of these jobs, all of them have their pros and cons. \n\n${alljobs.join('\n')}`)
          .setColor("ORANGE")
          await message.reply({ embeds: [embed] })
          break;
        case 'switch':
          let isVip = db.get(`${user.id}.vip`)
          let switchCooldown = 3600000;
          if(isVip === true) {
            switchCooldown = 3200000
          }
          let lastswitch = db.get(`${user.id}.cooldowns.switchjobs`)
          if (lastswitch !== null && switchCooldown - (Date.now() - lastswitch) > 0) {
            let timeleft = ms(switchCooldown - (Date.now() - lastswitch));
            let embed = new Discord.MessageEmbed()
            .setTitle(`No...`)
            .setDescription(`You've already switched jobs recently! Please wait more **${timeleft}**`)
            .setColor("RED")
            await interaction.reply({ embeds: [embed] })
          } else {
            if(!db.get(`${user.id}.work`)) {
              await message.reply('You do not have a job yet! please check \`oki work list\` and do \`oki work new <work>\`')
            } else {
              await switchjob(user, db, Discord, s, commafy, message, job)
            }
          }
          break;
      }
    }
  }
}