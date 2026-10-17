import React, { useMemo } from 'react';
import { Clock, MapPin, User, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import type { TimetableData, TimetableItem } from '../types';
import { TimetableCard } from './TimetableCard';
import { parseTimeToMinutes, getCurrentDayKey } from '../utils/scheduleCalculator';

interface TodayViewProps {
  data: TimetableData;
  selectedBatch: string;
  onSelectBatch: (batch: string) => void;
  onOpenDetails: (item: TimetableItem) => void;
  currentTime: Date;
}

export const TodayView: React.FC<TodayViewProps> = ({
  data,
  selectedBatch,
  onSelectBatch,
  onOpenDetails,
  currentTime
}) => {
  const currentDayKey = getCurrentDayKey();
  const rawSchedule = data.days[currentDayKey] || [];

  const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();

  const isSunday = currentDayKey === 'sunday';
  const holidayItem = rawSchedule.find(i => i.type === 'Other' && i.subject.toLowerCase().includes('holiday'));
  const isHoliday = !!holidayItem;

  // Filter schedule based on user's selected batch
  const schedule = rawSchedule;

  // Helper to resolve an item for the selected batch
  const resolveItem = (item: TimetableItem) => {
    if (item.batches && item.batches.length > 0 && selectedBatch !== 'ALL') {
      const match = item.batches.find(b => b.id === selectedBatch);
      if (match) {
        return {
          ...item,
          subject: match.sub,
          room: match.room || item.room,
          teacher: match.teacher || item.teacher,
          batchId: match.id
        };
      }
    }
    return {
      ...item,
      batchId: item.batch && item.batch !== 'ALL' ? item.batch : undefined
    };
  };

  // Find active class (happening right now)
  const currentClass = useMemo(() => {
    for (const item of schedule) {
      const startM = parseTimeToMinutes(item.start);
      const endM = parseTimeToMinutes(item.end);
      if (currentTimeInMinutes >= startM && currentTimeInMinutes < endM) {
        return item;
      }
    }
    return null;
  }, [schedule, currentTimeInMinutes]);

  // Find next upcoming class
  const nextClass = useMemo(() => {
    for (const item of schedule) {
      const startM = parseTimeToMinutes(item.start);
      if (currentTimeInMinutes < startM && item.type !== 'Break') {
        return item;
      }
    }
    return null;
  }, [schedule, currentTimeInMinutes]);

  const resolvedCurrent = currentClass ? resolveItem(currentClass) : null;
  const resolvedNext = nextClass ? resolveItem(nextClass) : null;

  // Real-time countdown to next class
  const nextClassCountdown = useMemo(() => {
    if (!nextClass) return null;
    const startM = parseTimeToMinutes(nextClass.start);
    const targetDate = new Date(currentTime);
    targetDate.setHours(Math.floor(startM / 60), startM % 60, 0, 0);

    const diffMs = targetDate.getTime() - currentTime.getTime();
    if (diffMs <= 0) return null;

    const totalSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    return { hours, mins, secs };
  }, [nextClass, currentTime]);

  // Current class progress
  const currentProgress = useMemo(() => {
    if (!currentClass) return null;
    const startM = parseTimeToMinutes(currentClass.start);
    const endM = parseTimeToMinutes(currentClass.end);
    const totalSecs = (endM - startM) * 60;
    if (totalSecs <= 0) return null;

    const elapsedSecs = (currentTimeInMinutes - startM) * 60 + currentSeconds;
    const percent = Math.min(100, Math.max(0, Math.round((elapsedSecs / totalSecs) * 100)));
    const remainingMins = Math.max(0, endM - currentTimeInMinutes);

    return { percent, remainingMins };
  }, [currentClass, currentTimeInMinutes, currentSeconds]);

  // Daily statistics
  const nonBreakClasses = schedule.filter(i => i.type !== 'Break');
  const totalClassesCount = nonBreakClasses.length;
  const completedClassesCount = nonBreakClasses.filter(i => parseTimeToMinutes(i.end) <= currentTimeInMinutes).length;
  const lecturesCount = schedule.filter(i => i.type === 'Lecture').length;
  const labsCount = schedule.filter(i => i.type === 'Lab' || i.type === 'Tutorial').length;

  return (
    <div className="space-y-5">
      {/* Date & Batch Switcher Bar matching pu-timetable */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl shadow-black/20">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long' })}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
        </div>

        {/* Quick Batch Filter */}
        {data.availableBatches && data.availableBatches.length > 0 && (
          <div className="flex items-center self-start sm:self-auto gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <Layers size={13} className="text-slate-400 ml-1.5 mr-0.5" />
            <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Batch:</span>
            <button
              type="button"
              onClick={() => onSelectBatch('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                selectedBatch === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Batches
            </button>
            {data.availableBatches.map(b => (
              <button
                key={b}
                type="button"
                onClick={() => onSelectBatch(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  selectedBatch === b
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Responsive Partition Grid: Split Dashboard on Desktop, Stack on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Heroes & Live Widgets (Sticky on Desktop) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          {/* Hero 1: Happening Now Card */}
          {currentClass && resolvedCurrent ? (
            <div
              onClick={() => currentClass.type !== 'Break' && onOpenDetails(currentClass)}
              className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden cursor-pointer hover:shadow-indigo-500/20 active:scale-[0.99] transition"
            >
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between mb-2.5">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Happening Now</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {resolvedCurrent.batchId && (
                    <span className="bg-white text-indigo-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {resolvedCurrent.batchId}
                    </span>
                  )}
                  <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {currentClass.type}
                  </span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight break-words">
                {resolvedCurrent.subject}
              </h3>

              {/* Timing, Room & Teacher Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold text-indigo-100">
                <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl">
                  <Clock size={13} /> {currentClass.start} – {currentClass.end}
                </div>
                {resolvedCurrent.room && (
                  <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl">
                    <MapPin size={13} /> {resolvedCurrent.room}
                  </div>
                )}
                {resolvedCurrent.teacher && (
                  <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl">
                    <User size={13} /> {resolvedCurrent.teacher}
                  </div>
                )}
              </div>

              {/* Interactive Lab Batches inside Hero */}
              {currentClass.batches && currentClass.batches.length > 0 && (
                <div className="mb-4 p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 flex items-center gap-1">
                      <Layers size={11} /> Realtime Lab Batches:
                    </span>
                    <div className="flex gap-1 bg-black/40 p-0.5 rounded-xl">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBatch('ALL');
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          selectedBatch === 'ALL' ? 'bg-white text-indigo-900' : 'text-indigo-200 hover:text-white'
                        }`}
                      >
                        ALL
                      </button>
                      {currentClass.batches.map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBatch(b.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                            selectedBatch === b.id ? 'bg-white text-indigo-900' : 'text-indigo-200 hover:text-white'
                          }`}
                        >
                          {b.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {currentClass.batches.map(b => {
                      const isCurrentSelected = selectedBatch === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBatch(b.id);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                            isCurrentSelected
                              ? 'bg-white/25 border-white text-white font-bold ring-2 ring-white/60'
                              : 'bg-black/25 border-white/10 text-indigo-100 hover:bg-black/35'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] font-black opacity-90 mb-0.5">
                            <span className="bg-indigo-500/80 px-1.5 py-0.2 rounded">{b.id}</span>
                            <span>{b.room}</span>
                          </div>
                          <p className="font-extrabold text-xs text-white truncate">{b.sub}</p>
                          <p className="text-[10px] opacity-75 truncate">{b.teacher}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Live Progress Bar */}
              {currentProgress && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-indigo-100">
                    <span>{currentProgress.percent}% completed</span>
                    <span>{currentProgress.remainingMins} mins left</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${currentProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : isHoliday ? (
            <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-900/50 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-900/60 flex items-center justify-center text-indigo-400">
                <Sparkles size={24} />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                Official College Holiday
              </span>
              <h3 className="text-xl font-black text-white">
                {holidayItem?.subject || "College Holiday"}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No regular lectures scheduled today. Take time to relax or review subjects!
              </p>
            </div>
          ) : isSunday ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-1.5">
              <p className="text-lg font-black text-white">Happy Sunday! ☀️</p>
              <p className="text-xs text-slate-400">College campus is closed. See you on Monday!</p>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-3.5 shadow-md">
              <div className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-white">
                  {schedule.length > 0 && currentTimeInMinutes > parseTimeToMinutes(schedule[schedule.length - 1].end)
                    ? "All classes finished for today ✨"
                    : schedule.length > 0 && currentTimeInMinutes < parseTimeToMinutes(schedule[0].start)
                    ? `Classes start at ${schedule[0].start}`
                    : "No active lecture or lab right now"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {schedule.length > 0 && currentTimeInMinutes > parseTimeToMinutes(schedule[schedule.length - 1].end)
                    ? "Great work today! Rest up for tomorrow."
                    : "Check your upcoming schedule below."}
                </p>
              </div>
            </div>
          )}

          {/* Hero 2: Next Class Countdown Banner */}
          {nextClass && resolvedNext && (
            <div
              onClick={() => onOpenDetails(nextClass)}
              className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900/90 border border-amber-500/30 shadow-md cursor-pointer hover:border-amber-400/50 active:scale-[0.99] transition"
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <Clock size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/60">
                        Up Next at {nextClass.start}
                      </span>
                      {resolvedNext.batchId && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-900/60 text-amber-300">
                          {resolvedNext.batchId}
                        </span>
                      )}
                      {resolvedNext.room && (
                        <span className="text-[11px] font-bold text-slate-400">
                          {resolvedNext.room}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-white mt-1 truncate">
                      {resolvedNext.subject}
                    </h4>
                    {resolvedNext.teacher && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        👤 {resolvedNext.teacher}
                      </p>
                    )}
                  </div>
                </div>

                {/* Countdown Timer Badge */}
                {nextClassCountdown && (
                  <div className="text-right shrink-0 bg-slate-950/80 px-3 py-2 rounded-2xl border border-amber-500/30">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Starts in
                    </p>
                    <p className="text-sm font-black text-amber-400 font-mono">
                      {nextClassCountdown.hours > 0 ? `${nextClassCountdown.hours}h ` : ''}
                      {nextClassCountdown.mins}m {nextClassCountdown.secs}s
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hero 3: Today's Overview Stats Card */}
          <div className="hidden lg:block bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 border border-slate-800 shadow-xl shadow-black/20 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Today's Overview
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400">Total Classes</span>
                <p className="text-xl font-black text-white mt-0.5">{totalClassesCount}</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400">Completed</span>
                <p className="text-xl font-black text-emerald-400 mt-0.5">{completedClassesCount}</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400">Lectures</span>
                <p className="text-xl font-black text-indigo-400 mt-0.5">{lecturesCount}</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400">Labs & Practical</span>
                <p className="text-xl font-black text-purple-400 mt-0.5">{labsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Today's Schedule Timeline */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="text-lg font-black text-white tracking-tight">
              Today's Schedule Timeline
            </h3>
            {totalClassesCount > 0 && (
              <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-xl border border-indigo-900/50 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-400" />
                {completedClassesCount} of {totalClassesCount} completed
              </span>
            )}
          </div>

          {/* Schedule List with Completed / Current / Upcoming States */}
          <div className="space-y-2.5">
            {schedule.length > 0 ? (
              schedule.map((item, i) => {
                const startM = parseTimeToMinutes(item.start);
                const endM = parseTimeToMinutes(item.end);

                let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
                if (currentTimeInMinutes >= endM) {
                  status = 'completed';
                } else if (currentTimeInMinutes >= startM && currentTimeInMinutes < endM) {
                  status = 'current';
                }

                return (
                  <TimetableCard
                    key={`today-${item.id || item.start}-${i}`}
                    item={item}
                    status={status}
                    selectedBatch={selectedBatch}
                    onOpenDetails={onOpenDetails}
                  />
                );
              })
            ) : (
              <div className="py-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
                <p className="text-lg font-bold text-slate-200">No classes scheduled for today</p>
                <p className="text-xs text-slate-500 mt-1">Enjoy your weekend break or catch up on projects!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
