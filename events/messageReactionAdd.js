const Discord = require("discord.js")

const { ticketParent, supportRoles, ticketMessages } = require("../config.json")

module.exports = async (bot, reaction, user) => {
    const guild = reaction.message.guild
    
    var menu = await bot.db.menu.findOne({ user: reaction.message.id  })

    if (user.bot) return;
    if(!menu) return;

    reaction.users.remove(user.id)

    var ticket = await bot.db.tickets.findOne({ id: user.id, active: true })
    if (ticket) return bot.error(user, `You currently have a ticket open!`, true).catch(err => err)

    var permissionOverwrites = [{ id: guild.id, allow: [], deny: ["VIEW_CHANNEL"] }, { id: user.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], deny: ["MENTION_EVERYONE"] }]
    supportRoles.forEach(id => permissionOverwrites.push({ id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], deny: ["MENTION_EVERYONE"] }))

    var ticketCount = await bot.db.tickets.countDocuments()
    var ticketID = ticketCount + 1

    var ticketChannel = await guild.channels.create(`ticket-${ticketID}`, { type: "text", parent: ticketParent, permissionOverwrites })
    var ticketMessage = ticketMessages.ticket.join("\n").replace(/{type}/g, "General Support").replace(/{user}/g, user.tag)

    const embed = new Discord.MessageEmbed()
        .setTitle(`Ticket Support`)
        .setDescription(ticketMessage)
        .setColor(bot.color)

    ticketChannel.send(user, {embed: embed})

    await new bot.db.tickets({ id: ticketID, user: user.id, channel: ticketChannel.id, opened: Date.now()}, { useFindAndModify: false }).save()
}