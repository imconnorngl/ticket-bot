const Discord = require("discord.js");

const { ticketMessages, supportReaction } = require("../config.json")
module.exports = {
    name: 'system',
    aliases: [],
    usage: 'system',
    description: 'Sends message that allows users to open a ticket by adding a reaction.',

    run: async (message, args, bot) => {
        message.delete({ timeout: 5000 })
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`Ticket Creation`)
            .setDescription(ticketMessages.system.join("\n"))
            .setColor(bot.color)

        var msg = await message.channel.send(embed)
        await new bot.db.menu({ id: msg.id }, { useFindAndModify: false }).save()
        msg.react(supportReaction)

    }
}