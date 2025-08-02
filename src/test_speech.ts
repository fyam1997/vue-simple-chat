import { createInterface } from "readline"
import {
    AudioConfig,
    ResultReason,
    SpeechConfig,
    SpeechSynthesisResult,
    SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk"

function synthesizeSpeech(): void {
    const audioFile = "YourAudioFile.wav"
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig: SpeechConfig = SpeechConfig.fromSubscription(
        "",
        // process.env.SPEECH_KEY!,
        "eastasia",
        // process.env.SPEECH_REGION!,
    )
    const audioConfig: AudioConfig = AudioConfig.fromAudioFileOutput(audioFile)

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural"

    // Create the speech synthesizer.
    const synthesizer: SpeechSynthesizer = new SpeechSynthesizer(
        speechConfig,
        audioConfig,
    )

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    rl.question(
        "Enter some text that you want to speak >\n> ",
        function (text: string) {
            rl.close()
            // Start the synthesizer and wait for a result.
            synthesizer.speakTextAsync(
                text,
                function (result: SpeechSynthesisResult) {
                    if (
                        result.reason ===
                        ResultReason.SynthesizingAudioCompleted
                    ) {
                        console.log("synthesis finished.")
                    } else {
                        console.error(
                            "Speech synthesis canceled, " +
                                result.errorDetails +
                                "\nDid you set the speech resource key and region values?",
                        )
                    }
                    synthesizer.close()
                },
                function (err: string) {
                    console.trace("err - " + err)
                    synthesizer.close()
                },
            )
            console.log("Now synthesizing to: " + audioFile)
        },
    )
}

synthesizeSpeech()
