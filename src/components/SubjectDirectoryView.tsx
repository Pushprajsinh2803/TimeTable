import React, { useState } from 'react';
import { BookOpen, User, MapPin, Clock, Award, CheckCircle2, AlertTriangle, Plus, Minus } from 'lucide-react';
import type { SubjectDetail } from '../types';

interface SubjectDirectoryViewProps {
  subjects: SubjectDetail[];
  onUpdateSubjects?: (updated: SubjectDetail[]) => void;
}

export const SubjectDirectoryView: React.FC<SubjectDirectoryViewProps> = ({
  subjects,
  onUpdateSubjects
}) => {
  const [subjectList, setSubjectList] = useState<SubjectDetail[]>(subjects);

  const handleAttendanceChange = (code: string, changeAttended: number, changeTotal: number) => {
    const updated = subjectList.map(sub => {
      if (sub.code === code) {
        const attended = Math.max(0, (sub.attendedClasses || 0) + changeAttended);
        const total = Math.max(attended, (sub.totalClasses || 0) + changeTotal);
        return { ...sub, attendedClasses: attended, totalClasses: total };
      }
      return sub;
    });
    setSubjectList(updated);
    onUpdateSubjects?.(updated);
  };

  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
        <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400 font-medium">No subjects found in this document</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Course Catalog & Syllabus
          </h3>
          <p className="text-xs text-slate-400">
            {subjects.length} courses extracted from timetable &bull; Track attendance against 75% rule
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjectList.map(sub => {
          const attended = sub.attendedClasses ?? 18;
          const total = sub.totalClasses ?? 24;
          const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;
          const isSafe = percentage >= 75;

          return (
            <div
              key={sub.code}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                {/* Header: Code & Type badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                    {sub.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {sub.credits && (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        {sub.credits} Credits
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      sub.type === 'Lab' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {sub.type || 'Lecture'}
                    </span>
                  </div>
                </div>

                {/* Subject Name */}
                <h4 className="text-base font-bold text-white mb-2 leading-snug">
                  {sub.name}
                </h4>

                {/* Faculty & Venue Details */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>Faculty: <strong>{sub.faculty}</strong></span>
                    {sub.initials && <span className="text-slate-500">({sub.initials})</span>}
                  </div>

                  {sub.room && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Room / Venue: <strong>{sub.room}</strong></span>
                    </div>
                  )}

                  {sub.weeklyHours && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{sub.weeklyHours} hours per week</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance Tracker Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    {isSafe ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    Attendance: {attended}/{total} classes
                  </span>
                  <span className={`font-bold font-mono ${isSafe ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isSafe ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>

                {/* Log Class Buttons */}
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-500">
                    {isSafe
                      ? `Eligible for exams (${percentage}%)`
                      : `Warning: Below 75% threshold!`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAttendanceChange(sub.code, 1, 1)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold flex items-center gap-0.5 border border-slate-700"
                      title="Attended today's class"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Present</span>
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(sub.code, 0, 1)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold flex items-center gap-0.5 border border-slate-700"
                      title="Missed today's class"
                    >
                      <Minus className="w-3 h-3" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
