export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type ClassType = 'Lecture' | 'Lab' | 'Tutorial' | 'Break' | 'Exam' | 'Other';

export interface BatchInfo {
  id: string; // e.g. "Batch 1", "QC 1.1"
  sub: string; // subject name or code
  room?: string;
  teacher?: string;
}

export interface TimetableItem {
  id: string;
  start: string; // "09:00" or "09:00 AM"
  end: string;   // "10:00" or "10:00 AM"
  subject: string;
  type: ClassType;
  room?: string;
  teacher?: string;
  initials?: string;
  code?: string;
  notes?: string;
  batch?: string; // 'ALL' or specific batch
  batches?: BatchInfo[]; // Sub-batches for parallel lab sessions
}

export interface SubjectDetail {
  code: string;
  name: string;
  shortName?: string;
  faculty: string;
  initials?: string;
  credits?: number;
  weeklyHours?: number;
  type?: ClassType;
  room?: string;
  attendedClasses?: number;
  totalClasses?: number;
}

export interface FacultyDetail {
  id: string;
  name: string;
  initials: string;
  designation?: string;
  subjects: string[];
  email?: string;
  cabin?: string;
}

export interface BatchDetail {
  id: string;
  name: string;
  rollRange?: string;
  baseLab?: string;
}

export interface ExamItem {
  id: string;
  date: string;
  time: string;
  subject: string;
  code?: string;
  room?: string;
  faculty?: string;
}

export interface ScheduleMetadata {
  id: string;
  title: string;
  institution?: string;
  branch?: string;
  semester?: string;
  section?: string;
  academicYear?: string;
  classCoordinator?: string;
  coordinatorContact?: string;
  baseRoom?: string;
  effectiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableData {
  metadata: ScheduleMetadata;
  days: Record<DayKey, TimetableItem[]>;
  availableBatches: string[];
  subjects: SubjectDetail[];
  faculty: FacultyDetail[];
  batches: BatchDetail[];
  exams?: ExamItem[];
  guidelines?: string[];
}

export interface ActiveClassState {
  current: TimetableItem | null;
  next: TimetableItem | null;
  timeRemaining: string; // e.g. "23m 45s"
  progressPercent: number; // 0 - 100
  status: 'in-class' | 'break' | 'day-ended' | 'holiday';
}
