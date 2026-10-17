import React from 'react';
import { Calendar, UploadCloud, Download, RotateCcw } from 'lucide-react';
import type { ScheduleMetadata } from '../types';

interface HeaderProps {
  metadata: ScheduleMetadata;
  selectedBatch: string;
  availableBatches: string[];
  onChangeBatch: (batch: string) => void;
  onOpenUpload: () => void;
  onExportJSON: () => void;
  onResetDemo: () => void;
  currentTime: Date;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  selectedBatch,
  availableBatches,
  onChangeBatch,
  onOpenUpload,
  onExportJSON,
  onResetDemo,
  currentTime
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white m-0">TimeTable</h1>
              <span className="text-[10px] px-1.5 py-0.2 font-extrabold uppercase bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/30">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px] sm:max-w-xs">
              {metadata.branch || metadata.title}
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Header Batch Switcher */}
          {availableBatches.length > 0 && (
            <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => onChangeBatch('ALL')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedBatch === 'ALL'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ALL
              </button>
              {availableBatches.map(b => (
                <button
                  key={b}
                  onClick={() => onChangeBatch(b)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedBatch === b
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {/* Real-time Clock Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <button
            onClick={onOpenUpload}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer active:scale-95"
          >
            <UploadCloud size={15} />
            <span className="hidden sm:inline">Upload New</span>
            <span className="sm:hidden">Upload</span>
          </button>

          <button
            onClick={onExportJSON}
            title="Download JSON Backup"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:flex cursor-pointer"
          >
            <Download size={15} />
          </button>

          <button
            onClick={onResetDemo}
            title="Reset to Sample Demo"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:flex cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};
