import { createWorker } from 'tesseract.js';
import type { TimetableData, DayKey, TimetableItem, ClassType } from '../types';

export interface ParseProgressCallback {
  (status: string, progress: number): void;
}

const DAY_NAMES: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export async function extractTimetableLocally(
  file: File,
  onProgress?: ParseProgressCallback
): Promise<TimetableData> {
  onProgress?.('Initializing on-device OCR engine...', 10);

  const worker = await createWorker('eng', 1, {
    logger: m => {
      if (m.status === 'recognizing text') {
        const pct = Math.round((m.progress || 0) * 80) + 10;
        onProgress?.(`Reading timetable text (${pct}%)...`, pct);
      }
    }
  });

  onProgress?.('Extracting text from image...', 30);
  const ret = await worker.recognize(file);
  await worker.terminate();

  onProgress?.('Parsing schedule structure...', 90);
  const rawText = ret.data.text;
  console.log('Recognized text from timetable:', rawText);

  const parsed = parseRawTimetableText(rawText);
  onProgress?.('Done!', 100);

  return parsed;
}

export function parseRawTimetableText(rawText: string): TimetableData {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const daysData: Record<DayKey, TimetableItem[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  };

  const detectedBatches = new Set<string>();
  let currentDay: DayKey = 'monday';

  // Standard time regex: e.g. "09:00 - 10:00", "9:00 to 10:00", "09:00-10:00", "9:30 - 11:30"
  const timeRegex = /(\b\d{1,2}[:.]\d{2}\s*(?:AM|PM)?)\s*(?:-|to|–)\s*(\b\d{1,2}[:.]\d{2}\s*(?:AM|PM)?)/i;

  let itemIdCounter = 1;

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Check if line indicates a day
    for (const d of DAY_NAMES) {
      if (lower.startsWith(d) || lower === d) {
        currentDay = d;
        break;
      }
    }

    // Check if line contains a time interval
    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      const start = timeMatch[1].replace('.', ':').trim();
      const end = timeMatch[2].replace('.', ':').trim();
      
      // Extract remaining text as subject / room / teacher
      const remaining = line.replace(timeMatch[0], '').trim();

      // Check for break
      let type: ClassType = 'Lecture';
      if (/break|lunch|tea|recess/i.test(remaining)) {
        type = 'Break';
      } else if (/lab|practical|workshop/i.test(remaining)) {
        type = 'Lab';
      } else if (/tutorial|tut/i.test(remaining)) {
        type = 'Tutorial';
      }

      // Check for room number e.g. "Room 402", "Lab 3", "LH-101", "Auditorium"
      let room: string | undefined;
      const roomMatch = remaining.match(/(?:room|lab|lh|audi|hall)\s*[-:]?\s*([a-z0-9]+)/i);
      if (roomMatch) {
        room = roomMatch[0];
      }

      // Check for teacher: Dr. X or Prof. Y
      let teacher: string | undefined;
      const teacherMatch = remaining.match(/(?:dr\.|prof\.|mr\.|ms\.)\s*[a-z\s.]+/i);
      if (teacherMatch) {
        teacher = teacherMatch[0].trim();
      }

      // Check for batch (e.g. Batch A, Batch B, QC 1.1, QC 1.2)
      const batchMatch = remaining.match(/(?:batch\s*[a-z0-9]|qc\s*\d+\.\d+)/i);
      if (batchMatch) {
        detectedBatches.add(batchMatch[0].toUpperCase());
      }

      // Clean subject name
      let subject = remaining
        .replace(/(?:room|lab|lh|audi|hall)\s*[-:]?\s*([a-z0-9]+)/gi, '')
        .replace(/(?:dr\.|prof\.|mr\.|ms\.)\s*[a-z\s.]+/gi, '')
        .replace(/[()[\]|,-]/g, ' ')
        .trim();

      if (!subject) {
        subject = type === 'Break' ? 'Break' : 'Class Session';
      }

      daysData[currentDay].push({
        id: `local_${itemIdCounter++}`,
        start,
        end,
        subject,
        type,
        room,
        teacher,
        batch: batchMatch ? batchMatch[0].toUpperCase() : 'ALL'
      });
    }
  }

  // Fallback if no specific time pattern matched in OCR: populate a basic draft grid from lines
  const totalItems = Object.values(daysData).reduce((sum, list) => sum + list.length, 0);
  if (totalItems === 0 && lines.length > 0) {
    const defaultTimes = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:15', end: '13:15' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
    ];

    let tIndex = 0;
    for (const line of lines.slice(0, 15)) {
      if (line.length > 3 && !/timetable|schedule|semester|academic/i.test(line)) {
        const time = defaultTimes[tIndex % defaultTimes.length];
        daysData['monday'].push({
          id: `local_${itemIdCounter++}`,
          start: time.start,
          end: time.end,
          subject: line,
          type: /lab/i.test(line) ? 'Lab' : 'Lecture',
          batch: 'ALL'
        });
        tIndex++;
      }
    }
  }

  const now = new Date().toISOString();
  return {
    metadata: {
      id: 'tt_' + Date.now(),
      title: 'Uploaded Timetable',
      institution: '',
      branch: '',
      semester: '',
      section: '',
      createdAt: now,
      updatedAt: now
    },
    availableBatches: Array.from(detectedBatches),
    days: daysData
  };
}
