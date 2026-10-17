import React from 'react';
import { Mail, MapPin, User, X, Clock, Award } from 'lucide-react';
import type { TimetableItem, SubjectDetail, FacultyDetail } from '../types';

interface SubjectModalProps {
  subject: TimetableItem | null;
  subjectsList?: SubjectDetail[];
  facultyList?: FacultyDetail[];
  selectedBatch: string;
  onClose: () => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  subject,
  subjectsList = [],
  facultyList = [],
  selectedBatch,
  onClose
}) => {
  if (!subject) return null;

  // Resolve batch if parallel session
  let activeSubjectName = subject.subject;
  let activeRoom = subject.room;
  let activeTeacher = subject.teacher;
  let activeCode = subject.code;

  if (subject.batches && subject.batches.length > 0 && selectedBatch !== 'ALL') {
    const matched = subject.batches.find(b => b.id === selectedBatch);
    if (matched) {
      activeSubjectName = matched.sub;
      activeRoom = matched.room || activeRoom;
      activeTeacher = matched.teacher || activeTeacher;
    }
  }

  // Find rich subject info
  const subjectDetail = subjectsList.find(s => 
    s.name.toLowerCase() === activeSubjectName.toLowerCase() ||
    s.shortName?.toLowerCase() === activeSubjectName.toLowerCase() ||
    (s.code && s.code === activeCode)
  );

  // Find faculty info
  const teacherName = activeTeacher || subjectDetail?.faculty;
  const facultyDetail = facultyList.find(f => 
    f.name.toLowerCase() === teacherName?.toLowerCase() ||
    (f.initials && f.initials === subject.initials)
  );

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border-t sm:border border-slate-800 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden"></div>

        {/* Modal Top Bar */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-indigo-600/30">
              {activeSubjectName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {subject.type}
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Clock size={12} /> {subject.start} – {subject.end}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                {activeSubjectName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-2xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Course Code & Credits */}
        <div className="p-4 mb-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Code</span>
            <span className="font-mono text-xs font-black text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30">
              {activeCode || subjectDetail?.code || 'ACAD-SUB'}
            </span>
          </div>

          {subjectDetail?.credits && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Teaching Credits
              </span>
              <span className="font-bold text-slate-200">{subjectDetail.credits} Credits</span>
            </div>
          )}

          {subjectDetail?.weeklyHours && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Weekly Workload
              </span>
              <span className="font-bold text-slate-200">{subjectDetail.weeklyHours} Hours / Week</span>
            </div>
          )}
        </div>

        {/* Venue / Location Details */}
        {activeRoom && (
          <div className="p-4 mb-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classroom / Venue</p>
              <p className="text-sm font-bold text-white">{activeRoom}</p>
            </div>
          </div>
        )}

        {/* Faculty / Instructor Card */}
        {teacherName && (
          <div className="p-4 mb-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty Instructor</p>
                <p className="text-sm font-bold text-white">{teacherName}</p>
                {facultyDetail?.cabin && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Office: {facultyDetail.cabin}</p>
                )}
              </div>
            </div>

            {facultyDetail?.email && (
              <a
                href={`mailto:${facultyDetail.email}`}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0"
                title="Email Professor"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        )}

        {/* Batch Splits if any */}
        {subject.batches && subject.batches.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Parallel Batch Sessions</p>
            <div className="grid grid-cols-2 gap-2">
              {subject.batches.map(b => (
                <div key={b.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-bold text-indigo-400 block">{b.id}</span>
                  <span className="text-slate-200 block font-medium mt-0.5">{b.sub}</span>
                  {b.room && <span className="text-[11px] text-slate-400 block mt-1">📍 {b.room}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
