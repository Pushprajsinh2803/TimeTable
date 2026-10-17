import type { TimetableData, SubjectDetail, FacultyDetail, BatchDetail, ExamItem } from '../types';

export const SYSTEM_PROMPT = `You are an expert university academic timetable parsing engine.
Analyze the timetable image or PDF document. Extract all academic data into strict, valid JSON matching this schema:

{
  "metadata": {
    "title": "Full Academic Title (e.g. 1B_CSE AIDS 6 — B.Tech CSE (AI & Data Science))",
    "institution": "University / Institute name (e.g. Parul Institute of Engineering & Technology, Parul University)",
    "branch": "Branch name (e.g. B.Tech Computer Science Engineering Artificial Intelligence with Data Science)",
    "semester": "Semester (e.g. 1st Semester)",
    "section": "Section or Division (e.g. 1B_CSE-AIDS 6)",
    "academicYear": "Academic Year (e.g. 2026-27)",
    "baseRoom": "Base Classroom (e.g. N-108, N-109)",
    "classCoordinator": "Time Table Coordinators (e.g. Dr. Manish R. Betheja & Dr. Chirag R. Trivedi)",
    "coordinatorContact": "Student Rep / MFT Email (e.g. mohdmaaz.shaikh34635@paruluniversity.ac.in)",
    "effectiveDate": "Effective from date (e.g. 20-07-2026)"
  },
  "availableBatches": ["1", "2"],
  "subjects": [
    {
      "code": "Course Code (e.g. 03010501PC01)",
      "name": "Full Course Name (e.g. Web Designing)",
      "shortName": "Short Code (e.g. WD Lecture)",
      "faculty": "FULL Faculty Name (e.g. BINISHA MAKWANA)",
      "initials": "Initials (e.g. BM)",
      "credits": 4,
      "weeklyHours": 5,
      "type": "Lecture",
      "room": "Room / Lab venue"
    }
  ],
  "faculty": [
    {
      "id": "fac-1",
      "name": "Full Faculty Name with Title (e.g. Dr. NILESH KUMAR JAIN, BINISHA MAKWANA, Banoth Ravindar, Mahit Jain, Rahul Moud, Mrs. Sonal Tiwari)",
      "initials": "Initials (e.g. NKJ, BM, BR, MJ, RM, ST)",
      "designation": "Designation if present",
      "subjects": ["Subjects or labs taught by this teacher"],
      "email": "Official email ID (e.g. binisaben.makwana31526@paruluniversity.ac.in)",
      "cabin": "Cabin / Lab location if present"
    }
  ],
  "batches": [
    {
      "id": "1",
      "name": "Batch 1 (1B_CSE-AIDS 6.1)"
    },
    {
      "id": "2",
      "name": "Batch 2 (1B_CSE-AIDS 6.2)"
    }
  ],
  "exams": [],
  "guidelines": [
    "Recess times: 11:20 AM - 12:20 PM (Lunch) & 02:10 PM - 02:30 PM (Tea break)",
    "Minimum 75% attendance mandatory in lectures and laboratory sessions."
  ],
  "days": {
    "monday": [
      {
        "id": "mon-1",
        "start": "09:30",
        "end": "10:25",
        "subject": "Web Designing",
        "type": "Lecture",
        "room": "N-108",
        "teacher": "BINISHA MAKWANA",
        "initials": "BM",
        "code": "03010501PC01",
        "batch": "ALL",
        "batches": []
      }
    ],
    "tuesday": [],
    "wednesday": [],
    "thursday": [],
    "friday": [],
    "saturday": [],
    "sunday": []
  }
}

PARUL UNIVERSITY TIMETABLE PATTERN SPECIFICATION & EXTRACTION RULES:

1. CELL NOTATION & DECODING RULES:
   - FORMAT A: Lecture for Full Class:
     Syntax: "<DIVISION>:<SUBJECT_SHORT>:(<STAFF_INITIALS>):<ROOM>"
     Examples:
     • "CSE-AIDS 6:WD:(BM):N-108" ->
       Subject: "Web Designing" (Short: "WD"), Teacher: "BINISHA MAKWANA" (Initials: "BM"), Room: "N-108", Type: "Lecture"
     • "CSE-AIDS 6:PPS:(NKJ):N-107" ->
       Subject: "Programming for Problem Solving" (Short: "PPS"), Teacher: "Dr. NILESH KUMAR JAIN" (Initials: "NKJ"), Room: "N-107", Type: "Lecture"
     • "CSE-AIDS 6:EEE:(MJ):N-108" ->
       Subject: "Electrical and Electronics Engineering", Teacher: "Mahit Jain" (Initials: "MJ"), Room: "N-108", Type: "Lecture"
     • "CSE-AIDS 6:PE:(RM):N-108" ->
       Subject: "Prompt Engineering", Teacher: "Rahul Moud" (Initials: "RM"), Room: "N-108", Type: "Lecture"
     • "CSE-AIDS 6:Calculus:(L1):N-108" ->
       Subject: "Calculus", Teacher: "Calculus Faculty (L1)", Room: "N-108", Type: "Lecture"
     • "CSE-AIDS 6:PCS TUTO:(ST):N-109" ->
       Subject: "Principles of Communication Skills", Teacher: "Mrs. Sonal Tiwari" (Initials: "ST"), Room: "N-109", Type: "Tutorial"

   - FORMAT B: Lab Sessions Divided by Batch (Parallel Lab Sessions):
     Syntax: "<DIVISION>:<BATCH_NO>:<SUBJECT_SHORT>:(<STAFF_INITIALS>):<ROOM>"
     When multiple batches appear in the same slot (or 2 consecutive periods):
     Example:
       "CSE-AIDS 6:1:WD:(BR):LAB-210"
       "CSE-AIDS 6:2:EEE:(MJ):A-208"
     Extract into "batches" array:
       batches: [
         { "id": "1", "sub": "Web Designing Laboratory", "room": "LAB-210", "teacher": "Banoth Ravindar" },
         { "id": "2", "sub": "Electrical and Electronics Engineering Laboratory", "room": "A-208", "teacher": "Mahit Jain" }
       ]
     Subject for the parent item can be "Parallel Lab Session (Batches 1 & 2)".

   - FORMAT C: Recess & Free Study Blocks:
     • "LIBRARY/SELF STUDY" or "CSE-AIDS 6:1:LIBRARY/SELF STUDY" -> Type: "Break", Subject: "Library / Self Study"
     • "RECESS TIME: 11:20 - 12:20" -> Type: "Break", Subject: "Recess (Lunch Break)"
     • "RECESS TIME: 02:10 - 02:30" -> Type: "Break", Subject: "Recess (Tea Break)"
     • "HOLIDAY" -> Type: "Break", Subject: "Holiday"

2. BOTTOM LEGEND TABLE (7 COLUMNS):
   University circulars have a 7-column table at the bottom:
   "SUBJECT CODE | SUJECT INITIALS | SUBJECT FULL NAME | STAFF INITIALS | STAFF NAME | STAFF EMAIL ID | MIS ID"
   • You MUST extract EVERY row in this table.
   • Map each staff member's INITIALS to their FULL NAME and OFFICIAL EMAIL ID.
   • Populate "faculty":
     [
       { "id": "fac-1", "name": "BINISHA MAKWANA", "initials": "BM", "email": "binisaben.makwana31526@paruluniversity.ac.in", "subjects": ["Web Designing"] },
       { "id": "fac-2", "name": "Banoth Ravindar", "initials": "BR", "email": "ravindar.banoth33153@paruluniversity.ac.in", "subjects": ["Web Designing Laboratory"] },
       { "id": "fac-3", "name": "Mahit Jain", "initials": "MJ", "email": "mahit.jain30359@paruluniversity.ac.in", "subjects": ["Electrical and Electronics Engineering"] },
       { "id": "fac-4", "name": "Dr. NILESH KUMAR JAIN", "initials": "NKJ", "email": "nilesh.jain38400@paruluniversity.ac.in", "subjects": ["Programming for Problem Solving"] },
       { "id": "fac-5", "name": "Rahul Moud", "initials": "RM", "email": "rahulkumar.moud32628@paruluniversity.ac.in", "subjects": ["Prompt Engineering"] },
       { "id": "fac-6", "name": "Mrs. Sonal Tiwari", "initials": "ST", "email": "sonal.tiwari47018@paruluniversity.ac.in", "subjects": ["Principles of Communication Skills"] }
     ]

3. METADATA EXTRACTION:
   - Extract Time Table Coordinators (e.g. Dr. Manish R. Betheja, Dr. Chirag R. Trivedi)
   - Extract Class Representative (e.g. SHAIKH MOHD MAAZ NAIMODDIN, email: mohdmaaz.shaikh34635@paruluniversity.ac.in)
   - Extract base classrooms (N-108, N-109) and lab rooms (LAB-209, LAB-210, LAB-212, A-204, A-208).

4. STRICT OUTPUT REQUIREMENT:
   Output ONLY valid JSON matching this schema. No markdown backticks, no conversational preamble.`;

/**
 * Optimizes an image client-side before sending to Gemini:
 * Rescales to max 1400px and compresses to JPEG ~0.8 quality.
 * Shrinks 10-15MB smartphone photos to ~150KB for 100x faster network upload!
 */
export async function optimizeImageForAi(file: File): Promise<{ base64: string; mimeType: string }> {
  // If PDF, read directly
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        const match = res.match(/^data:(.*);base64,(.*)$/);
        if (match) resolve({ mimeType: match[1], base64: match[2] });
        else reject(new Error('Failed to read PDF'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      const maxDim = 1400; // Optimal for text reading with minimal byte weight
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // High quality JPEG compression (typically 120KB - 200KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        const match = compressedDataUrl.match(/^data:(.*);base64,(.*)$/);
        if (match) {
          resolve({ mimeType: 'image/jpeg', base64: match[2] });
          return;
        }
      }

      // Fallback if canvas fails
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        const match = res.match(/^data:(.*);base64,(.*)$/);
        resolve({ mimeType: match ? match[1] : file.type, base64: match ? match[2] : '' });
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        const match = res.match(/^data:(.*);base64,(.*)$/);
        resolve({ mimeType: match ? match[1] : file.type, base64: match ? match[2] : '' });
      };
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

export async function extractTimetableFromImage(
  base64Data: string,
  mimeType: string,
  apiKey?: string
): Promise<TimetableData> {
  const effectiveKey = (apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim();
  if (!effectiveKey) {
    throw new Error('Missing Gemini API key. Add VITE_GEMINI_API_KEY to your .env file to enable instant AI parsing.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${effectiveKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: SYSTEM_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.1,
      max_output_tokens: 4000
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI Extraction failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("No timetable content could be recognized in the document.");
  }

  // Clean backticks
  const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanedText);

  // Normalize structure
  const now = new Date().toISOString();

  const rawSubjects: SubjectDetail[] = parsed.subjects || [];
  const rawFaculty: FacultyDetail[] = parsed.faculty || [];
  const rawBatches: BatchDetail[] = parsed.batches || [];
  const exams: ExamItem[] = parsed.exams || [];
  const guidelines: string[] = parsed.guidelines || [];

  // Build bidirectional lookup dictionary for initials -> full faculty name
  const initialsToName = new Map<string, string>();
  const nameToInitials = new Map<string, string>();

  rawFaculty.forEach(f => {
    if (f.initials && f.name) {
      initialsToName.set(f.initials.trim().toUpperCase(), f.name.trim());
      nameToInitials.set(f.name.trim().toLowerCase(), f.initials.trim());
    }
  });

  rawSubjects.forEach(s => {
    if (s.initials && s.faculty) {
      initialsToName.set(s.initials.trim().toUpperCase(), s.faculty.trim());
    }
  });

  const rawDays = parsed.days || {};
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  // Process days and resolve all teacher initials to full names
  const normalizedDays: Record<string, any[]> = {};
  const discoveredFaculty = new Map<string, { name: string; initials: string; subjects: Set<string> }>();

  // Pre-seed discovered faculty with existing faculty list
  rawFaculty.forEach(f => {
    if (f.name) {
      discoveredFaculty.set(f.name.trim().toLowerCase(), {
        name: f.name.trim(),
        initials: f.initials || '',
        subjects: new Set(f.subjects || [])
      });
    }
  });

  // Known standard subject code map for Parul University & AI-DS
  const puSubjectMap: Record<string, string> = {
    'WD': 'Web Designing',
    'WD LECTURE': 'Web Designing',
    'WD LAB': 'Web Designing Laboratory',
    'EEE': 'Electrical and Electronics Engineering',
    'EEE LECTURE': 'Electrical and Electronics Engineering',
    'EEE LAB': 'Electrical and Electronics Engineering Laboratory',
    'PPS': 'Programming for Problem Solving',
    'PPS LECTURE': 'Programming for Problem Solving',
    'PPS LAB': 'Programming for Problem Solving Laboratory',
    'PE': 'Prompt Engineering',
    'PCS': 'Principles of Communication Skills',
    'PCS TUTO': 'Principles of Communication Skills (Tutorial)',
    'CALCULUS': 'Calculus'
  };

  for (const day of dayKeys) {
    const items: any[] = rawDays[day] || [];
    normalizedDays[day] = items.map((item, idx) => {
      let resolvedSubject = (item.subject || 'Lecture').trim();
      let resolvedRoom = (item.room || '').trim();
      let resolvedTeacher = (item.teacher || '').trim();
      let resolvedInitials = (item.initials || '').trim();

      // Check if subject is raw PU cell syntax: "CSE-AIDS 6:WD:(BM):N-108"
      const cellMatch = resolvedSubject.match(/^(?:[A-Za-z0-9\-_ ]+):([A-Za-z0-9\-_ /]+):\(([A-Za-z0-9]+)\):([A-Za-z0-9\-_]+)$/i);
      if (cellMatch) {
        const [, subCode, inits, rm] = cellMatch;
        resolvedSubject = subCode.trim();
        if (!resolvedInitials) resolvedInitials = inits.trim();
        if (!resolvedRoom) resolvedRoom = rm.trim();
      }

      // Check if subject is an abbreviation from the legend
      const upperSub = resolvedSubject.toUpperCase();
      if (puSubjectMap[upperSub]) {
        resolvedSubject = puSubjectMap[upperSub];
      }

      // Check if teacher is just initials (e.g. 2-5 uppercase chars)
      const isTeacherInitials = /^[A-Z]{2,5}$/.test(resolvedTeacher);
      if (isTeacherInitials && !resolvedInitials) {
        resolvedInitials = resolvedTeacher;
      }

      // Cross-reference initials to find full teacher name
      if (resolvedInitials && initialsToName.has(resolvedInitials.toUpperCase())) {
        resolvedTeacher = initialsToName.get(resolvedInitials.toUpperCase())!;
      } else if (isTeacherInitials && initialsToName.has(resolvedTeacher.toUpperCase())) {
        resolvedTeacher = initialsToName.get(resolvedTeacher.toUpperCase())!;
      }

      // If we have a full teacher name, keep track of it for faculty directory
      if (resolvedTeacher && !isTeacherInitials) {
        const key = resolvedTeacher.toLowerCase();
        if (!discoveredFaculty.has(key)) {
          discoveredFaculty.set(key, {
            name: resolvedTeacher,
            initials: resolvedInitials,
            subjects: new Set()
          });
        }
        if (resolvedSubject) {
          discoveredFaculty.get(key)!.subjects.add(resolvedSubject);
        }
      }

      // Resolve batches inside lab periods
      const resolvedBatches = Array.isArray(item.batches)
        ? item.batches.map((b: any) => {
            let bSub = (b.sub || resolvedSubject || 'Practical').trim();
            let bRoom = (b.room || resolvedRoom || '').trim();
            let bTeacher = (b.teacher || '').trim();
            let bInitials = (b.initials || '').trim();
            let bId = (b.id || 'Batch').trim();

            // Deconstruct batch string if raw e.g. "CSE-AIDS 6:1:WD:(BR):LAB-210"
            const bCellMatch = bSub.match(/^(?:[A-Za-z0-9\-_ ]+):(\d+):([A-Za-z0-9\-_ /]+):\(([A-Za-z0-9]+)\):([A-Za-z0-9\-_]+)$/i);
            if (bCellMatch) {
              const [, batchNo, subCode, inits, rm] = bCellMatch;
              bId = batchNo;
              bSub = subCode.trim();
              bInitials = inits.trim();
              bRoom = rm.trim();
            }

            if (puSubjectMap[bSub.toUpperCase()]) {
              bSub = puSubjectMap[bSub.toUpperCase()];
            }

            if (/^[A-Z]{2,5}$/.test(bTeacher) && !bInitials) {
              bInitials = bTeacher;
            }
            if (bInitials && initialsToName.has(bInitials.toUpperCase())) {
              bTeacher = initialsToName.get(bInitials.toUpperCase())!;
            }
            if (bTeacher) {
              const bKey = bTeacher.toLowerCase();
              if (!discoveredFaculty.has(bKey)) {
                discoveredFaculty.set(bKey, {
                  name: bTeacher,
                  initials: bInitials,
                  subjects: new Set([bSub])
                });
              } else if (bSub) {
                discoveredFaculty.get(bKey)!.subjects.add(bSub);
              }
            }
            return {
              id: bId,
              sub: bSub,
              room: bRoom,
              teacher: bTeacher || resolvedTeacher
            };
          })
        : [];

      return {
        id: item.id || `${day}-${idx + 1}`,
        start: item.start || '09:00',
        end: item.end || '10:00',
        subject: resolvedSubject,
        type: item.type || (resolvedSubject.toLowerCase().includes('lab') ? 'Lab' : 'Lecture'),
        room: resolvedRoom,
        teacher: resolvedTeacher,
        initials: resolvedInitials,
        code: item.code || '',
        notes: item.notes || '',
        batch: item.batch || 'ALL',
        batches: resolvedBatches
      };
    });
  }

  // Synthesize rich faculty list if raw faculty was empty or incomplete
  const finalFaculty: FacultyDetail[] = Array.from(discoveredFaculty.values()).map((f, i) => ({
    id: `fac-${i + 1}`,
    name: f.name,
    initials: f.initials,
    subjects: Array.from(f.subjects)
  }));

  // Ensure subjects have full faculty names resolved
  const finalSubjects: SubjectDetail[] = rawSubjects.map(s => {
    let facultyName = s.faculty || '';
    if (s.initials && initialsToName.has(s.initials.toUpperCase())) {
      facultyName = initialsToName.get(s.initials.toUpperCase())!;
    }
    return {
      code: s.code || '',
      name: s.name || '',
      shortName: s.shortName || s.name || '',
      faculty: facultyName,
      initials: s.initials || '',
      credits: s.credits || 4,
      weeklyHours: s.weeklyHours || 4,
      type: s.type || 'Lecture',
      room: s.room || '',
      attendedClasses: s.attendedClasses || 0,
      totalClasses: s.totalClasses || 0
    };
  });

  const availableBatches: string[] = parsed.availableBatches && parsed.availableBatches.length > 0
    ? parsed.availableBatches
    : (rawBatches.length > 0 ? rawBatches.map(b => b.id) : ['ALL']);

  const timetable: TimetableData = {
    metadata: {
      id: 'tt_' + Date.now(),
      title: parsed.metadata?.title || 'Academic Timetable',
      institution: parsed.metadata?.institution || '',
      branch: parsed.metadata?.branch || '',
      semester: parsed.metadata?.semester || '',
      section: parsed.metadata?.section || '',
      academicYear: parsed.metadata?.academicYear || '',
      classCoordinator: parsed.metadata?.classCoordinator || '',
      coordinatorContact: parsed.metadata?.coordinatorContact || '',
      baseRoom: parsed.metadata?.baseRoom || '',
      effectiveDate: parsed.metadata?.effectiveDate || '',
      createdAt: now,
      updatedAt: now
    },
    availableBatches,
    subjects: finalSubjects,
    faculty: finalFaculty.length > 0 ? finalFaculty : rawFaculty,
    batches: rawBatches,
    exams,
    guidelines,
    days: normalizedDays as Record<any, any>
  };

  return timetable;
}
