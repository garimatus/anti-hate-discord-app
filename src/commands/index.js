const { Collection, REST, Routes, Events } = require("discord.js");
const handler = require("./utils/handler");
const collecter = require("./utils/collecter");
const deploy = require("./utils/deploy");
const botLogger = require("../utils/bot-logger");

module.exports = commands = {
    setClientCommands : function(client) {
        client.commands = new Collection();
        const commands = collecter();

        if (!Array.isArray(commands)) {
            throw new Error("There was not any valid command file found.");
        }

        if (!commands.length) {
            throw new Error("There was not any valid command file found.");
        }

        if (process.argv[2] === "deploy") {
            const rest =  new REST().setToken(process.env.OAUTH2_TOKEN);
            deploy(rest, Routes, commands);
        }
        
        commands.forEach(command =>
            client.commands.set(command.data.name, command)
        );
        
        client.on(Events.InteractionCreate, handler);

        botLogger("green",
            `The following ${ client.commands.size } command(s) was/were added${
                process.argv[2] === "deploy" ? " and deployed" : ""
            } to client:`.trim()
        );
        
        client.commands.forEach(command => {
            console.log("\x1b[35m    — %s\x1b[0m",
                `"${ "/" }${ command.data.name }": ${ command.data.description }`
            )
        });
    }
}