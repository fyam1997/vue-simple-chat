import {
    AudioConfig,
    ResultReason,
    SpeechConfig,
    SpeechSynthesisResult,
    SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk"
import { franc } from "franc-min"

export async function speak(
    text: string,
    key: string = "",
    region: string = "eastasia",
): Promise<void> {
    return new Promise((resolve, reject) => {
        const lang = franc(text, { only: ["zho", "cmn", "eng"] })
        let voiceName
        if (lang === "eng") {
            voiceName = "en-US-AvaMultilingualNeural"
        } else {
            voiceName = "zh-CN-XiaoxiaoNeural"
        }

        const speechConfig = SpeechConfig.fromSubscription(key, region)
        speechConfig.speechSynthesisVoiceName = voiceName
        // 浏览器端直接播放
        const audioConfig = AudioConfig.fromDefaultSpeakerOutput()
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig)
        synthesizer.speakTextAsync(
            text,
            (result: SpeechSynthesisResult) => {
                if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                    resolve()
                } else {
                    reject(result.errorDetails)
                }
                synthesizer.close()
            },
            (err: string) => {
                synthesizer.close()
                reject(err)
            },
        )
    })
}
