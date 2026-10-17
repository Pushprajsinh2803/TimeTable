import React from 'react';
import { Clock, MapPin, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { TimetableItem } from '../types';

interface TimetableCardProps {
  item: TimetableItem;
  status: 'completed' | 'current' | 'upcoming';
  selectedBatch: string;
  onOpenDetails: (item: TimetableItem) => void;
}

export const TimetableCard: React.FC<TimetableCardProps> = ({
  item,
  status,
  selectedBatch,
  onOpenDetails
}) => {
  const isBreak = item.type === 'Break';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  // Resolve batch
  let displaySubject = item.subject;
  let displayRoom = item.room;
  let displayTeacher = item.teacher;

  if (item.batches && item.batches.length > 0 && selectedBatch !== 'ALL') {
    const matched = item.batches.find(b => b.id === selectedBatch);
    if (matched) {
      displaySubject = matched.sub;
      displayRoom = matched.room || displayRoom;
      displayTeacher = matched.teacher || displayTeacher;
    }
  }

  // Dynamic styling based on status
  let cardStyles = "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60";

  if (isBreak) {
    cardStyles = isCompleted
      ? "opacity-50 bg-amber-950/10 border-dashed border-amber-900/30"
      : "bg-amber-950/20 border-dashed border-amber-900/50";
  } else if (isCurrent) {
    cardStyles = "border-indigo-500 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/30 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30";
  } else if (isCompleted) {
    cardStyles = "opacity-50 bg-slate-950/50 border-slate-800/50";
  }

  return (
    <div
      onClick={!isBreak ? () => onOpenDetails(item) : undefined}
      className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 ${cardStyles} ${
        !isBreak ? 'cursor-pointer group active:scale-[0.99]' : ''
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-400" />
            {item.start} – {item.end}
          </span>

          {isCurrent && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Now
            </span>
          )}

          {isCompleted && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <CheckCircle2 size={12} />
              Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {item.code && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
              {item.code}
            </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
            isBreak
              ? 'bg-amber-500/20 text-amber-300'
              : item.type === 'Lab'
              ? 'bg-purple-500/20 text-purple-300'
              : item.type === 'Lecture'
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {item.type}
          </span>
        </div>
      </div>

      {/* Main Subject Title */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h3 className={`text-base font-bold leading-tight ${isBreak ? 'text-amber-300' : 'text-white group-hover:text-indigo-300 transition'}`}>
            {displaySubject}
          </h3>

          {/* Parallel Lab Sessions (if ALL is selected) */}
          {item.batches && item.batches.length > 0 && selectedBatch === 'ALL' && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.batches.map(b => (
                <div key={b.id} className="text-xs bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex flex-col gap-0.5">
                  <span className="font-bold text-indigo-400">{b.id}</span>
                  <span className="text-slate-200 font-semibold">{b.sub}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    {b.room && <span>📍 {b.room}</span>}
                    {b.teacher && <span>👤 {b.teacher}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Room & Teacher Pills (Single view) */}
          {(!item.batches || item.batches.length === 0 || selectedBatch !== 'ALL') && !isBreak && (
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-300">
              {displayRoom && (
                <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <MapPin size={12} className="text-rose-400" />
                  {displayRoom}
                </span>
              )}
              {displayTeacher && (
                <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <User size={12} className="text-sky-400" />
                  {displayTeacher}
                </span>
              )}
            </div>
          )}
        </div>

        {!isBreak && (
          <div className="p-1.5 rounded-xl text-slate-500 group-hover:text-white group-hover:bg-slate-800 transition shrink-0">
            <ChevronRight size={18} />
          </div>
        )}
      </div>
    </div>
  );
};
