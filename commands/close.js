const Discord = require("discord.js");

const { logChannel } = require("../config.json")

module.exports = {
    name: 'close',
    aliases: ["delete"],
    usage: 'close',
    description: 'Manually opens a ticket for the user to contact staff.',

    run: async (message, args, bot) => {
        var ticket = await bot.db.tickets.findOne({ channel: message.channel.id })
        if (!ticket) return bot.error(message, `This channel is not a ticket! If you believe this is an error, contact an Admin.`)

        bot.db.tickets.findOneAndUpdate({ channel: message.channel.id }, { active: false, closed: { id: message.author.id, time: Date.now() } }, { useFindAndModify: false })
        message.channel.delete();

        var user = await bot.users.cache.get(ticket.user)
        var channel = await bot.channels.cache.get(logChannel)

        const opened = new Date(ticket.opened)
        const closed = new Date()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Ticket Closed [#${ticket.id}]`)
            .setDescription(`• **Opened By:** \`${user.tag}\`\n• **Opened At:** \`${opened.toDateString()}\`\n• **Closed By:** \`${message.author.tag}\`\n• **Closed At:** \`${closed.toDateString()}\``)
            .setColor(bot.color)

        channel.send(embed)
    }
}