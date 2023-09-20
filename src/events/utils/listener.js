import { Events } from "discord.js";
import TFLanguageModel from "../../language_model/TFLanguageModel.class.js";
import TFN from "@tensorflow/tfjs-node";
const { pathname : path } = new URL("../../", import.meta.url);

export default function(event) {
    var listener = (...args) => event.execute(...args);
    
    if (event.name === Events.MessageCreate) {
        const TFNfileHandler = TFN.io.fileSystem(path + process.env.MODEL_PATH);
        const antiHateLangModel = new TFLanguageModel(TFNfileHandler);
        
        listener = (...args) => event.execute(...args, antiHateLangModel);
    }
    
    return listener;
}