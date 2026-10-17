import React from 'react';
import { Clock, MapPin, User, ChevronRight, Zap, CheckCircle, Sparkles } from 'lucide-react';
import type { ActiveClassState, TimetableItem } from '../types';

interface LiveTimerBannerProps {
  state: ActiveClassState;
  selectedBatch: string;
  onOpenDetails: (item: TimetableItem) => void;
}

export const LiveTimerBanner: React.FC<LiveTimerBannerProps> = ({
  state,
  selectedBatch,
  onOpenDetails
}) => {
  const { current, next, timeRemaining, progressPercent, status } = state;

  const activeItem = current || next;
  if (!activeItem && status === 'day-ended') {
    return (
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-5 text-center shadow-lg mb-5 backdrop-blur-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400 mb-2">
          <CheckCircle size={13} />
          Day Completed
        </div>
        <h3 className="text-lg font-bold text-white">All classes finished for today</h3>
        <p className="text-xs text-slate-400 mt-1">Review your notes, complete lab assignments, and relax!</p>
      </div>
    );
  }

  // Resolve subject name for batch
  let displaySubject = activeItem?.subject || 'Class';
  let displayRoom = activeItem?.room;
  let displayTeacher = activeItem?.teacher;

  if (activeItem?.batches && activeItem.batches.length > 0 && selectedBatch !== 'ALL') {
    const matched = activeItem.batches.find(b => b.id === selectedBatch);
    if (matched) {
      displaySubject = `${matched.sub} (${matched.id})`;
      displayRoom = matched.room || displayRoom;
      displayTeacher = matched.teacher || displayTeacher;
    }
  }

  const isCurrent = status === 'in-class';
  const isBreak = status === 'break';

  return (
    <div
      onClick={() => activeItem && onOpenDetails(activeItem)}
      className="w-full bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/50 border border-indigo-500/30 rounded-3xl p-5 md:p-6 shadow-xl mb-5 relative overflow-hidden backdrop-blur-md cursor-pointer group hover:border-indigo-400/50 transition-all active:scale-[0.99]"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Line */}
      <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
        <div className="flex items-center gap-2">
          {isCurrent ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Now Happening
            </span>
          ) : isBreak ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap size={12} />
              Recess / Break
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles size={12} />
              Next Up
            </span>
          )}

          {activeItem && (
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              {activeItem.start} – {activeItem.end}
            </span>
          )}
        </div>

        {timeRemaining && (
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-500/30">
            <Clock size={13} className="text-indigo-400" />
            <span>{timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Main Lecture Title & Arrow */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-200 transition">
            {displaySubject}
          </h2>

          <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-300">
            {displayRoom && (
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <MapPin size={13} className="text-rose-400" />
                {displayRoom}
              </span>
            )}
            {displayTeacher && (
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <User size={13} className="text-sky-400" />
                {displayTeacher}
              </span>
            )}
            {activeItem?.type && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300">
                {activeItem.type}
              </span>
            )}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition shrink-0 mt-1">
          <ChevronRight size={18} />
        </div>
      </div>

      {/* Real-time Progress Bar */}
      {isCurrent && (
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/40">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-linear shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Up Next Preview if in class */}
      {isCurrent && next && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="text-slate-400">
            Next: <strong className="text-slate-200">{next.subject}</strong> {next.room && `(${next.room})`}
          </span>
          <span className="font-mono text-indigo-400 font-semibold">{next.start}</span>
        </div>
      )}
    </div>
  );
};
