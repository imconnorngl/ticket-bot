const Discord = require("discord.js");
const { supportRoles, ticketParent, ticketMessages } = require('../config.json')
module.exports = {
    name: 'new',
    aliases: ["open", "create"],
    usage: 'new',
    description: 'Manually opens a ticket for the user to contact staff.',

    run: async (message, args, bot) => {
        message.delete({ timeout: 10000 })

        var ticket = await bot.db.tickets.findOne({ user: message.author.id, active: true })
        if (ticket) return bot.error(message.author, `You currently have a ticket open!`, true).catch(err => err)

        var permissionOverwrites = [{ id: message.guild.id, allow: [], deny: ["VIEW_CHANNEL"] }, { id: message.author.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], deny: ["MENTION_EVERYONE"] }]
        supportRoles.forEach(id => permissionOverwrites.push({ id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], deny: ["MENTION_EVERYONE"] }))

        var ticketCount = await bot.db.tickets.countDocuments()
        var ticketID = ticketCount + 1

        var ticketChannel = await message.guild.channels.create(`ticket-${ticketID}`, { type: "text", parent: ticketParent, permissionOverwrites })
        var ticketMessage = ticketMessages.ticket.join("\n").replace(/{type}/g, "General Support").replace(/{user}/g, message.author.tag)

        const embed = new Discord.MessageEmbed()
            .setTitle(`Ticket Support`)
            .setDescription(ticketMessage)
            .setColor(bot.color)

        ticketChannel.send(message.author, { embed: embed })
        message.channel.send(`Successfully created your ticket, head over to ${ticketChannel}!`).then(msg => msg.delete({ timeout: 10000 }))

        await new bot.db.tickets({ id: ticketID, user: message.author.id, channel: ticketChannel.id, opened: new Date() }, { useFindAndModify: false }).save()
    }
}