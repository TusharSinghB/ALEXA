import React, { useEffect } from "react";

const VoiceResponse = ({ response }) => {
    useEffect(() => {
        if (!response) return;

        const speak = () => {
            const synth = window.speechSynthesis;
            synth.cancel(); // stop any ongoing speech

            const utter = new SpeechSynthesisUtterance(response);
            utter.lang = "en-US";
            utter.pitch = 1;
            utter.rate = 1;
            utter.volume = 1;
            synth.speak(utter);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            speak();
        } else {
            window.speechSynthesis.onvoiceschanged = () => speak();
        }
    }, [response]);

    if (!response) return null;

    return (
        <div>
            <p>🗣️ Response: {response}</p>
        </div>
    );
};

export default VoiceResponse;
