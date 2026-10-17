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
  code?: string;
  notes?: string;
  batch?: string; // 'ALL' or specific batch
  batches?: BatchInfo[]; // Sub-batches for parallel lab sessions
}

export interface ScheduleMetadata {
  id: string;
  title: string;
  institution?: string;
  branch?: string;
  semester?: string;
  section?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableData {
  metadata: ScheduleMetadata;
  days: Record<DayKey, TimetableItem[]>;
  availableBatches: string[];
}

export interface ActiveClassState {
  current: TimetableItem | null;
  next: TimetableItem | null;
  timeRemaining: string; // e.g. "23m 45s"
  progressPercent: number; // 0 - 100
  status: 'in-class' | 'break' | 'day-ended' | 'holiday';
}
