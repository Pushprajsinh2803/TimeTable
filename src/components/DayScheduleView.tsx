import React from 'react';
import { Clock, MapPin, User, Coffee, Layers, Plus, Trash2 } from 'lucide-react';
import type { DayKey, TimetableItem, TimetableData } from '../types';

interface DayScheduleViewProps {
  data: TimetableData;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  selectedBatch: string;
  onSelectBatch: (batch: string) => void;
  onUpdateTimetable: (updated: TimetableData) => void;
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
  onUpdateTimetable
}) => {

  const items = data.days[selectedDay] || [];

  const handleDeleteItem = (id: string) => {
    const updatedDays = {
      ...data.days,
      [selectedDay]: items.filter(item => item.id !== id)
    };
    onUpdateTimetable({ ...data, days: updatedDays });
  };

  const handleAddNewPeriod = () => {
    const newItem: TimetableItem = {
      id: 'item_' + Date.now(),
      start: '16:00',
      end: '17:00',
      subject: 'New Session',
      type: 'Lecture',
      room: 'Room 101',
      batch: 'ALL'
    };
    const updatedDays = {
      ...data.days,
      [selectedDay]: [...items, newItem]
    };
    onUpdateTimetable({ ...data, days: updatedDays });
  };

  return (
    <div className="w-full mt-6">
      {/* Day Tabs */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <div className="flex items-center gap-1.5 min-w-max">
          {DAYS.map(({ key, short }) => {
            const isSelected = selectedDay === key;
            const count = data.days[key]?.length || 0;
            return (
              <button
                key={key}
                onClick={() => onSelectDay(key)}
                className={`py-2 px-3.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{short}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Batch Switcher Bar */}
      {data.availableBatches.length > 0 && (
        <div className="flex items-center gap-2 mt-4 px-1 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">Batch:</span>
          </div>

          <button
            onClick={() => onSelectBatch('ALL')}
            className={`py-1 px-3 rounded-xl text-xs font-semibold transition ${
              selectedBatch === 'ALL'
                ? 'bg-slate-200 text-slate-900 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Batches
          </button>

          {data.availableBatches.map(batchName => (
            <button
              key={batchName}
              onClick={() => onSelectBatch(batchName)}
              className={`py-1 px-3 rounded-xl text-xs font-semibold transition ${
                selectedBatch === batchName
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {batchName}
            </button>
          ))}
        </div>
      )}

      {/* Periods List */}
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
            <Coffee className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No classes scheduled for {selectedDay}</p>
            <p className="text-xs text-slate-600 mt-1">Enjoy your holiday or study time!</p>
            <button
              onClick={handleAddNewPeriod}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Period</span>
            </button>
          </div>
        ) : (
          items.map((item) => {
            const isBreak = item.type === 'Break';
            
            // Check if this item is a parallel batch session
            let subject = item.subject;
            let room = item.room;
            let teacher = item.teacher;

            if (item.batches && item.batches.length > 0 && selectedBatch !== 'ALL') {
              const matched = item.batches.find(b => b.id === selectedBatch);
              if (matched) {
                subject = matched.sub;
                room = matched.room || room;
                teacher = matched.teacher || teacher;
              }
            }

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition group relative ${
                  isBreak
                    ? 'bg-amber-950/15 border-amber-900/30'
                    : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Time Badge */}
                  <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.start} - {item.end}</span>
                  </div>

                  {/* Period Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm md:text-base font-bold ${isBreak ? 'text-amber-300' : 'text-white'}`}>
                        {subject}
                      </h3>
                      {item.code && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
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

                    {/* Batch breakdowns if ALL is selected and batches exist */}
                    {item.batches && item.batches.length > 0 && selectedBatch === 'ALL' && (
                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.batches.map(b => (
                          <div key={b.id} className="text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex flex-col gap-0.5">
                            <span className="font-bold text-indigo-400">{b.id}</span>
                            <span className="text-slate-200 font-medium">{b.sub}</span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                              {b.room && <span>📍 {b.room}</span>}
                              {b.teacher && <span>👤 {b.teacher}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Single Room & Teacher */}
                    {(!item.batches || item.batches.length === 0 || selectedBatch !== 'ALL') && !isBreak && (
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                        {room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            {room}
                          </span>
                        )}
                        {teacher && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-sky-400" />
                            {teacher}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delete Item Action */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                    title="Remove period"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Add Period Button */}
        {items.length > 0 && (
          <button
            onClick={handleAddNewPeriod}
            className="w-full py-2.5 border border-dashed border-slate-800 hover:border-slate-700 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 bg-slate-900/30 hover:bg-slate-900/60 transition"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add Period to {selectedDay}</span>
          </button>
        )}
      </div>
    </div>
  );
};
