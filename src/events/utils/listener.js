import { Events } from "discord.js";
import tensorFlowLangModel from "../../language_model/TFLanguageModel.class.js";

export default function(event, mapper) {
    if (event.name === Events.MessageCreate) {
        return (...args) => event.execute(...args, new tensorFlowLangModel(), mapper);
    } else {
        return (...args) => event.execute(...args, mapper);
    }
}