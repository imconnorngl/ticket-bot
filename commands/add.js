module.exports = {
    name: 'add',
    aliases: ["summon"],
    usage: 'add [<@user> | id]',
    description: 'Manually adds a user to the ticket.',

    run: async (message, args, bot) => {
        var ticket = await bot.db.tickets.findOne({ channel: message.channel.id })
        if (!ticket) return bot.error(message, `This channel is not a ticket! If you believe this is an error, contact an Admin.`)

        if (!args.length) return bot.error(message, `You need to specify a user to add.`)
        var member = message.mentions.members.first() || message.guild.members.cache.get(args.join(" "))
        if (!member) return bot.error(message, `I could not find that user, please try again.`)

        await message.channel.createOverwrite(member.id, { "VIEW_CHANNEL": true, "SEND_MESSAGES": true })
        message.channel.send(`:white_check_mark: Successfully added ${member} to the ticket`)
    }
}