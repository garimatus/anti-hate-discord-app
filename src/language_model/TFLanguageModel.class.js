const TF = require("@tensorflow/tfjs");

module.exports = class TFLanguageModel {
	constructor(handler) {
		//this.model = TF.loadLayersModel(handler);
	}

	hateSpeechPredicter(message) {
		if (message === "hate speech") return true;
	}
}