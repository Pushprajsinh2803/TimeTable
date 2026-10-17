import { createWorker } from 'tesseract.js';
import type { TimetableData, DayKey, TimetableItem, ClassType } from '../types';

export interface ParseProgressCallback {
  (status: string, progress: number): void;
}

export interface LocalExtractionResult {
  timetable: TimetableData;
  rawText: string;
  detectedCount: number;
}

const DAY_ALIASES: Record<string, DayKey> = {
  'mon': 'monday',
  'monday': 'monday',
  'tue': 'tuesday',
  'tues': 'tuesday',
  'tuesday': 'tuesday',
  'wed': 'wednesday',
  'wednesday': 'wednesday',
  'thu': 'thursday',
  'thur': 'thursday',
  'thurs': 'thursday',
  'thursday': 'thursday',
  'fri': 'friday',
  'friday': 'friday',
  'sat': 'saturday',
  'saturday': 'saturday',
  'sun': 'sunday',
  'sunday': 'sunday'
};

/**
 * Preprocesses an image using HTML5 Canvas:
 * - Rescales to optimal OCR resolution (~1600-2000px)
 * - Converts to high-contrast grayscale to remove background shadows/glare
 */
export async function preprocessImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    // If not an image, return raw file
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Optimal width for table OCR is around 1600 - 2200px
      const targetWidth = 1800;
      if (width < 1200) {
        const scale = targetWidth / width;
        width = targetWidth;
        height = Math.round(height * scale);
      } else if (width > 2800) {
        const scale = 2400 / width;
        width = 2400;
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const d = imgData.data;

        // Grayscale + Contrast Stretch
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          
          // Perceptual luminance
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;
          
          // Contrast boost: push grays away from middle
          gray = (gray - 128) * 1.45 + 128;
          gray = Math.max(0, Math.min(255, gray));

          d[i] = gray;
          d[i + 1] = gray;
          d[i + 2] = gray;
        }

        ctx.putImageData(imgData, 0, 0);
        canvas.toBlob((blob) => {
          resolve(blob || file);
        }, 'image/png');
      } catch (e) {
        console.warn('Canvas filter failed, using raw file', e);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export async function extractTimetableLocally(
  file: File,
  onProgress?: ParseProgressCallback
): Promise<LocalExtractionResult> {
  onProgress?.('Enhancing photo clarity & contrast...', 10);
  const processedBlob = await preprocessImage(file);

  onProgress?.('Loading on-device OCR engine...', 25);
  const worker = await createWorker('eng', undefined, {
    logger: m => {
      if (m.status === 'recognizing text') {
        const pct = Math.round((m.progress || 0) * 60) + 30;
        onProgress?.(`Scanning timetable words (${pct}%)...`, pct);
      }
    }
  });

  onProgress?.('Extracting text characters...', 50);
  const ret = await worker.recognize(processedBlob);
  await worker.terminate();

  onProgress?.('Analyzing table periods & schedule...', 92);
  const rawText = ret.data.text || '';
  console.log('Recognized raw text from timetable:', rawText);

  const timetable = parseRawTimetableText(rawText);
  const detectedCount = Object.values(timetable.days).reduce((s, list) => s + list.length, 0);

  onProgress?.('Done!', 100);

  return {
    timetable,
    rawText,
    detectedCount
  };
}

export function parseRawTimetableText(rawText: string): TimetableData {
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 1);

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
  let itemIdCounter = 1;

  // Flexible time regex to match various formats:
  // "09:00 - 10:00", "9:00 to 10:00", "9.00-10.00", "09:00AM - 10:00AM", "9-10"
  const timeRegex = /(\b\d{1,2}(?:[:.]\d{2})?\s*(?:AM|PM)?)\s*(?:-|to|–|—)\s*(\b\d{1,2}(?:[:.]\d{2})?\s*(?:AM|PM)?)/i;

  for (const line of lines) {
    const lower = line.toLowerCase().replace(/[^a-z0-9\s:.-]/g, ' ');
    const firstWord = lower.split(/\s+/)[0];

    // Check if line switches active day
    if (DAY_ALIASES[firstWord]) {
      currentDay = DAY_ALIASES[firstWord];
    } else {
      for (const [alias, dayKey] of Object.entries(DAY_ALIASES)) {
        if (lower.startsWith(alias + ' ') || lower.startsWith(alias + ':') || lower === alias) {
          currentDay = dayKey;
          break;
        }
      }
    }

    // Match times
    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      let start = timeMatch[1].replace('.', ':').trim();
      let end = timeMatch[2].replace('.', ':').trim();

      // Normalize if just hour "9" -> "09:00"
      if (!start.includes(':')) {
        const num = parseInt(start, 10);
        start = `${num < 10 ? '0' : ''}${num}:00`;
      }
      if (!end.includes(':')) {
        const num = parseInt(end, 10);
        end = `${num < 10 ? '0' : ''}${num}:00`;
      }

      const remaining = line.replace(timeMatch[0], '').trim();

      // Detect class type
      let type: ClassType = 'Lecture';
      if (/break|lunch|tea|recess/i.test(remaining)) {
        type = 'Break';
      } else if (/lab|practical|workshop/i.test(remaining)) {
        type = 'Lab';
      } else if (/tutorial|tut/i.test(remaining)) {
        type = 'Tutorial';
      }

      // Detect room
      let room: string | undefined;
      const roomMatch = remaining.match(/(?:room|lab|lh|audi|hall)\s*[-:]?\s*([a-z0-9]+)/i);
      if (roomMatch) {
        room = roomMatch[0];
      }

      // Detect teacher
      let teacher: string | undefined;
      const teacherMatch = remaining.match(/(?:dr\.|prof\.|mr\.|ms\.)\s*[a-z\s.]+/i);
      if (teacherMatch) {
        teacher = teacherMatch[0].trim();
      }

      // Detect batch
      const batchMatch = remaining.match(/(?:batch\s*[a-z0-9]|qc\s*\d+\.\d+|batch-[a-z0-9]+)/i);
      if (batchMatch) {
        detectedBatches.add(batchMatch[0].toUpperCase());
      }

      // Clean subject title
      let subject = remaining
        .replace(/(?:room|lab|lh|audi|hall)\s*[-:]?\s*([a-z0-9]+)/gi, '')
        .replace(/(?:dr\.|prof\.|mr\.|ms\.)\s*[a-z\s.]+/gi, '')
        .replace(/[()[\]|,-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!subject || subject.length < 2) {
        subject = type === 'Break' ? 'Break' : 'Lecture Session';
      }

      daysData[currentDay].push({
        id: `ocr_${itemIdCounter++}`,
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

  // Fallback: If no strict time intervals were matched, build slots from meaningful recognized lines
  const totalItems = Object.values(daysData).reduce((s, list) => s + list.length, 0);
  if (totalItems === 0 && lines.length > 0) {
    const defaultSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:15', end: '13:15' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' }
    ];

    let slotIdx = 0;
    const meaningfulLines = lines.filter(l => 
      l.length > 2 && 
      !/^(timetable|schedule|room|faculty|time|day|sem|semester|mon|tue|wed|thu|fri|sat)$/i.test(l)
    );

    for (const l of meaningfulLines.slice(0, 12)) {
      const slot = defaultSlots[slotIdx % defaultSlots.length];
      const isLab = /lab|practical/i.test(l);
      const isBreak = /lunch|break|recess/i.test(l);

      daysData['monday'].push({
        id: `ocr_draft_${itemIdCounter++}`,
        start: slot.start,
        end: slot.end,
        subject: l,
        type: isBreak ? 'Break' : isLab ? 'Lab' : 'Lecture',
        batch: 'ALL'
      });
      slotIdx++;
    }
  }

  // Extract subjects and faculty catalogs from parsed schedule
  const subjectMap = new Map<string, { faculty: string; room?: string; count: number; type: ClassType }>();
  const facultyMap = new Map<string, Set<string>>();

  Object.values(daysData).forEach(dayList => {
    dayList.forEach(item => {
      if (item.type !== 'Break' && item.subject) {
        const existing = subjectMap.get(item.subject);
        if (existing) {
          existing.count += 1;
        } else {
          subjectMap.set(item.subject, {
            faculty: item.teacher || 'Department Faculty',
            room: item.room,
            count: 1,
            type: item.type
          });
        }

        if (item.teacher) {
          const teacherSubs = facultyMap.get(item.teacher) || new Set<string>();
          teacherSubs.add(item.subject);
          facultyMap.set(item.teacher, teacherSubs);
        }
      }
    });
  });

  const subjects = Array.from(subjectMap.entries()).map(([name, info], idx) => ({
    code: `SUB-${101 + idx}`,
    name,
    shortName: name.length > 15 ? name.split(' ').map(w => w[0]).join('') : name,
    faculty: info.faculty,
    initials: info.faculty.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3),
    credits: info.type === 'Lab' ? 2 : 4,
    weeklyHours: info.count,
    type: info.type,
    room: info.room,
    attendedClasses: Math.round(info.count * 3),
    totalClasses: Math.round(info.count * 4)
  }));

  const faculty = Array.from(facultyMap.entries()).map(([teacherName, subs], idx) => ({
    id: `fac-${idx + 1}`,
    name: teacherName,
    initials: teacherName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3),
    designation: 'Faculty Instructor',
    subjects: Array.from(subs)
  }));

  const batches = Array.from(detectedBatches).map((batchId, idx) => ({
    id: batchId,
    name: `Batch ${batchId}`,
    rollRange: `Allotment ${idx + 1}`
  }));

  // Attempt header metadata detection from top lines
  let institution = '';
  let branch = '';
  let semester = '';
  let section = '';

  for (const l of lines.slice(0, 6)) {
    if (/university|institute|college|school/i.test(l) && !institution) institution = l;
    if (/computer|engineering|science|arts|technology|aids|cse|it|mech/i.test(l) && !branch) branch = l;
    if (/sem|semester|\b\d+(?:st|nd|rd|th)\b/i.test(l) && !semester) semester = l;
    if (/division|section|div|sec/i.test(l) && !section) section = l;
  }

  const guidelines = lines.filter(l => /attendance|rule|dress|recess|mandatory|notice|contact/i.test(l));

  const now = new Date().toISOString();
  return {
    metadata: {
      id: 'tt_' + Date.now(),
      title: branch || institution || 'Imported Academic Timetable',
      institution: institution || 'Academic Institute',
      branch: branch || 'Department of Engineering',
      semester: semester || 'Current Semester',
      section: section || 'Division 1',
      createdAt: now,
      updatedAt: now
    },
    availableBatches: Array.from(detectedBatches),
    subjects,
    faculty,
    batches,
    guidelines: guidelines.length > 0 ? guidelines : [
      'Minimum 75% attendance required for semester examinations.',
      'Always refer to the official notice board for last-minute room adjustments.'
    ],
    days: daysData
  };
}
