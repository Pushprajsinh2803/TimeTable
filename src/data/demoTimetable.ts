import type { TimetableData } from '../types';

export const DEMO_TIMETABLE: TimetableData = {
  metadata: {
    id: 'demo-aids-sem6',
    title: 'B.Tech AI & Data Science (Sem 6)',
    institution: 'School of Technology',
    branch: 'AI & Data Science',
    semester: '6th Semester',
    section: 'QC 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  availableBatches: ['QC 1.1', 'QC 1.2'],
  days: {
    monday: [
      {
        id: 'mon-1',
        start: '09:00',
        end: '10:00',
        subject: 'Natural Language Processing',
        type: 'Lecture',
        room: 'Lab 402',
        teacher: 'Dr. P. Sharma',
        code: 'AIDS-601',
        batch: 'ALL'
      },
      {
        id: 'mon-2',
        start: '10:00',
        end: '11:00',
        subject: 'Computer Vision & Deep Learning',
        type: 'Lecture',
        room: 'Audi-2',
        teacher: 'Prof. K. Verma',
        code: 'AIDS-602',
        batch: 'ALL'
      },
      {
        id: 'mon-3',
        start: '11:00',
        end: '11:15',
        subject: 'Tea & Refreshment Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'mon-4',
        start: '11:15',
        end: '13:15',
        subject: 'Practical Lab Session',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          { id: 'QC 1.1', sub: 'NLP Lab', room: 'Lab 3', teacher: 'Dr. P. Sharma' },
          { id: 'QC 1.2', sub: 'Computer Vision Lab', room: 'Lab 5', teacher: 'Prof. K. Verma' }
        ]
      },
      {
        id: 'mon-5',
        start: '13:15',
        end: '14:00',
        subject: 'Lunch Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'mon-6',
        start: '14:00',
        end: '15:00',
        subject: 'Cloud Computing & DevOps',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Dr. R. Mehta',
        code: 'CS-603',
        batch: 'ALL'
      },
      {
        id: 'mon-7',
        start: '15:00',
        end: '16:00',
        subject: 'Big Data Analytics',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Prof. A. Patel',
        code: 'AIDS-604',
        batch: 'ALL'
      }
    ],
    tuesday: [
      {
        id: 'tue-1',
        start: '09:00',
        end: '10:00',
        subject: 'Big Data Analytics',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Prof. A. Patel',
        code: 'AIDS-604',
        batch: 'ALL'
      },
      {
        id: 'tue-2',
        start: '10:00',
        end: '11:00',
        subject: 'Cloud Computing & DevOps',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Dr. R. Mehta',
        code: 'CS-603',
        batch: 'ALL'
      },
      {
        id: 'tue-3',
        start: '11:00',
        end: '11:15',
        subject: 'Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'tue-4',
        start: '11:15',
        end: '13:15',
        subject: 'Practical Lab Session',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          { id: 'QC 1.1', sub: 'Big Data Lab', room: 'Lab 2', teacher: 'Prof. A. Patel' },
          { id: 'QC 1.2', sub: 'Cloud & DevOps Lab', room: 'Lab 4', teacher: 'Dr. R. Mehta' }
        ]
      },
      {
        id: 'tue-5',
        start: '13:15',
        end: '14:00',
        subject: 'Lunch Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'tue-6',
        start: '14:00',
        end: '16:00',
        subject: 'Industry Capstone Project',
        type: 'Tutorial',
        room: 'Project Hub',
        teacher: 'Mentor Committee',
        batch: 'ALL'
      }
    ],
    wednesday: [
      {
        id: 'wed-1',
        start: '09:00',
        end: '11:00',
        subject: 'Deep Learning & Neural Networks',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Prof. K. Verma',
        batch: 'ALL'
      },
      {
        id: 'wed-2',
        start: '11:00',
        end: '11:15',
        subject: 'Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'wed-3',
        start: '11:15',
        end: '13:15',
        subject: 'Natural Language Processing',
        type: 'Lecture',
        room: 'Audi-2',
        teacher: 'Dr. P. Sharma',
        batch: 'ALL'
      },
      {
        id: 'wed-4',
        start: '13:15',
        end: '14:00',
        subject: 'Lunch Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'wed-5',
        start: '14:00',
        end: '16:00',
        subject: 'Elective: Cyber Security in AI',
        type: 'Lecture',
        room: 'Room 204',
        teacher: 'Dr. S. Nair',
        batch: 'ALL'
      }
    ],
    thursday: [
      {
        id: 'thu-1',
        start: '09:00',
        end: '10:00',
        subject: 'Cloud Computing & DevOps',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Dr. R. Mehta',
        batch: 'ALL'
      },
      {
        id: 'thu-2',
        start: '10:00',
        end: '11:00',
        subject: 'Natural Language Processing',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Dr. P. Sharma',
        batch: 'ALL'
      },
      {
        id: 'thu-3',
        start: '11:00',
        end: '11:15',
        subject: 'Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'thu-4',
        start: '11:15',
        end: '13:15',
        subject: 'Parallel Advanced Lab',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          { id: 'QC 1.1', sub: 'Cloud & DevOps Lab', room: 'Lab 4', teacher: 'Dr. R. Mehta' },
          { id: 'QC 1.2', sub: 'NLP Lab', room: 'Lab 3', teacher: 'Dr. P. Sharma' }
        ]
      },
      {
        id: 'thu-5',
        start: '13:15',
        end: '14:00',
        subject: 'Lunch Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'thu-6',
        start: '14:00',
        end: '15:00',
        subject: 'Big Data Analytics',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Prof. A. Patel',
        batch: 'ALL'
      }
    ],
    friday: [
      {
        id: 'fri-1',
        start: '09:00',
        end: '11:00',
        subject: 'Computer Vision & Deep Learning',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Prof. K. Verma',
        batch: 'ALL'
      },
      {
        id: 'fri-2',
        start: '11:00',
        end: '11:15',
        subject: 'Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'fri-3',
        start: '11:15',
        end: '13:15',
        subject: 'Practical Lab Session',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          { id: 'QC 1.1', sub: 'Computer Vision Lab', room: 'Lab 5', teacher: 'Prof. K. Verma' },
          { id: 'QC 1.2', sub: 'Big Data Lab', room: 'Lab 2', teacher: 'Prof. A. Patel' }
        ]
      },
      {
        id: 'fri-4',
        start: '13:15',
        end: '14:00',
        subject: 'Lunch Break',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'fri-5',
        start: '14:00',
        end: '16:00',
        subject: 'Seminar & Research Presentation',
        type: 'Tutorial',
        room: 'Auditorium',
        teacher: 'Dean & Faculty Panel',
        batch: 'ALL'
      }
    ],
    saturday: [
      {
        id: 'sat-1',
        start: '09:30',
        end: '12:30',
        subject: 'Open Source Hackathon / Club Activity',
        type: 'Other',
        room: 'AI Innovation Hub',
        teacher: 'Student Coordinators',
        batch: 'ALL'
      }
    ],
    sunday: []
  }
};
