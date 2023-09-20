import TF from "@tensorflow/tfjs";

export default class TFLanguageModel {
	constructor(handler) {
		//this.model = TF.loadLayersModel(handler);
	}

	hateSpeechPredicter(message) {
		if (message === "hate speech") return true;
	}
}