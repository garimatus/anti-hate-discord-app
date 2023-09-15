const { Events } = require("discord.js");
const path = require("node:path");
const TFLanguageModel = require("../../language_model/TFLanguageModel.class.js");
const TFN = require("@tensorflow/tfjs-node");

module.exports = function(event) {
    var listener = (...args) => event.execute(...args);

    if (event.name === Events.MessageCreate) {
        const TFNfileHandler = TFN.io.fileSystem(path.join(__dirname, process.env.MODEL_PATH));
        const antiHateLangModel = new TFLanguageModel(TFNfileHandler);
        
        listener = (...args) => event.execute(...args, antiHateLangModel);
    }
    
    return listener;
}