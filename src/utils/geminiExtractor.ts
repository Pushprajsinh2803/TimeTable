import type { TimetableData } from '../types';

export const SYSTEM_PROMPT = `You are an expert academic timetable parser.
Your task is to analyze the uploaded timetable image/document and convert it into a strict, structured JSON timetable object.

Strict Rules:
1. Days: monday, tuesday, wednesday, thursday, friday, saturday, sunday (lowercase).
2. Time Format: Format start and end times clearly in 24-hour HH:mm (e.g., "09:00", "13:30") or 12-hour (e.g. "09:00 AM", "01:30 PM").
3. Class Types: One of "Lecture", "Lab", "Tutorial", "Break", "Exam", "Other".
4. Batches: If a lab or session is divided into batches (e.g. "Batch A / Batch B" or "QC 1.1 / QC 1.2"), extract them into the 'batches' array with their respective subjects, rooms, and teachers. If no batch division, leave batches empty or null.
5. Output MUST be ONLY valid raw JSON matching this schema:
{
  "metadata": {
    "title": "Semester / Class Name (e.g. B.Tech AIDS Sem 6)",
    "institution": "College or University Name",
    "branch": "Branch/Department",
    "semester": "Semester number or name",
    "section": "Section name if present"
  },
  "availableBatches": ["Batch 1", "Batch 2"],
  "days": {
    "monday": [
      {
        "id": "mon-1",
        "start": "09:00",
        "end": "10:00",
        "subject": "Deep Learning",
        "type": "Lecture",
        "room": "Room 402",
        "teacher": "Dr. Sharma",
        "code": "CS601",
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
Do NOT include markdown backticks like \`\`\`json. Output ONLY the parseable JSON string.`;

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

  // Clean any stray backticks if returned
  const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanedText);

  // Normalize structure
  const now = new Date().toISOString();
  const timetable: TimetableData = {
    metadata: {
      id: 'tt_' + Date.now(),
      title: parsed.metadata?.title || 'Imported Schedule',
      institution: parsed.metadata?.institution || '',
      branch: parsed.metadata?.branch || '',
      semester: parsed.metadata?.semester || '',
      section: parsed.metadata?.section || '',
      createdAt: now,
      updatedAt: now
    },
    availableBatches: parsed.availableBatches || [],
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
