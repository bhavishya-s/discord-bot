const config = require("./config.json");
const discordjs = require("discord.js");
const firebase = require("./firebase");
const { findPP } = require("./firebase");

const discordClient = new discordjs.Client();

discordClient.on("ready", () => {
  console.log("Bot is running");
});

discordClient.on("message", async (msg) => {
  // console.log(msg);
  firebase.storeUser(
    {
      username: msg.author.username,
      id: msg.author.id,
      avatar: msg.author.avatarURL(),
      createdAt: msg.author.createdAt,
    },
    {
      name: msg.guild.name,
      id: msg.guild.id,
      icon: msg.guild.iconURL(),
      createdAt: msg.guild.createdAt,
    }
  );
  if (msg.content.match(/^!praise$/)) {
    msg.reply(`you're doing great!`);
    console.log(msg.mentions);
  } else if (msg.content.match(/^!c$/)) {
    msg.channel.send(`C.R.I.N.G.E.`);
  } else if (msg.content.match(/^!c\s*<@!\w*>\s*$/)) {
    user = msg.content.match(/<@!\w*>/);
    msg.channel.send(`${user} please stop being so cringe`);
  } else if (msg.content.match(/^!say\s*\".*\"$/)) {
    message = msg.content.match(/\".*\"/);
    msg.channel.send(`${message[0].replace(/\"/g, "")}`);
  } else if (msg.content.match(/^!praise\s*<@!\w*>$/)) {
    list = msg.content.split(" ");
    msg.channel.send(`${list[1]}, you're doing great!`);
  } else if (msg.content.match(/^!praise\s*<@!\w*>\s*\".*\"$/)) {
    message = msg.content.match(/\".*\"/);
    user = msg.content.match(/<@!\w*>/);
    msg.channel.send(`${user}, ${message[0].replace(/\"/g, "")}`);
  } else if (msg.content.match(/^!roast\s*<@!\w*>$/)) {
    list = msg.content.split(" ");
    msg.channel.send(`${list[1]}, dafuq you lookin' at bitch`);
  } else if (msg.content.match(/^!remindme\s*\d*$/)) {
    list = msg.content.split(" ");
    time = parseInt(list[1], 10);
    if (time < 0) msg.reply("Can't countdown backwards, oops!");
    else setTimeout(() => msg.reply("Reminder!"), time);
  } else if (msg.content.match(/^!pp$/)) {
    const ppSize = await findPP(msg.author.id);
    console.log(await ppSize);
    const ppEmbed = new discordjs.MessageEmbed().setTitle("PP size");
    let pp = "8";
    for (let i = 0; i < ppSize; i++) pp = `${pp}=`;
    pp = `${pp}D`;
    ppEmbed.addFields({
      name: `${msg.author.username}'s pp`,
      value: pp,
    });
    msg.channel.send(ppEmbed);
  } else if (msg.content.match(/^!pp\s*<@!\w*>$/)) {
    const user = msg.mentions.users.map((user) => user);
    firebase.storeUser(
      {
        username: user[0].username,
        id: user[0].id,
        avatar: user[0].avatarURL(),
        createdAt: user[0].createdAt,
      },
      {
        name: msg.guild.name,
        id: msg.guild.id,
        icon: msg.guild.iconURL(),
        createdAt: msg.guild.createdAt,
      }
    );
    const ppSize = await findPP(user[0].id);
    console.log(await ppSize);
    const ppEmbed = new discordjs.MessageEmbed().setTitle("PP size");
    let pp = "8";
    for (let i = 0; i < ppSize; i++) pp = `${pp}=`;
    pp = `${pp}D`;
    ppEmbed.addFields({
      name: `${user[0].username}'s pp`,
      value: pp,
    });
    msg.channel.send(ppEmbed);
  } else {
    console.log(`${msg.author} : ${msg.content}`);
  }

  const message = {
    channel: {
      id: msg.channel.id,
      name: msg.channel.name,
    },
    server: {
      id: msg.guild.id,
      name: msg.guild.name,
    },
    msgID: msg.id,
    author: {
      id: msg.author.id,
      name: msg.author.username,
    },
    content: msg.cleanContent,
    attachments: msg.attachments
      ? msg.attachments.map((atm) => ({ url: atm.url }))
      : null,
  };
  // console.log(message);
  firebase.storeMessage(message);
});

discordClient.login(config.token);
