import React from 'react';
import { Building2, GraduationCap, MapPin, User, Calendar } from 'lucide-react';
import type { ScheduleMetadata } from '../types';

interface AcademicOverviewCardProps {
  metadata: ScheduleMetadata;
  totalSubjects: number;
  totalFaculty: number;
}

export const AcademicOverviewCard: React.FC<AcademicOverviewCardProps> = ({
  metadata,
  totalSubjects,
  totalFaculty
}) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Institutional & Branch Header */}
        <div className="space-y-1.5 flex-1">
          {metadata.institution && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>{metadata.institution}</span>
            </div>
          )}

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {metadata.branch || metadata.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
            {metadata.semester && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/60 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                {metadata.semester}
              </span>
            )}
            {metadata.section && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/60 font-medium text-amber-300">
                {metadata.section}
              </span>
            )}
            {metadata.baseRoom && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/60">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Base: {metadata.baseRoom}
              </span>
            )}
            {metadata.effectiveDate && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {metadata.effectiveDate}
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <div className="px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[70px]">
            <span className="block text-lg font-black text-indigo-400">{totalSubjects}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Courses</span>
          </div>

          <div className="px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[70px]">
            <span className="block text-lg font-black text-purple-400">{totalFaculty}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Faculty</span>
          </div>
        </div>
      </div>

      {/* Class Coordinator Banner (if detected) */}
      {metadata.classCoordinator && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500">Coordinator:</span>
            <span className="font-semibold text-slate-200">{metadata.classCoordinator}</span>
          </div>
          {metadata.coordinatorContact && (
            <a
              href={`mailto:${metadata.coordinatorContact}`}
              className="text-indigo-400 hover:underline text-[11px]"
            >
              {metadata.coordinatorContact}
            </a>
          )}
        </div>
      )}
    </div>
  );
};
