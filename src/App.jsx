import React, { useEffect, useMemo, useState } from 'react';
import Hero3D from './components/Hero3D';
import AITutor from './components/AITutor';
import AdaptiveProfilePanel from './components/AdaptiveProfilePanel';
import InteractivePractice from './components/InteractivePractice';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownCircle, ShieldCheck, Globe2 } from 'lucide-react';

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [profile, setProfile] = usePersistentState('ai-mentor-profile', {
    learningStyle: 'mixed',
    confidence: 0.5,
    motivation: 0.6,
    pace: 0.5,
    focus: 0.6,
    language: 'en',
  });
  const [unlocked, setUnlocked] = useState(false);

  // Simulate hidden background update unlock
  useEffect(() => {
    const t = setTimeout(() => setUnlocked(true), 2500);
    const t2 = setTimeout(() => setUnlocked(false), 6500);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const onSignal = (delta) => {
    setProfile((p) => ({
      ...p,
      confidence: Math.min(1, Math.max(0, (p.confidence ?? 0.5) + (delta.confidence || 0))),
      motivation: Math.min(1, Math.max(0, (p.motivation ?? 0.6) + (delta.motivation || 0))),
      pace: Math.min(1, Math.max(0, (p.pace ?? 0.5) + (delta.pace || 0))),
      focus: Math.min(1, Math.max(0, (p.focus ?? 0.6) + (delta.focus || 0))),
    }));
  };

  const startLearning = () => {
    const el = document.getElementById('mentor');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bg = useMemo(
    () => 'bg-gradient-to-br from-[#070b14] via-[#0b1326] to-[#0a0f1f]',
    []
  );

  return (
    <div className={`${bg} min-h-screen text-white`}>        
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <Hero3D onStart={startLearning} />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-5">
          <div id="mentor" className="md:col-span-3">
            <AITutor onProfileSignal={onSignal} />
          </div>
          <div className="md:col-span-2">
            <AdaptiveProfilePanel profile={profile} setProfile={setProfile} />
          </div>
        </div>

        <div className="mt-8">
          <InteractivePractice onSignal={onSignal} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 flex items-center gap-2 text-cyan-200"><ShieldCheck className="h-4 w-4" /> Privacy‑first</div>
            <p className="text-sm text-slate-300">Your profile adapts locally and syncs securely when you sign in.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 flex items-center gap-2 text-cyan-200"><Globe2 className="h-4 w-4" /> Always improving</div>
            <p className="text-sm text-slate-300">New languages, games and modules appear silently while you study.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 flex items-center gap-2 text-cyan-200"><ArrowDownCircle className="h-4 w-4" /> Works everywhere</div>
            <p className="text-sm text-slate-300">No setup needed. Learn on desktop or mobile with voice and touch.</p>
          </div>
        </div>

        <footer className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-sm text-slate-400">AI Mentor — A teacher that evolves with you. Always learning. Always helping.</p>
        </footer>
      </div>

      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border border-cyan-300/30 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 px-4 py-2 text-sm text-cyan-100 backdrop-blur"
          >
            Unlocked new learning power!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
