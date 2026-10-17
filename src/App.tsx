import { useState, useEffect } from 'react';
import { UploadCloud, Calendar, Sparkles, Download, RotateCcw, ShieldCheck, HelpCircle, BookOpen, UserCheck, FileCheck } from 'lucide-react';
import type { TimetableData, DayKey, SubjectDetail } from './types';
import { DEMO_TIMETABLE } from './data/demoTimetable';
import { calculateActiveSchedule, getCurrentDayKey } from './utils/scheduleCalculator';
import { ActiveLectureCard } from './components/ActiveLectureCard';
import { DayScheduleView } from './components/DayScheduleView';
import { AcademicOverviewCard } from './components/AcademicOverviewCard';
import { SubjectDirectoryView } from './components/SubjectDirectoryView';
import { FacultyDirectoryView } from './components/FacultyDirectoryView';
import { ExamsAndGuidelinesView } from './components/ExamsAndGuidelinesView';
import { UploadModal } from './components/UploadModal';
import { AdBanner } from './components/AdBanner';
import { LegalModal } from './components/LegalModal';

type ActiveViewTab = 'schedule' | 'subjects' | 'faculty' | 'exams';

export function App() {
  const [timetable, setTimetable] = useState<TimetableData>(() => {
    const saved = localStorage.getItem('user_active_timetable');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved timetable', e);
      }
    }
    return DEMO_TIMETABLE;
  });

  const [activeTab, setActiveTab] = useState<ActiveViewTab>('schedule');
  const [selectedDay, setSelectedDay] = useState<DayKey>(() => getCurrentDayKey());
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'about' | null>(null);

  // Timer tick for real-time lecture calculation
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save timetable whenever updated
  useEffect(() => {
    localStorage.setItem('user_active_timetable', JSON.stringify(timetable));
  }, [timetable]);

  const activeDayKey = getCurrentDayKey();
  const todaysItems = timetable.days[activeDayKey] || [];
  const activeState = calculateActiveSchedule(todaysItems);

  const handleTimetableLoaded = (newData: TimetableData) => {
    setTimetable(newData);
    setSelectedBatch('ALL');
  };

  const handleUpdateSubjects = (updatedSubjects: SubjectDetail[]) => {
    setTimetable(prev => ({
      ...prev,
      subjects: updatedSubjects
    }));
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(timetable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${timetable.metadata.title.toLowerCase().replace(/\s+/g, '_')}_timetable.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDemo = () => {
    if (confirm('Reset to the sample demo timetable?')) {
      setTimetable(DEMO_TIMETABLE);
      setSelectedBatch('ALL');
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#080d1a]/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black tracking-tight text-white m-0">TimeTable</h1>
                <span className="text-[10px] px-1.5 py-0.2 font-extrabold uppercase bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/30">
                  AI Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                {timetable.metadata.title}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Timetable</span>
              <span className="sm:hidden">Upload</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Download Timetable JSON"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:flex"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetDemo}
              title="Reset to Demo"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:flex"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 pb-20">
        {/* Top AdSense Banner (Responsive Leaderboard) */}
        <AdBanner slotType="top-banner" />

        {/* Academic Overview Card (Institution, Branch, Base Room, Coordinator) */}
        <AcademicOverviewCard
          metadata={timetable.metadata}
          totalSubjects={timetable.subjects?.length || 0}
          totalFaculty={timetable.faculty?.length || 0}
        />

        {/* Real-time Current Lecture Card */}
        <section className="mb-6">
          <ActiveLectureCard state={activeState} selectedBatch={selectedBatch} />
        </section>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-5 border-b border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'subjects'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses & Attendance</span>
            {timetable.subjects?.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded-full text-slate-300">
                {timetable.subjects.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('faculty')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'faculty'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty Directory</span>
            {timetable.faculty?.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded-full text-slate-300">
                {timetable.faculty.length}
              </span>
            )}
          </button>

          {(timetable.exams?.length || timetable.guidelines?.length) ? (
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'exams'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Exams & Rules</span>
            </button>
          ) : null}
        </div>

        {/* Tab View Contents */}
        {activeTab === 'schedule' && (
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Timetable Periods
              </h2>
              <span className="text-xs text-slate-500">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <DayScheduleView
              data={timetable}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              selectedBatch={selectedBatch}
              onSelectBatch={setSelectedBatch}
              onUpdateTimetable={setTimetable}
            />
          </section>
        )}

        {activeTab === 'subjects' && (
          <section>
            <SubjectDirectoryView
              subjects={timetable.subjects || []}
              onUpdateSubjects={handleUpdateSubjects}
            />
          </section>
        )}

        {activeTab === 'faculty' && (
          <section>
            <FacultyDirectoryView faculty={timetable.faculty || []} />
          </section>
        )}

        {activeTab === 'exams' && (
          <section>
            <ExamsAndGuidelinesView
              exams={timetable.exams || []}
              guidelines={timetable.guidelines || []}
            />
          </section>
        )}

        {/* In-feed Ad Banner */}
        <AdBanner slotType="in-feed" />
      </main>

      {/* Sticky Bottom AdSense Anchor */}
      <AdBanner slotType="sticky-bottom" />

      {/* Footer & AdSense Compliance Links */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-xs text-slate-500 mt-auto pb-16">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-300">TimeTable - AI Academic Companion</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Turn any timetable photo or PDF into an interactive real-time dashboard.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModalTab('terms')}
              className="hover:text-slate-300 transition"
            >
              Terms
            </button>
            <button
              onClick={() => setLegalModalTab('about')}
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              About
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onTimetableLoaded={handleTimetableLoaded}
      />

      <LegalModal
        isOpen={legalModalTab !== null}
        defaultTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}

export default App;
