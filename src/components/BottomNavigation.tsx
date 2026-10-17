import React from 'react';
import { Calendar, Clock, BookOpen, UserCheck, FileCheck } from 'lucide-react';

export type MainNavTab = 'today' | 'weekly' | 'courses' | 'faculty' | 'exams';

interface BottomNavigationProps {
  activeTab: MainNavTab;
  onChangeTab: (tab: MainNavTab) => void;
  hasExams: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  hasExams
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080d1a]/92 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-2 sm:py-2.5 shadow-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-md mx-auto grid grid-cols-4 sm:grid-cols-5 gap-1">
        {/* Today Tab */}
        <button
          onClick={() => onChangeTab('today')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'today'
              ? 'text-indigo-400 bg-indigo-950/50 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock size={19} className={activeTab === 'today' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Today</span>
        </button>

        {/* Weekly Tab */}
        <button
          onClick={() => onChangeTab('weekly')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'weekly'
              ? 'text-indigo-400 bg-indigo-950/50 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar size={19} className={activeTab === 'weekly' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Weekly</span>
        </button>

        {/* Courses & Attendance Tab */}
        <button
          onClick={() => onChangeTab('courses')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'courses'
              ? 'text-indigo-400 bg-indigo-950/50 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen size={19} className={activeTab === 'courses' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Courses</span>
        </button>

        {/* Faculty Tab */}
        <button
          onClick={() => onChangeTab('faculty')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'faculty'
              ? 'text-indigo-400 bg-indigo-950/50 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck size={19} className={activeTab === 'faculty' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Faculty</span>
        </button>

        {/* Exams / Rules Tab */}
        {hasExams && (
          <button
            onClick={() => onChangeTab('exams')}
            className={`hidden sm:flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
              activeTab === 'exams'
                ? 'text-indigo-400 bg-indigo-950/50 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck size={19} className={activeTab === 'exams' ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Exams</span>
          </button>
        )}
      </div>
    </nav>
  );
};
