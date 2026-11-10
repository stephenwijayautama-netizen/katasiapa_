'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from './lib/soundEngine';
import { useApp } from './AppContext';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  Coffee,
  Moon,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function BGMPlayer() {
  const { settings } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState<'lofi' | 'midnight'>('lofi');
  const [volume, setVolume] = useState(35);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsPlaying(soundEngine.isPlaying());
  }, []);

  if (!mounted) return null;

  const handleTogglePlay = () => {
    const newState = soundEngine.toggleBGM(mood);
    setIsPlaying(newState);
  };

  const handleChangeMood = (newMood: 'lofi' | 'midnight') => {
    setMood(newMood);
    if (isPlaying) {
      soundEngine.startBGM(newMood);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    soundEngine.setBGMVolume(val / 100);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* ── EXPANDED CONTROLLER PANEL ── */}
      {isExpanded && (
        <div className="mb-3 p-5 rounded-3xl bg-[#16161F]/95 backdrop-blur-xl border border-white/15 shadow-2xl w-72 space-y-4 animate-scaleUp">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Music className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Backsound Musik</h4>
                <p className="text-[10px] text-zinc-400">Musik latar santai & menenangkan</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mood Selector: Lo-Fi vs Midnight */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Pilihan Suasana
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChangeMood('lofi')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  mood === 'lofi'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Lo-Fi Cafe</span>
              </button>

              <button
                onClick={() => handleChangeMood('midnight')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  mood === 'midnight'
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-md'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Midnight</span>
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
              <span>Volume</span>
              <span>{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-pink-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Big Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
              isPlaying
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/25 hover:scale-105'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Jeda Musik</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Putar Backsound</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ── FLOATING MINI PILL TRIGGER ── */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#181822]/90 hover:bg-[#1E1E2C] backdrop-blur-md border border-white/15 shadow-xl transition-all">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-md ${
            isPlaying
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/30'
              : 'bg-white/10 text-zinc-300 hover:text-white'
          }`}
          title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          )}
        </button>

        {/* Status Text & Visualizer */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white transition"
        >
          <span>{mood === 'lofi' ? 'Lo-Fi Cafe' : 'Midnight 02:00'}</span>

          {/* Sound Wave Animation saat Playing */}
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5 px-0.5">
              <span className="w-0.5 h-full bg-pink-400 rounded-full animate-bounce" />
              <span className="w-0.5 h-2/3 bg-pink-400 rounded-full animate-pulse" />
              <span className="w-0.5 h-full bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          ) : (
            <span className="text-[10px] text-zinc-500">Mati</span>
          )}

          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          ) : (
            <ChevronUp className="w-3 h-3 text-zinc-400" />
          )}
        </button>
      </div>
    </div>
  );
}

