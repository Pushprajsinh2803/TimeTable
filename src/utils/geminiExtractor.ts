import type { TimetableData, SubjectDetail, FacultyDetail, BatchDetail, ExamItem } from '../types';

export const SYSTEM_PROMPT = `You are an expert university academic timetable parsing engine.
Analyze the timetable image or PDF document. Extract all academic data into strict, valid JSON matching this schema:

{
  "metadata": {
    "title": "Full Academic Title (e.g. B.Tech Computer Science & AI-DS Sem 6)",
    "institution": "University / Institute name (e.g. Parul Institute of Engineering & Technology)",
    "branch": "Branch name (e.g. Computer Science & AI-DS)",
    "semester": "Semester (e.g. 6th Semester)",
    "section": "Section or Division (e.g. Division QC 1)",
    "academicYear": "Academic Year (e.g. 2026-27)",
    "baseRoom": "Base Classroom (e.g. Room N-207, Block A)",
    "classCoordinator": "Class Coordinator / Faculty Mentor Name",
    "coordinatorContact": "Coordinator Email or Phone",
    "effectiveDate": "w.e.f Date (e.g. 15 Jan 2026)"
  },
  "availableBatches": ["QC 1.1", "QC 1.2"],
  "subjects": [
    {
      "code": "Course Code (e.g. 303105342)",
      "name": "Full Course Name (e.g. Natural Language Processing)",
      "shortName": "Short Code (e.g. NLP)",
      "faculty": "FULL Faculty Name (e.g. Dr. Priya Sharma)",
      "initials": "Initials (e.g. PS)",
      "credits": 4,
      "weeklyHours": 5,
      "type": "Lecture",
      "room": "Room / Lab venue"
    }
  ],
  "faculty": [
    {
      "id": "fac-1",
      "name": "Full Faculty Name with Title (e.g. Dr. Nilesh Kumar Jain, Prof. Rajesh N. Salvi)",
      "initials": "Initials (e.g. NKJ, RNS)",
      "designation": "Designation (e.g. Associate Professor / Assistant Professor)",
      "subjects": ["Subjects or labs taught by this teacher"],
      "email": "Official email if present",
      "cabin": "Cabin / Office location if present"
    }
  ],
  "batches": [
    {
      "id": "QC 1.1",
      "name": "Batch 1 (QC 1.1)",
      "rollRange": "Roll numbers if mentioned",
      "baseLab": "Assigned lab if mentioned"
    }
  ],
  "exams": [
    {
      "id": "exam-1",
      "date": "24 Sep 2026",
      "time": "02:45 PM – 04:15 PM",
      "subject": "Subject Name",
      "code": "Course Code",
      "room": "Exam Room"
    }
  ],
  "guidelines": [
    "Important circular guideline or notice (e.g. 75% attendance mandatory, reporting time, lab rules)"
  ],
  "days": {
    "monday": [
      {
        "id": "mon-1",
        "start": "09:30",
        "end": "10:30",
        "subject": "Subject Name",
        "type": "Lecture",
        "room": "Room N-207",
        "teacher": "FULL Faculty Name (NOT just initials!)",
        "initials": "Initials (e.g. RNS)",
        "code": "Course Code",
        "batch": "ALL",
        "batches": [
          {
            "id": "QC 1.1",
            "sub": "NLP Lab",
            "room": "Lab 3",
            "teacher": "FULL Faculty Name"
          },
          {
            "id": "QC 1.2",
            "sub": "CV Lab",
            "room": "Lab 5",
            "teacher": "FULL Faculty Name"
          }
        ]
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

CRITICAL EXTRACTION RULES:
1. FACULTY MAPPING IS MANDATORY:
   - In university timetable circulars, table cells often have short initials (e.g. RNS, ZJ, RM, NKJ, SP, BR, AP).
   - AT THE BOTTOM, FOOTER, OR SIDE OF THE DOCUMENT, there is ALWAYS a Faculty Legend / Subject Table that maps these initials to their FULL names (e.g. RNS -> Prof. Rajesh Narendra Salvi).
   - YOU MUST CROSS-REFERENCE every cell's teacher initials with this legend table and populate the full teacher name in the "teacher" field!
   - NEVER leave "teacher" empty or blank if initials or names exist in the cell or legend. If no full name is found, put the initials in "teacher".
   - Extract ALL faculty members found in the legend into the "faculty" array.
2. SUBJECTS LIST:
   - Extract all courses with code, full name, credits, and faculty.
3. LAB BATCH ALLOCATIONS:
   - When a slot is divided into batches (e.g. Batch 1 / Batch 2 or QC 1.1 / QC 1.2), extract each sub-session in the "batches" array with its respective room, subject, and teacher.
4. TIME FORMATS:
   - Use standard 24h format (e.g. "09:30", "14:15") or 12h format (e.g. "09:30 AM", "02:15 PM").
5. OUTPUT:
   - Output ONLY valid JSON. No conversational text, no markdown backticks, no explanations.`;

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

  for (const day of dayKeys) {
    const items: any[] = rawDays[day] || [];
    normalizedDays[day] = items.map((item, idx) => {
      let resolvedTeacher = (item.teacher || '').trim();
      let resolvedInitials = (item.initials || '').trim();

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
        if (item.subject) {
          discoveredFaculty.get(key)!.subjects.add(item.subject);
        }
      }

      // Resolve batches inside lab periods
      const resolvedBatches = Array.isArray(item.batches)
        ? item.batches.map((b: any) => {
            let bTeacher = (b.teacher || '').trim();
            const bInitials = /^[A-Z]{2,5}$/.test(bTeacher) ? bTeacher : '';
            if (bInitials && initialsToName.has(bInitials.toUpperCase())) {
              bTeacher = initialsToName.get(bInitials.toUpperCase())!;
            }
            if (bTeacher) {
              const bKey = bTeacher.toLowerCase();
              if (!discoveredFaculty.has(bKey)) {
                discoveredFaculty.set(bKey, {
                  name: bTeacher,
                  initials: bInitials,
                  subjects: new Set([b.sub || item.subject])
                });
              } else if (b.sub) {
                discoveredFaculty.get(bKey)!.subjects.add(b.sub);
              }
            }
            return {
              id: b.id || 'Batch',
              sub: b.sub || item.subject || 'Practical',
              room: b.room || item.room || '',
              teacher: bTeacher || resolvedTeacher
            };
          })
        : [];

      return {
        id: item.id || `${day}-${idx + 1}`,
        start: item.start || '09:00',
        end: item.end || '10:00',
        subject: item.subject || 'Lecture',
        type: item.type || 'Lecture',
        room: item.room || '',
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
