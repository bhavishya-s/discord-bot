const blacklist = require("./blacklist.js");
const discordjs = require('discord.js');    

const discordClient = new discordjs.Client();

discordClient.on('ready', ()=>
    console.log(discordClient.user)
)

discordClient.on('message', msg => {
    if(msg.content.match(/^!praise$/)){
        msg.reply(`you're doing great!`);
        console.log(msg.mentions);
    }
    else if(msg.content.match(/^!praise\s*<@!\w*>$/))
    {
        list = msg.content.split(" ");
        // if(list[1])){
        //     msg.channel.send(`${list[1]}, you're just shit!`);
        // }
        // else
            msg.channel.send(`${list[1]}, you're doing great!`);
    }
    else if(msg.content.match(/^!praise\s*<@!\w*>\s*\".*\"$/)){
        message = msg.content.match(/\".*\"/);
        user = msg.content.match(/<@!\w*>/);
        msg.channel.send(`${user}, ${message[0].replace(/\"/g, "")}`);
    }
    else{
        console.log(`${msg.author} : ${msg.content}`);
    }
})

discordClient.login('NzYyOTEwNTg0MjM2NjcwOTg3.X3wB2Q.evwXV7wyMry385KIrzlOyHlrmoU');