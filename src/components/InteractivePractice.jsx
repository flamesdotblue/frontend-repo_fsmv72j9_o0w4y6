import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Timer, WandSparkles } from 'lucide-react';

const QUESTIONS = [
  { q: 'What is 7 + 5?', a: '12', level: 1 },
  { q: 'Solve for x: 2x + 6 = 14', a: '4', level: 2 },
  { q: 'Derivative of x^2 is?', a: '2x', level: 3 },
  { q: 'Integrate: ∫ 2x dx', a: 'x^2 + C', level: 3 },
  { q: 'What is 15% of 200?', a: '30', level: 2 },
  { q: 'Prime after 29?', a: '31', level: 1 },
];

export default function InteractivePractice({ onSignal }) {
  const [level, setLevel] = useState(1);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [time, setTime] = useState(30);
  const [celebrate, setCelebrate] = useState(false);

  const pool = useMemo(() => QUESTIONS.filter((q) => q.level === level), [level]);
  const current = pool[idx % pool.length];

  useEffect(() => {
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [idx, level]);

  useEffect(() => {
    if (time === 0) {
      next(false);
    }
  }, [time]);

  const next = (correct) => {
    if (correct) {
      const bonus = 10 + streak * 2;
      setXp((x) => x + bonus);
      setStreak((s) => s + 1);
      setCelebrate(true);
      onSignal?.({ motivation: +0.05, confidence: +0.04 });
      setTimeout(() => setCelebrate(false), 1000);
      if (streak >= 2 && level < 3) setLevel((l) => l + 1);
    } else {
      setStreak(0);
      onSignal?.({ motivation: -0.01, confidence: -0.02 });
      if (level > 1) setLevel((l) => l - 1);
    }
    setTime(30);
    setIdx((i) => i + 1);
    setAnswer('');
  };

  const submit = () => {
    if (!current) return;
    const normalized = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ');
    const ok = normalized(answer) === normalized(current.a);
    next(ok);
  };

  const progress = Math.min(100, (xp % 100));

  return (
    <section id="practice" aria-label="Practice" className="rounded-2xl border border-white/10 bg-[#0b1326]/70 p-5 shadow-xl backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WandSparkles className="h-4 w-4 text-cyan-300" />
          <h3 className="text-sm font-semibold text-white">Adaptive Practice</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-yellow-300" /> {xp} XP</div>
          <div className="flex items-center gap-1"><Flame className={`h-3.5 w-3.5 ${streak ? 'text-orange-400' : 'text-slate-400'}`} /> x{streak}</div>
          <div className="flex items-center gap-1"><Timer className="h-3.5 w-3.5 text-cyan-300" /> {time}s</div>
        </div>
      </div>

      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${progress}%` }} />
      </div>

      {current && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-200">Level {level}</div>
          <div className="mt-1 text-lg font-semibold text-white">{current.q}</div>
          <div className="mt-3 flex items-center gap-2">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Type your answer…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
            />
            <button
              onClick={submit}
              className="rounded-lg bg-gradient-to-r from-emerald-500 to-lime-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.02]"
            >
              Check
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="pointer-events-none mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-center text-emerald-200"
          >
            Great job! Difficulty adjusted to keep you in flow.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
