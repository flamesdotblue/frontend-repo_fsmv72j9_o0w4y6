import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { Rocket, Star, Sparkles } from 'lucide-react';

export default function Hero3D({ onStart }) {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#0b1020] via-[#0a0f1a] to-[#080d16] shadow-2xl">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft glow overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1020]/30 to-[#07101c]/90" />
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(800px 400px at 20% 10%, rgba(56,189,248,0.25), transparent), radial-gradient(900px 500px at 80% 90%, rgba(59,130,246,0.25), transparent)'
      }} />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-cyan-200 ring-1 ring-white/10 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          Real-time, adaptive AI education
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mt-4 bg-gradient-to-r from-cyan-200 via-sky-200 to-white bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl"
        >
          AI Mentor
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 max-w-2xl text-balance text-sm leading-6 text-slate-300 sm:text-base"
        >
          A teacher that evolves with you. Always learning. Always helping.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          >
            <Rocket className="h-4 w-4 transition group-hover:translate-x-0.5" />
            Start Learning Now
          </button>
          <a
            href="#practice"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <Star className="h-4 w-4 text-yellow-300" />
            Try a Practice Challenge
          </a>
        </motion.div>
      </div>
    </section>
  );
}
