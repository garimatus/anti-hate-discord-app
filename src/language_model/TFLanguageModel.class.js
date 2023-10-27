import TF from "@tensorflow/tfjs";

export default class TFLanguageModel {
	constructor() {
	}

	hateSpeechDetector(message) {
		if (message === "hate speech") {
			return true;
		}
	}
}