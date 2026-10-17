import React, { useState } from 'react';
import { Calendar, LayoutGrid, List, Layers, Clock, MapPin, User, Sparkles } from 'lucide-react';
import type { TimetableData, TimetableItem, DayKey } from '../types';
import { TimetableCard } from './TimetableCard';
import { getCurrentDayKey } from '../utils/scheduleCalculator';

interface WeeklyViewProps {
  data: TimetableData;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  selectedBatch: string;
  onSelectBatch: (batch: string) => void;
  onOpenDetails: (item: TimetableItem) => void;
}

const COLLEGE_DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  data,
  selectedDay,
  onSelectDay,
  selectedBatch,
  onSelectBatch,
  onOpenDetails
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'overview'>('day');
  const currentDayKey = getCurrentDayKey();

  const currentSchedule = data.days[selectedDay] || [];

  return (
    <div className="space-y-5">
      {/* Top Header & View Switcher Bar matching pu-timetable */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                {data.metadata.title || 'Weekly Academic Schedule'}
              </h2>
              <p className="text-xs text-slate-400">
                {data.metadata.section || 'All Divisions'} &bull; {data.metadata.institution || 'Campus Timetable'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle: Day Timeline vs Full Week Grid */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'day'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List size={14} />
                <span>Day</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Grid</span>
              </button>
            </div>

            {/* Batch Selector Pills */}
            {data.availableBatches && data.availableBatches.length > 0 && (
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
                <Layers size={13} className="text-slate-400 ml-1.5 mr-0.5" />
                <button
                  type="button"
                  onClick={() => onSelectBatch('ALL')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    selectedBatch === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {data.availableBatches.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => onSelectBatch(b)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
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
        </div>

        {/* Horizontal Days Selector Tabs (Active in Day View) */}
        {viewMode === 'day' && (
          <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-1 border-t border-slate-800/80">
            {COLLEGE_DAYS.map(({ key, short }) => {
              const isSelected = selectedDay === key;
              const isToday = currentDayKey === key;
              const count = data.days[key]?.length || 0;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectDay(key)}
                  className={`py-2 px-1 sm:py-2.5 sm:px-2 rounded-2xl font-extrabold text-xs transition-all text-center relative cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02] ring-1 ring-indigo-400/50'
                      : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="block text-[10px] sm:text-xs tracking-wider uppercase font-black">
                    {short}
                  </span>
                  {isToday ? (
                    <span className={`block text-[9px] font-black uppercase mt-0.5 ${
                      isSelected ? 'text-indigo-200' : 'text-emerald-400'
                    }`}>
                      Today
                    </span>
                  ) : count > 0 ? (
                    <span className={`block text-[9px] font-bold mt-0.5 opacity-75`}>
                      {count}
                    </span>
                  ) : (
                    <span className="block text-[9px] font-bold mt-0.5 text-slate-600">
                      Off
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW MODE 1: SINGLE DAY TIMELINE */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
            <span className="font-bold text-slate-300">
              Showing: <strong className="text-white capitalize">{selectedDay}</strong>
              {selectedDay === currentDayKey && <span className="text-indigo-400 ml-1.5 font-bold">(Today)</span>}
            </span>
            <span className="text-slate-400 font-semibold">
              {currentSchedule.length} session{currentSchedule.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {currentSchedule.length > 0 ? (
              currentSchedule.map((item, idx) => (
                <TimetableCard
                  key={`day-card-${item.id || item.start}-${idx}`}
                  item={item}
                  status={selectedDay === currentDayKey ? 'upcoming' : 'upcoming'}
                  selectedBatch={selectedBatch}
                  onOpenDetails={onOpenDetails}
                />
              ))
            ) : (
              <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
                <Sparkles size={24} className="mx-auto mb-2 text-slate-600" />
                <p className="text-base font-bold text-slate-300">No scheduled sessions for {selectedDay}</p>
                <p className="text-xs text-slate-500 mt-1">Enjoy your free time or prepare for upcoming classes!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL WEEK MATRIX / GRID OVERVIEW */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
          {COLLEGE_DAYS.map(({ key, label }) => {
            const daySchedule = data.days[key] || [];
            const isToday = currentDayKey === key;

            return (
              <div
                key={key}
                className={`bg-slate-900/90 backdrop-blur-md rounded-3xl border p-4 sm:p-5 space-y-3 shadow-xl shadow-black/20 transition ${
                  isToday
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Day Card Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white">
                      {label}
                    </h4>
                    {isToday && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Today
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDay(key);
                      setViewMode('day');
                    }}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    View Day →
                  </button>
                </div>

                {/* Day Schedule Items */}
                <div className="space-y-2">
                  {daySchedule.length === 0 ? (
                    <div className="py-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80">
                      <Sparkles size={16} className="mx-auto mb-1 text-slate-600" />
                      <p className="text-xs font-bold text-slate-400">
                        No classes / Holiday
                      </p>
                    </div>
                  ) : (
                    daySchedule.map((item, idx) => {
                      const isBreak = item.type === 'Break';
                      let displaySub = item.subject;
                      let displayRoom = item.room;
                      let displayTeacher = item.teacher;

                      if (item.batches && item.batches.length > 0 && selectedBatch !== 'ALL') {
                        const match = item.batches.find(b => b.id === selectedBatch);
                        if (match) {
                          displaySub = match.sub;
                          displayRoom = match.room || displayRoom;
                          displayTeacher = match.teacher || displayTeacher;
                        }
                      }

                      return (
                        <div
                          key={`week-overview-${key}-${idx}`}
                          onClick={() => !isBreak && onOpenDetails(item)}
                          className={`p-3 rounded-2xl border text-xs transition shadow-sm ${
                            isBreak
                              ? 'bg-amber-950/20 border-dashed border-amber-900/40 text-amber-300'
                              : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 hover:border-indigo-500/50 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <Clock size={11} className="text-indigo-400" />
                              {item.start} - {item.end}
                            </span>
                            <div className="flex items-center gap-1">
                              {item.batch && item.batch !== 'ALL' && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                                  {item.batch}
                                </span>
                              )}
                              {item.type && !isBreak && (
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                                  item.type === 'Lab'
                                    ? 'bg-purple-950/70 text-purple-300 border-purple-800/60'
                                    : 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60'
                                }`}>
                                  {item.type}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="font-extrabold text-white text-xs truncate">
                            {displaySub}
                          </p>

                          {/* Room and Teacher */}
                          {(displayRoom || displayTeacher) && !isBreak && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 truncate">
                              {displayRoom && (
                                <span className="flex items-center gap-0.5 truncate">
                                  <MapPin size={10} className="text-rose-400 shrink-0" />
                                  {displayRoom}
                                </span>
                              )}
                              {displayTeacher && (
                                <span className="flex items-center gap-0.5 truncate">
                                  <User size={10} className="text-sky-400 shrink-0" />
                                  {displayTeacher}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
