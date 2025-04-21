import React, { useState } from "react";
import SpeechToText from "./Utilities/SpeechTotext";
import VoiceResponse from "./Utilities/TextToSpeech";

const App = () => {
    const [response, setResponse] = useState("");
    const synth = window.speechSynthesis;
    // synth.cancel(); // stop any ongoing speech

    const utter = new SpeechSynthesisUtterance(response);
    synth.speak(utter);
    return (
        <div>
            <SpeechToText onAnswer={setResponse} />
            {response}
            {/* <VoiceResponse response={response} /> */}
        </div>
    );
};

export default App;
