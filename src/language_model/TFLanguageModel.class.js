import TF from "@tensorflow/tfjs";

export default class TFLanguageModel {
	constructor() {
	}

	hateSpeechPredicter(message) {
		if (message === "hate speech") return true;
	}
}