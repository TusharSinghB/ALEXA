import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import qaPairs from "../QandA/data";

const fuse = new Fuse(qaPairs, {
    keys: ["question"],
    threshold: 0.4,
});

const SpeechToText = ({ onAnswer }) => {
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);
    const wakeWord = "alexa";
    const isListeningRef = useRef(false);
    const awaitingResponseRef = useRef(false);

    const initializeRecognition = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support Web Speech API.");
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            const result = Array.from(event.results)
                .map((res) => res[0].transcript)
                .join("")
                .toLowerCase()
                .trim();

            console.log("Transcript:", result);
            setTranscript(result);

            if (result.includes(wakeWord) && !awaitingResponseRef.current) {
                console.log(transcript);

                console.log("Wake Up Word Detected");
                const cleaned = result.replace(wakeWord, "").trim();
                awaitingResponseRef.current = true;
                checkForAnswer(cleaned);
            }
        };

        recognition.onend = () => {
            if (!awaitingResponseRef.current) {
                console.log("Recognition ended — restarting...");
                recognition.start(); // keep listening
            }
        };

        recognition.onerror = (e) => {
            console.error("Recognition error:", e.error);
            recognition.stop();
            setTimeout(() => recognition.start(), 1000); // restart after error
        };

        return recognition;
    };

    const checkForAnswer = (input) => {
        const matches = fuse.search(input);
        const response =
            matches.length > 0
                ? matches[0].item.answer
                : "Sorry, I didn't understand that. Try asking about your schedule, labs, or mentor.";

        console.log("Response:", response);
        onAnswer(response);

        speakAndResume(response);
    };

    const speakAndResume = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";

        utterance.onend = () => {
            console.log("Finished speaking.");
            awaitingResponseRef.current = false;
            recognitionRef.current?.start(); // restart listening
        };

        synth.speak(utterance);
    };

    const startLoop = () => {
        if (!recognitionRef.current) {
            recognitionRef.current = initializeRecognition();
        }

        if (!isListeningRef.current) {
            recognitionRef.current?.start();
            isListeningRef.current = true;
            console.log("Assistant is listening...");
        }
    };

    useEffect(() => {
        startLoop();

        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    return (
        <div>
            <h2>🎙️ Say "{wakeWord}" to Ask</h2>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    minHeight: "100px",
                    fontSize: "1.1rem",
                    borderRadius: "5px",
                    background: "#f9f9f9",
                }}
            >
                {transcript || "Waiting for your command..."}
            </div>
        </div>
    );
};

export default SpeechToText;
