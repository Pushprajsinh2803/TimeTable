import React from 'react';
import { Clock, MapPin, User, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import type { ActiveClassState } from '../types';

interface ActiveLectureCardProps {
  state: ActiveClassState;
  selectedBatch: string;
}

export const ActiveLectureCard: React.FC<ActiveLectureCardProps> = ({ state, selectedBatch }) => {
  const { current, next, timeRemaining, progressPercent, status } = state;

  // Resolve active batch item if current session is split
  let displaySubject = current?.subject || 'No Active Class';
  let displayRoom = current?.room;
  let displayTeacher = current?.teacher;

  if (current?.batches && current.batches.length > 0 && selectedBatch !== 'ALL') {
    const matched = current.batches.find(b => b.id === selectedBatch);
    if (matched) {
      displaySubject = `${matched.sub} (${matched.id})`;
      displayRoom = matched.room || displayRoom;
      displayTeacher = matched.teacher || displayTeacher;
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-purple-950/40 border border-indigo-500/30 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Timer */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {status === 'in-class' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live Now
            </span>
          ) : status === 'break' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5" />
              Break Time
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
              <CheckCircle className="w-3.5 h-3.5" />
              Done for Today
            </span>
          )}

          {current && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
              {current.start} - {current.end}
            </span>
          )}
        </div>

        {timeRemaining && (
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300 bg-indigo-950/50 px-3 py-1 rounded-xl border border-indigo-500/20">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Main Lecture Title */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          {displaySubject}
        </h2>
        
        {/* Room & Teacher Pills */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
          {displayRoom && (
            <span className="flex items-center gap-1 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {displayRoom}
            </span>
          )}
          {displayTeacher && (
            <span className="flex items-center gap-1 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <User className="w-3.5 h-3.5 text-sky-400" />
              {displayTeacher}
            </span>
          )}
          {current?.type && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/20 text-indigo-300">
              {current.type}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar (if in session) */}
      {status === 'in-class' && (
        <div className="w-full bg-slate-800/70 rounded-full h-2 mb-4 overflow-hidden border border-slate-700/40">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-linear shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Next Up Preview */}
      {next && (
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Next:</span>
            <span className="font-semibold text-slate-200">{next.subject}</span>
            {next.room && <span className="text-slate-400">({next.room})</span>}
          </div>
          <div className="flex items-center gap-1 text-indigo-400 font-medium">
            <span>{next.start}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};
