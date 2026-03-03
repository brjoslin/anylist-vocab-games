export const getSpeechVoices = () => {
  if (typeof speechSynthesis === 'undefined') {
    return [] as SpeechSynthesisVoice[];
  }

  return speechSynthesis.getVoices();
};

export const speakText = (
  text: string,
  voiceURI: string | undefined,
  lang: string,
  rate: number
) => {
  if (typeof speechSynthesis === 'undefined') return;

  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;

  const match = getSpeechVoices().find((voice) => voice.voiceURI === voiceURI);
  if (match) utterance.voice = match;

  speechSynthesis.speak(utterance);
};
