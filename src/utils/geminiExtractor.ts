import type { TimetableData, SubjectDetail, FacultyDetail, BatchDetail, ExamItem } from '../types';

export const SYSTEM_PROMPT = `You are an expert academic timetable document intelligence parser.
Your task is to analyze the uploaded timetable image or document and extract ALL academic data present on the sheet, including schedule, subject directory, faculty details, lab batch allotments, classroom numbers, and circular guidelines.

Output MUST be ONLY valid raw JSON matching this exact schema:
{
  "metadata": {
    "title": "Full Schedule Title (e.g. B.Tech AI & Data Science Sem 6)",
    "institution": "University / College / Institute Name",
    "branch": "Branch or Department (e.g. Computer Science / AI-DS)",
    "semester": "Semester (e.g. 6th Sem)",
    "section": "Division or Section (e.g. QC 1)",
    "academicYear": "Academic Year if listed (e.g. 2026-27)",
    "classCoordinator": "Class Coordinator / Counselor Faculty Name if mentioned",
    "coordinatorContact": "Coordinator email or phone if mentioned",
    "baseRoom": "Base Classroom (e.g. N-207)",
    "effectiveDate": "Effective Date / w.e.f. date"
  },
  "availableBatches": ["QC 1.1", "QC 1.2"],
  "subjects": [
    {
      "code": "AIDS-601",
      "name": "Natural Language Processing",
      "shortName": "NLP",
      "faculty": "Dr. Priya Sharma",
      "initials": "PS",
      "credits": 4,
      "weeklyHours": 5,
      "type": "Lecture",
      "room": "Lab 402"
    }
  ],
  "faculty": [
    {
      "id": "fac-1",
      "name": "Dr. Priya Sharma",
      "initials": "PS",
      "designation": "Assistant Professor",
      "subjects": ["Natural Language Processing"],
      "cabin": "Cabin 210"
    }
  ],
  "batches": [
    {
      "id": "QC 1.1",
      "name": "Batch 1",
      "rollRange": "Roll 1 - 35",
      "baseLab": "Lab 3"
    }
  ],
  "exams": [
    {
      "id": "ex-1",
      "date": "24-Oct-2026",
      "time": "02:00 PM - 04:00 PM",
      "subject": "Natural Language Processing",
      "code": "AIDS-601",
      "room": "Exam Block"
    }
  ],
  "guidelines": [
    "Minimum 75% attendance required",
    "Lab journals must be signed weekly"
  ],
  "days": {
    "monday": [
      {
        "id": "mon-1",
        "start": "09:00",
        "end": "10:00",
        "subject": "Natural Language Processing",
        "type": "Lecture",
        "room": "Room 402",
        "teacher": "Dr. Priya Sharma",
        "code": "AIDS-601",
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

Do NOT include markdown backticks like \`\`\`json. Output ONLY raw parseable JSON.`;

export async function extractTimetableFromImage(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<TimetableData> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`;

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
      temperature: 0.1
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

  // Auto-synthesize subjects and faculty if AI omitted them
  const subjects: SubjectDetail[] = parsed.subjects || [];
  const faculty: FacultyDetail[] = parsed.faculty || [];
  const batches: BatchDetail[] = parsed.batches || [];
  const exams: ExamItem[] = parsed.exams || [];
  const guidelines: string[] = parsed.guidelines || [];

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
    availableBatches: parsed.availableBatches || [],
    subjects,
    faculty,
    batches,
    exams,
    guidelines,
    days: {
      monday: parsed.days?.monday || [],
      tuesday: parsed.days?.tuesday || [],
      wednesday: parsed.days?.wednesday || [],
      thursday: parsed.days?.thursday || [],
      friday: parsed.days?.friday || [],
      saturday: parsed.days?.saturday || [],
      sunday: parsed.days?.sunday || []
    }
  };

  return timetable;
}
