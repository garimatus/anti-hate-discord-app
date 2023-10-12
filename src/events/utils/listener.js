import { Events } from "discord.js";
import TFLanguageModel from "../../language_model/TFLanguageModel.class.js";
import { mapper } from "../../database/index.js";

export default function(event) {
    var listener = (...args) => event.execute(...args);

    if (event.name === Events.MessageCreate) {
        const antiHateLangModel = new TFLanguageModel();
        const antiHateBotMapper = mapper.forModel("Anti_Hate_Discord_Bot");
        listener = (...args) => event.execute(...args, antiHateLangModel, antiHateBotMapper);
    }
    
    return listener;
}