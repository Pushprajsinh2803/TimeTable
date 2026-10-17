import type { TimetableData, SubjectDetail, FacultyDetail, BatchDetail, ExamItem } from '../types';

export const SYSTEM_PROMPT = `Analyze the timetable image/document. Extract all academic data into strict raw JSON:
{
  "metadata": {
    "title": "Course / Branch / Sem",
    "institution": "University / Institute name",
    "branch": "Branch name",
    "semester": "Semester",
    "section": "Section / Division (e.g. QC 1)",
    "baseRoom": "Classroom",
    "classCoordinator": "Coordinator name",
    "effectiveDate": "w.e.f date"
  },
  "availableBatches": ["Batch 1", "Batch 2"],
  "subjects": [
    {
      "code": "Course Code",
      "name": "Full Course Name",
      "faculty": "Faculty Name",
      "initials": "Initials",
      "credits": 4,
      "weeklyHours": 4,
      "type": "Lecture"
    }
  ],
  "faculty": [
    {
      "id": "fac-1",
      "name": "Faculty Name",
      "initials": "Initials",
      "subjects": ["Subject"]
    }
  ],
  "batches": [
    {
      "id": "Batch 1",
      "name": "Batch Name",
      "rollRange": "Roll numbers"
    }
  ],
  "exams": [],
  "guidelines": [],
  "days": {
    "monday": [
      {
        "id": "mon-1",
        "start": "09:00",
        "end": "10:00",
        "subject": "Subject Name",
        "type": "Lecture",
        "room": "Room",
        "teacher": "Teacher",
        "code": "Code",
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
Rules:
- Types: Lecture, Lab, Tutorial, Break, Exam.
- Start and end times in 24hr or 12hr format.
- Output ONLY valid JSON with no markdown wrapping.`;

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
