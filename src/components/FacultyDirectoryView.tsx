import React from 'react';
import { UserCheck, Mail, MapPin } from 'lucide-react';
import type { FacultyDetail } from '../types';

interface FacultyDirectoryViewProps {
  faculty: FacultyDetail[];
}

export const FacultyDirectoryView: React.FC<FacultyDirectoryViewProps> = ({ faculty }) => {
  if (!faculty || faculty.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
        <UserCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400 font-medium">No faculty members detected in this timetable</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          Faculty & Instructor Directory
        </h3>
        <p className="text-xs text-slate-400">
          {faculty.length} instructors recognized from timetable sheet
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {faculty.map(prof => (
          <div
            key={prof.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 text-indigo-300 font-black text-sm flex items-center justify-center">
                  {prof.initials || prof.name.slice(0, 2).toUpperCase()}
                </div>
                {prof.initials && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {prof.initials}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white mb-0.5">{prof.name}</h4>
              <p className="text-[11px] text-slate-400 mb-2">{prof.designation || 'Instructor'}</p>

              {prof.subjects.length > 0 && (
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Courses:</span>
                  <div className="flex flex-wrap gap-1">
                    {prof.subjects.map(s => (
                      <span key={s} className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              {prof.cabin && (
                <span className="flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  {prof.cabin}
                </span>
              )}
              {prof.email && (
                <a
                  href={`mailto:${prof.email}`}
                  className="text-indigo-400 hover:text-indigo-300 p-1 rounded hover:bg-slate-800"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
