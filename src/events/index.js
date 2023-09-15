const collecter = require("./utils/collecter");
const listener = require("./utils/listener");
const botLogger = require("../utils/bot-logger");

module.exports = events = {
    setClientEvents : function(client) {
        // Events collection and handling with client instance
        const events = collecter();
        
        if (!Array.isArray(events)) {
            throw new Error("There was not any valid event file found.");
        }

        if (!events.length) {
            throw new Error("There was not any valid event file found.");
        }

        events.forEach(event => {
            if (event.once) {
                client.once(event.name, listener(event));
            }
            
            if (!event.once) {
                client.on(event.name, listener(event));
            }
        });
        
        botLogger("green",
            `The following ${ client.eventNames().length } event(s) was/were added to client:`
        );
        
        client.eventNames().forEach(eventName => {
            console.log("\x1b[35m    — %s\x1b[0m",
                eventName
            )
        });
    }
}