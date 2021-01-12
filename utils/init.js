const { db, color } = require("../config.json")

const Discord = require("discord.js")
const mongoose = require("mongoose")
const path = require("path")
const fs = require("fs")

const init = async bot => {
    await mongoose.connect(`mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`, { useNewUrlParser: true, useUnifiedTopology: true })

    const ticketSchema = new mongoose.Schema({
        id: { type: String, required: true },
        user: { type: String, required: true },
        channel: { type: String, required: true },
        opened: { type: String, required: true },
        active: { type: Boolean },
        closed: { type: Object }
    })

    const menuSchema = new mongoose.Schema({
        id: { type: String, required: true }
    })

    bot.color = color
    
    bot.db = {
        tickets: mongoose.model("ticket", ticketSchema),
        menu: mongoose.model("menu", menuSchema)
    }

    bot.error = (message, content, dm = false) => {
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(content)
            .setThumbnail(`https://statsify.net/img/assets/error.gif`)
        return dm ? message.send({ embed: embed }) : message.channel.send({ embed: embed })
    }

    bot.getAllFiles = (dirPath, arrayOfFiles = []) => {
        const files = fs.readdirSync(dirPath)
        files.forEach((file) => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) arrayOfFiles = bot.getAllFiles(dirPath + "/" + file, arrayOfFiles);
            else arrayOfFiles.push(path.join(dirPath, "/", file))
        });
        return arrayOfFiles;
    }

    return bot;
}

module.exports = init