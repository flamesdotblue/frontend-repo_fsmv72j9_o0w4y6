import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Brain, AudioLines, Gamepad2, Image as ImageIcon, Type } from 'lucide-react';

function Gauge({ label, value, color = 'from-cyan-500 to-blue-500' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span className="font-semibold text-slate-200">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        />
      </div>
    </div>
  );
}

export default function AdaptiveProfilePanel({ profile, setProfile }) {
  const stylePref = useMemo(() => profile.learningStyle || 'mixed', [profile.learningStyle]);

  useEffect(() => {
    try {
      localStorage.setItem('ai-mentor-profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  const updateStyle = (style) => setProfile((p) => ({ ...p, learningStyle: style }));

  return (
    <section aria-label="Adaptive Profile" className="rounded-2xl border border-white/10 bg-[#0b1020]/60 p-5 shadow-lg backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-cyan-300" />
          <h3 className="text-sm font-semibold text-white">Your Adaptive Profile</h3>
        </div>
        <span className="text-xs text-slate-400">Live • Auto‑learning</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          onClick={() => updateStyle('visual')}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition hover:border-cyan-400/60 hover:bg-white/5 ${
            stylePref === 'visual' ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10'
          }`}
        >
          <ImageIcon className="h-4 w-4 text-cyan-300" /> Visual
        </button>
        <button
          onClick={() => updateStyle('audio')}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition hover:border-cyan-400/60 hover:bg-white/5 ${
            stylePref === 'audio' ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10'
          }`}
        >
          <AudioLines className="h-4 w-4 text-cyan-300" /> Audio
        </button>
        <button
          onClick={() => updateStyle('game')}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition hover:border-cyan-400/60 hover:bg-white/5 ${
            stylePref === 'game' ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10'
          }`}
        >
          <Gamepad2 className="h-4 w-4 text-cyan-300" /> Game
        </button>
        <button
          onClick={() => updateStyle('text')}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition hover:border-cyan-400/60 hover:bg-white/5 ${
            stylePref === 'text' ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10'
          }`}
        >
          <Type className="h-4 w-4 text-cyan-300" /> Text
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Gauge label="Confidence" value={profile.confidence ?? 0.5} />
        <Gauge label="Motivation" value={profile.motivation ?? 0.5} color="from-fuchsia-500 to-pink-500" />
        <Gauge label="Pace" value={profile.pace ?? 0.5} color="from-emerald-500 to-lime-500" />
        <Gauge label="Focus" value={profile.focus ?? 0.6} color="from-indigo-500 to-sky-500" />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <Brain className="h-5 w-5 text-cyan-300" />
        <p className="text-xs text-slate-300">
          Tip: Your mentor adapts instantly to clicks, streaks, time-on-task, and voice cues.
        </p>
      </div>
    </section>
  );
}
