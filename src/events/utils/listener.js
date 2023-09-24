import { Events } from "discord.js";
import TFLanguageModel from "../../language_model/TFLanguageModel.class.js";

export default function(event) {
    var listener = (...args) => event.execute(...args);
    
    if (event.name === Events.MessageCreate) {
        const antiHateLangModel = new TFLanguageModel();
        listener = (...args) => event.execute(...args, antiHateLangModel);
    }
    
    return listener;
}