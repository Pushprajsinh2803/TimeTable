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
  let displayInitials = item.initials;
  let activeBatchId: string | undefined = item.batch && item.batch !== 'ALL' ? item.batch : undefined;

  if (item.batches && item.batches.length > 0 && selectedBatch !== 'ALL') {
    const matched = item.batches.find(b => b.id === selectedBatch);
    if (matched) {
      displaySubject = matched.sub;
      displayRoom = matched.room || displayRoom;
      displayTeacher = matched.teacher || displayTeacher;
      activeBatchId = matched.id;
    }
  }

  // Dynamic styling based on status
  let cardStyles = "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 shadow-md";

  if (isBreak) {
    cardStyles = isCompleted
      ? "opacity-50 bg-amber-950/10 border-dashed border-amber-900/30"
      : "bg-amber-950/20 border-dashed border-amber-900/50";
  } else if (isCurrent) {
    cardStyles = "border-indigo-500 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/30";
  } else if (isCompleted) {
    cardStyles = "opacity-50 bg-slate-950/50 border-slate-800/60";
  }

  return (
    <div
      onClick={!isBreak ? () => onOpenDetails(item) : undefined}
      className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 ${cardStyles} ${
        !isBreak ? 'cursor-pointer group active:scale-[0.99]' : ''
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-400" />
            {item.start} – {item.end}
          </span>

          {isCurrent && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Now
            </span>
          )}

          {isCompleted && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50 px-2 py-0.5 rounded-md">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Completed
            </span>
          )}

          {activeBatchId && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              {activeBatchId}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {item.code && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
              {item.code}
            </span>
          )}
          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${
            isBreak
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : item.type === 'Lab'
              ? 'bg-purple-950/70 text-purple-300 border-purple-800/60'
              : item.type === 'Lecture'
              ? 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {item.type}
          </span>
        </div>
      </div>

      {/* Main Subject Title & Venue/Teacher Info */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-black tracking-tight leading-snug break-words ${
            isBreak ? 'text-amber-300 italic' : 'text-white group-hover:text-indigo-300 transition'
          }`}>
            {displaySubject}
          </h3>

          {item.notes && (
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {item.notes}
            </p>
          )}

          {/* Parallel Lab Sessions (if ALL batches selected) */}
          {item.batches && item.batches.length > 0 && selectedBatch === 'ALL' && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {item.batches.map(b => (
                <div key={b.id} className="text-xs bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-400 text-[11px] bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/60">
                      {b.id}
                    </span>
                    {b.room && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        📍 {b.room}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-100 font-black text-xs truncate mt-0.5">{b.sub}</p>
                  {b.teacher && (
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                      <User size={11} className="text-sky-400 shrink-0" />
                      {b.teacher}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Room & Teacher Pills (for Lecture or filtered Single Batch) */}
          {(!item.batches || item.batches.length === 0 || selectedBatch !== 'ALL') && !isBreak && (
            <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-xs">
              {displayRoom && (
                <span className="flex items-center gap-1.5 bg-slate-950/80 text-slate-200 px-2.5 py-1 rounded-xl border border-slate-800 font-bold shadow-2xs">
                  <MapPin size={12} className="text-rose-400 shrink-0" />
                  <span>{displayRoom}</span>
                </span>
              )}
              {displayTeacher && (
                <span className="flex items-center gap-1.5 bg-slate-950/80 text-slate-200 px-2.5 py-1 rounded-xl border border-slate-800 font-semibold shadow-2xs">
                  <User size={12} className="text-sky-400 shrink-0" />
                  <span className="font-bold text-white">{displayTeacher}</span>
                  {displayInitials && displayInitials !== displayTeacher && (
                    <span className="text-slate-400 text-[10px]">({displayInitials})</span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {!isBreak && (
          <div className="p-2 rounded-2xl text-slate-500 group-hover:text-white group-hover:bg-slate-800 transition shrink-0">
            <ChevronRight size={18} />
          </div>
        )}
      </div>
    </div>
  );
};
