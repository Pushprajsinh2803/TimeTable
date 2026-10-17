import { useState, useEffect } from 'react';
import type { TimetableData, DayKey, SubjectDetail, TimetableItem } from './types';
import { DEMO_TIMETABLE } from './data/demoTimetable';
import { calculateActiveSchedule, getCurrentDayKey } from './utils/scheduleCalculator';
import { Header } from './components/Header';
import { LiveTimerBanner } from './components/LiveTimerBanner';
import { TodayView } from './components/TodayView';
import { WeeklyView } from './components/WeeklyView';
import { AcademicOverviewCard } from './components/AcademicOverviewCard';
import { SubjectDirectoryView } from './components/SubjectDirectoryView';
import { FacultyDirectoryView } from './components/FacultyDirectoryView';
import { ExamsAndGuidelinesView } from './components/ExamsAndGuidelinesView';
import { SubjectModal } from './components/SubjectModal';
import { BottomNavigation } from './components/BottomNavigation';
import type { MainNavTab } from './components/BottomNavigation';
import { UploadModal } from './components/UploadModal';
import { AdBanner } from './components/AdBanner';
import { LegalModal } from './components/LegalModal';
import { ShieldCheck, HelpCircle } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<MainNavTab>('today');
  const [selectedDay, setSelectedDay] = useState<DayKey>(() => getCurrentDayKey());
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');

  // Modal states
  const [selectedSubject, setSelectedSubject] = useState<TimetableItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'about' | null>(null);

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save timetable on change
  useEffect(() => {
    localStorage.setItem('user_active_timetable', JSON.stringify(timetable));
  }, [timetable]);

  const activeDayKey = getCurrentDayKey();
  const todaysItems = timetable.days[activeDayKey] || [];
  const activeState = calculateActiveSchedule(todaysItems);

  const handleTimetableLoaded = (newData: TimetableData) => {
    setTimetable(newData);
    setSelectedBatch('ALL');
    setSelectedDay(getCurrentDayKey());
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
      setSelectedDay(getCurrentDayKey());
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 pb-20">
      {/* Sticky Header matching pu-timetable */}
      <Header
        metadata={timetable.metadata}
        selectedBatch={selectedBatch}
        availableBatches={timetable.availableBatches || []}
        onChangeBatch={setSelectedBatch}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExportJSON={handleExportJSON}
        onResetDemo={handleResetDemo}
        currentTime={currentTime}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Top AdSense Banner */}
        <AdBanner slotType="top-banner" />

        {/* Academic Overview Card (Institution, Base Room, Coordinator) */}
        <AcademicOverviewCard
          metadata={timetable.metadata}
          totalSubjects={timetable.subjects?.length || 0}
          totalFaculty={timetable.faculty?.length || 0}
        />

        {/* Live Timer Banner (shown on non-today tabs so user always has live context) */}
        {activeTab !== 'today' && (
          <LiveTimerBanner
            state={activeState}
            selectedBatch={selectedBatch}
            onOpenDetails={setSelectedSubject}
          />
        )}

        {/* In-feed Ad Banner */}
        <AdBanner slotType="in-feed" />

        {/* Tab View: Today's Schedule with 2-Column Split Partitions */}
        {activeTab === 'today' && (
          <section>
            <TodayView
              data={timetable}
              selectedBatch={selectedBatch}
              onSelectBatch={setSelectedBatch}
              onOpenDetails={setSelectedSubject}
              currentTime={currentTime}
            />
          </section>
        )}

        {/* Tab View: Full Weekly Timetable with Day Timeline & Matrix Grid Partitions */}
        {activeTab === 'weekly' && (
          <section>
            <WeeklyView
              data={timetable}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              selectedBatch={selectedBatch}
              onSelectBatch={setSelectedBatch}
              onOpenDetails={setSelectedSubject}
            />
          </section>
        )}

        {/* Tab View: Courses & 75% Attendance */}
        {activeTab === 'courses' && (
          <section>
            <SubjectDirectoryView
              subjects={timetable.subjects || []}
              onUpdateSubjects={handleUpdateSubjects}
            />
          </section>
        )}

        {/* Tab View: Faculty Directory */}
        {activeTab === 'faculty' && (
          <section>
            <FacultyDirectoryView faculty={timetable.faculty || []} />
          </section>
        )}

        {/* Tab View: Exams & Circular Guidelines */}
        {activeTab === 'exams' && (
          <section>
            <ExamsAndGuidelinesView
              exams={timetable.exams || []}
              guidelines={timetable.guidelines || []}
            />
          </section>
        )}
      </main>

      {/* Footer & Compliance Links */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-xs text-slate-500 mt-auto mb-14">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-300">TimeTable — Smart Academic Companion</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live class countdowns &bull; Instant batch filters &bull; 75% attendance tracker
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-slate-300 transition flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck size={14} />
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModalTab('terms')}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => setLegalModalTab('about')}
              className="hover:text-slate-300 transition flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={14} />
              About
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Navigation Bar (pu-timetable signature dock) */}
      <BottomNavigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hasExams={!!((timetable.exams?.length || 0) > 0 || (timetable.guidelines?.length || 0) > 0)}
      />

      {/* Interactive Subject Details Modal */}
      <SubjectModal
        subject={selectedSubject}
        subjectsList={timetable.subjects || []}
        facultyList={timetable.faculty || []}
        selectedBatch={selectedBatch}
        onClose={() => setSelectedSubject(null)}
      />

      {/* Upload & Scanner Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onTimetableLoaded={handleTimetableLoaded}
      />

      {/* AdSense Legal Compliance Modal */}
      <LegalModal
        isOpen={legalModalTab !== null}
        defaultTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}

export default App;
