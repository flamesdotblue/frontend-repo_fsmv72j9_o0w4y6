import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mic, MicOff, Volume2, Send, Sparkles } from 'lucide-react';

function useSpeech() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          t += e.results[i][0].transcript;
        }
        setTranscript(t);
      };
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const start = () => {
    if (recognitionRef.current && !listening) {
      setTranscript('');
      setListening(true);
      recognitionRef.current.start();
    }
  };
  const stop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };
  const speak = (text) => {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.02;
      utter.pitch = 1.04;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch {}
  };

  return { listening, transcript, start, stop, speak };
}

export default function AITutor({ onProfileSignal }) {
  const shouldReduceMotion = useReducedMotion();
  const { listening, transcript, start, stop, speak } = useSpeech();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hey there! I am your AI Mentor. What are you curious about today?' },
  ]);
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const send = async (content) => {
    const text = (content ?? input).trim();
    if (!text) return;
    setInput('');
    onProfileSignal?.({ motivation: +0.02, focus: +0.03 });
    setMessages((m) => [...m, { role: 'user', text }]);

    // Simulate streaming AI response locally (fewer ticks to reduce CPU)
    const full = `Love that! I can teach this using your favorite style. Here is a quick, clear breakdown with a small challenge to test mastery.`;
    setStreaming(true);
    setMessages((m) => [...m, { role: 'ai', text: '' }]);
    let idx = 0;
    const interval = setInterval(() => {
      idx += 4; // larger chunk, fewer updates
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'ai', text: full.slice(0, idx) };
        return copy;
      });
      if (idx >= full.length) {
        clearInterval(interval);
        setStreaming(false);
        speak(full);
      }
    }, 50);
  };

  useEffect(() => {
    if (transcript && listening) {
      setInput(transcript);
    }
  }, [transcript, listening]);

  return (
    <section aria-label="AI Tutor" className="rounded-2xl border border-white/10 bg-[#0c1326]/70 p-5 shadow-xl backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <h3 className="text-sm font-semibold text-white">Real‑time AI Tutor</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {listening ? (
            <span className="text-rose-300">Listening…</span>
          ) : (
            <span>Voice Ready</span>
          )}
        </div>
      </div>

      <div className="h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            className={`${
              m.role === 'ai'
                ? 'mb-2 max-w-[90%] rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 px-3 py-2 text-sm leading-relaxed text-slate-100 ring-1 ring-cyan-300/20'
                : 'mb-2 ml-auto max-w-[90%] rounded-lg bg-white/10 px-3 py-2 text-sm leading-relaxed text-slate-100 ring-1 ring-white/10'
            }`}
          >
            {m.text}
          </motion.div>
        ))}
        {streaming && <div className="mt-1 h-3 w-12 animate-pulse rounded bg-cyan-400/30" />}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask anything. Your mentor adapts as you learn…"
            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-20 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          />
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1">
            <div className="h-6 w-px bg-white/10" />
            <span className="text-[10px] text-slate-400">Enter ↵</span>
          </div>
        </div>
        <button
          onClick={() => send()}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-2 text-white shadow-lg shadow-cyan-600/30 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
        {listening ? (
          <button
            onClick={stop}
            className="inline-flex items-center justify-center rounded-full bg-rose-600/90 p-2 text-white shadow transition hover:scale-105"
            aria-label="Stop listening"
          >
            <MicOff className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={start}
            className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-cyan-200 ring-1 ring-white/10 transition hover:bg-white/20"
            aria-label="Start listening"
          >
            <Mic className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => messages.length && speak(messages[messages.length - 1].text)}
          className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-cyan-200 ring-1 ring-white/10 transition hover:bg-white/20"
          aria-label="Speak last message"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
