import React, { useEffect, useRef, useState } from "react";
import api from "../../utils/api";

const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function VoiceQuery() {
  const [listening,setListening] = useState(false);
  const [transcript,setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.interimResults = false;
    r.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(text);
      sendToServer(text);
    }
    r.onend = () => setListening(false);
    recognitionRef.current = r;
    return () => {
      recognitionRef.current && recognitionRef.current.stop();
    };
  }, []);

  function toggle() {
    if (!recognitionRef.current) return alert("Voice not supported in this browser.");
    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  }

  async function sendToServer(text) {
    try {
      const res = await api.post("/api/voice/query", { text });
      // backend returns { answer, action } or similar
      alert("Answer: " + (res.data.answer || "No answer"));
    } catch (err) {
      console.error(err);
      alert("Voice request failed");
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="px-4 py-2 rounded bg-indigo-600 text-white">
          {listening ? "Stop" : "Speak"}
        </button>
        <div className="text-sm text-gray-600">Transcript: {transcript}</div>
      </div>
    </div>
  );
}
