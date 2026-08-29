import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VoiceInputButton = ({ onResult, lang = 'mr', className = '' }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is supported in Google Chrome, Microsoft Edge, and modern Android browsers.");
      const sampleQueries = {
        mr: "मला पेरणीसाठी ट्रॅक्टर भाड्याने पाहिजे",
        hi: "मुझे गेहूं कटाई के लिए हार्वेस्टर चाहिए",
        en: "I need a 45 HP tractor for harvesting"
      };
      onResult(sampleQueries[lang] || sampleQueries.en);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap = {
        mr: 'mr-IN',
        hi: 'hi-IN',
        en: 'en-IN'
      };
      recognition.lang = langMap[lang] || 'mr-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        onResult(transcript);
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn("Voice error:", e);
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`relative p-2.5 rounded-xl transition-all flex items-center justify-center ${
        isListening
          ? 'bg-red-500 text-white animate-pulse shadow-md'
          : 'bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20'
      } ${className}`}
      title="Speak to Search (बोलून शोधा)"
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      {isListening && (
        <span className="absolute -top-8 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
          Listening... (ऐकत आहे...)
        </span>
      )}
    </button>
  );
};
