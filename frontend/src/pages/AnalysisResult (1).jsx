import React, { Suspense } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { HeartPulse, ArrowRight } from 'lucide-react';

import Gauge3D from '../components/Gauge3D';
import GlassCard from '../components/GlassCard';

export default function AnalysisResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score;
  const anxiety_level = location.state?.anxiety_level;

  if (score === undefined || anxiety_level === undefined) {
    return <Navigate to="/" replace />;
  }

  // ✅ Defined BEFORE it is called
  const getCategory = (level) => {
    if (level === "Low Anxiety")
      return { label: 'Low Anxiety', color: '#10b981', desc: 'You seem calm and prepared. Great job managing your stress!' };
    if (level === "Moderate Anxiety")
      return { label: 'Moderate Anxiety', color: '#f59e0b', desc: 'You have some pre-exam jitters, which is normal and can help keep you focused.' };
    return { label: 'High Anxiety', color: '#ef4444', desc: 'You are experiencing significant stress. Taking a step back to breathe and reset is highly recommended.' };
  };

  // ✅ Called once, using anxiety_level from backend
  const { label, color, desc } = getCategory(anxiety_level);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <HeartPulse size={48} className="mx-auto text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300">
          Analysis Complete
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        {/* Gauge Card */}
        <GlassCard delay={0.2} className="flex flex-col items-center p-12">
          <div className="w-full h-[300px] mb-6">
            <Suspense fallback={<div className="h-full flex items-center justify-center animate-pulse"><HeartPulse className="text-slate-500" /></div>}>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Gauge3D value={score} color={color} />
              </Canvas>
            </Suspense>
          </div>

          <h3 className="text-3xl font-bold mb-2 tracking-wide" style={{ color }}>{label}</h3>
          <p className="text-slate-400 font-mono text-xl">Confidence: <span className="text-white">{score.toFixed(1)}%</span></p>
        </GlassCard>

        {/* Insight Card */}
        <GlassCard delay={0.4} className="flex flex-col justify-center gap-6 p-10">
          <div>
            <h4 className="text-blue-200 text-sm uppercase tracking-widest font-bold mb-3 border-b border-blue-500/30 pb-2">AI Output Summary</h4>
            <p className="text-xl leading-relaxed text-slate-200 font-light">{desc}</p>
          </div>

          <div className="mt-auto space-y-4">
            <button
              onClick={() => navigate('/suggestions', { state: { level: label } })}
              className="w-full glow-button py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
            >
              Get Actionable Suggestions
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 rounded-xl font-bold border-2 border-slate-600 hover:border-slate-400 hover:bg-slate-700/30 transition-all flex items-center justify-center text-slate-300"
            >
              View My History
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
