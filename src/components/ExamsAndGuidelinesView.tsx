import React from 'react';
import { Calendar, FileCheck, MapPin, Clock, AlertCircle } from 'lucide-react';
import type { ExamItem } from '../types';

interface ExamsAndGuidelinesViewProps {
  exams?: ExamItem[];
  guidelines?: string[];
}

export const ExamsAndGuidelinesView: React.FC<ExamsAndGuidelinesViewProps> = ({
  exams = [],
  guidelines = []
}) => {
  return (
    <div className="space-y-6">
      {/* Exams Schedule Section */}
      {exams.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Mid-Sem & Examination Schedule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exams.map(ex => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/40">
                    {ex.date}
                  </span>
                  <span className="font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {ex.time}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{ex.subject}</h4>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  {ex.code && (
                    <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                      {ex.code}
                    </span>
                  )}
                  {ex.room && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {ex.room}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines & Rules Section */}
      {guidelines.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Academic Guidelines & Notice Rules
          </h3>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            {guidelines.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
