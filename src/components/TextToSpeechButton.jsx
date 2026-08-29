import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const TextToSpeechButton = ({
  textToSpeak,
  lang = 'mr',
  label = 'Listen',
  className = ''
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langMap = {
      mr: 'mr-IN',
      hi: 'hi-IN',
      en: 'en-IN'
    };
    utterance.lang = langMap[lang] || 'mr-IN';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        isSpeaking
          ? 'bg-amber-500 text-white shadow'
          : 'bg-[#52B788]/15 text-[#1B4D3E] hover:bg-[#52B788]/30'
      } ${className}`}
      title="Listen Aloud (ऐका)"
    >
      {isSpeaking ? <VolumeX className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4 text-[#2D6A4F]" />}
      <span>{isSpeaking ? 'Stop' : `🔊 ${label}`}</span>
    </button>
  );
};
