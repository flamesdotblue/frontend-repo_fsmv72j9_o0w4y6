import React, { useEffect, useMemo, useState } from 'react';
import Hero3D from './components/Hero3D';
import AITutor from './components/AITutor';
import AdaptiveProfilePanel from './components/AdaptiveProfilePanel';
import InteractivePractice from './components/InteractivePractice';
import ProfileSection from './components/ProfileSection';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownCircle, ShieldCheck, Globe2, Zap } from 'lucide-react';

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

  // Auto-enable performance mode for low-power or reduced-motion users
  const defaultPerf = (() => {
    try {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lowMem = (navigator.deviceMemory && navigator.deviceMemory <= 4) || false;
      const lowThreads = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || false;
      return !!(reduce || lowMem || lowThreads);
    } catch {
      return false;
    }
  })();
  const [performanceMode, setPerformanceMode] = usePersistentState('ai-mentor-perf', defaultPerf);

  // Simulate hidden background update unlock
  useEffect(() => {
    const t = setTimeout(() => setUnlocked(true), 2500);
    const t2 = setTimeout(() => setUnlocked(false), 6500);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
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

  const bg = useMemo(() => 'bg-gradient-to-br from-[#070b14] via-[#0b1326] to-[#0a0f1f]', []);

  return (
    <div className={`${bg} min-h-screen text-white`}>
      {/* Performance toggle */}
      <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b1326]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-cyan-300" />
            <span>Performance mode</span>
          </div>
          <button
            onClick={() => setPerformanceMode((v) => !v)}
            className={`relative inline-flex h-6 w-10 items-center rounded-full transition ${
              performanceMode ? 'bg-cyan-600/60' : 'bg-white/10'
            }`}
            aria-pressed={performanceMode}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                performanceMode ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <Hero3D onStart={startLearning} disable3D={performanceMode} />

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

        {/* New: Profile section powered by open sources (GitHub) */}
        <ProfileSection />

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
