import React from 'react';
import { Coffee, Layers } from 'lucide-react';
import type { DayKey, TimetableItem, TimetableData } from '../types';
import { TimetableCard } from './TimetableCard';
import { parseTimeToMinutes, getCurrentDayKey } from '../utils/scheduleCalculator';

interface DayScheduleViewProps {
  data: TimetableData;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  selectedBatch: string;
  onSelectBatch: (batch: string) => void;
  onOpenDetails: (item: TimetableItem) => void;
}

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const DayScheduleView: React.FC<DayScheduleViewProps> = ({
  data,
  selectedDay,
  onSelectDay,
  selectedBatch,
  onSelectBatch,
  onOpenDetails
}) => {
  const items = data.days[selectedDay] || [];
  const currentDayKey = getCurrentDayKey();
  const isViewingToday = selectedDay === currentDayKey;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="w-full">
      {/* Day Selector Tabs (pu-timetable signature pill bar) */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-1.5 min-w-max">
          {DAYS.map(({ key, short }) => {
            const isSelected = selectedDay === key;
            const isToday = key === currentDayKey;
            const count = data.days[key]?.length || 0;

            return (
              <button
                key={key}
                onClick={() => onSelectDay(key)}
                className={`py-2 px-3.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{short}</span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700/60 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Batch Switcher Pills */}
      {data.availableBatches.length > 0 && (
        <div className="flex items-center gap-2 mb-4 px-1 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Layers size={13} className="text-indigo-400" />
            <span className="font-semibold">Batch:</span>
          </div>

          <button
            onClick={() => onSelectBatch('ALL')}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedBatch === 'ALL'
                ? 'bg-white text-slate-950 shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Batches
          </button>

          {data.availableBatches.map(batchName => (
            <button
              key={batchName}
              onClick={() => onSelectBatch(batchName)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedBatch === batchName
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {batchName}
            </button>
          ))}
        </div>
      )}

      {/* Periods List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl bg-slate-900/40">
            <Coffee className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No classes scheduled for {selectedDay}</p>
            <p className="text-xs text-slate-500 mt-1">Enjoy your holiday or catch up on self-study!</p>
          </div>
        ) : (
          items.map((item) => {
            const startM = parseTimeToMinutes(item.start);
            const endM = parseTimeToMinutes(item.end);

            let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
            if (isViewingToday) {
              if (currentMinutes >= startM && currentMinutes < endM) {
                status = 'current';
              } else if (currentMinutes >= endM) {
                status = 'completed';
              }
            }

            return (
              <TimetableCard
                key={item.id}
                item={item}
                status={status}
                selectedBatch={selectedBatch}
                onOpenDetails={onOpenDetails}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
