import type { TimetableData } from '../types';

export const DEMO_TIMETABLE: TimetableData = {
  metadata: {
    id: 'demo-aids-sem6',
    title: 'B.Tech AI & Data Science (Sem 6)',
    institution: 'Parul Institute of Engineering & Technology',
    branch: 'Computer Science & AI-DS',
    semester: '6th Semester',
    section: 'Division QC 1',
    academicYear: '2026-27',
    classCoordinator: 'Dr. Nilesh Kumar Jain',
    coordinatorContact: 'nilesh.jain@paruluniversity.ac.in',
    baseRoom: 'N-207 (Block A)',
    effectiveDate: 'w.e.f. 15 Jan 2026',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  availableBatches: ['QC 1.1', 'QC 1.2'],
  subjects: [
    {
      code: 'AIDS-601',
      name: 'Natural Language Processing',
      shortName: 'NLP',
      faculty: 'Dr. Priya Sharma',
      initials: 'PS',
      credits: 4,
      weeklyHours: 5,
      type: 'Lecture',
      room: 'Lab 402',
      attendedClasses: 18,
      totalClasses: 22
    },
    {
      code: 'AIDS-602',
      name: 'Computer Vision & Deep Learning',
      shortName: 'CV-DL',
      faculty: 'Prof. Kushal Verma',
      initials: 'KV',
      credits: 4,
      weeklyHours: 5,
      type: 'Lecture',
      room: 'Audi-2',
      attendedClasses: 20,
      totalClasses: 24
    },
    {
      code: 'CS-603',
      name: 'Cloud Computing & DevOps',
      shortName: 'Cloud',
      faculty: 'Dr. Rajesh Mehta',
      initials: 'RM',
      credits: 3,
      weeklyHours: 4,
      type: 'Lecture',
      room: 'LH-101',
      attendedClasses: 15,
      totalClasses: 18
    },
    {
      code: 'AIDS-604',
      name: 'Big Data Analytics',
      shortName: 'BDA',
      faculty: 'Prof. Anand Patel',
      initials: 'AP',
      credits: 4,
      weeklyHours: 4,
      type: 'Lecture',
      room: 'LH-101',
      attendedClasses: 16,
      totalClasses: 20
    },
    {
      code: 'AIDS-605',
      name: 'Practical Lab Session',
      shortName: 'Lab Practical',
      faculty: 'Lab Faculty Team',
      initials: 'LFT',
      credits: 2,
      weeklyHours: 6,
      type: 'Lab',
      room: 'Lab 3 / Lab 5',
      attendedClasses: 11,
      totalClasses: 12
    },
    {
      code: 'AIDS-606',
      name: 'Elective: Cyber Security in AI',
      shortName: 'Cyber AI',
      faculty: 'Dr. S. Nair',
      initials: 'SN',
      credits: 3,
      weeklyHours: 3,
      type: 'Lecture',
      room: 'Room 204',
      attendedClasses: 12,
      totalClasses: 15
    }
  ],
  faculty: [
    {
      id: 'fac-1',
      name: 'Dr. Nilesh Kumar Jain',
      initials: 'NKJ',
      designation: 'Associate Professor & Class Coordinator',
      subjects: ['Deep Learning', 'Capstone Mentor'],
      email: 'nilesh.jain@paruluniversity.ac.in',
      cabin: 'Block A, Cabin 304'
    },
    {
      id: 'fac-2',
      name: 'Dr. Priya Sharma',
      initials: 'PS',
      designation: 'Assistant Professor',
      subjects: ['Natural Language Processing', 'NLP Lab'],
      email: 'priya.sharma@paruluniversity.ac.in',
      cabin: 'Block A, Cabin 210'
    },
    {
      id: 'fac-3',
      name: 'Prof. Kushal Verma',
      initials: 'KV',
      designation: 'Assistant Professor',
      subjects: ['Computer Vision & Deep Learning', 'CV Lab'],
      email: 'kushal.verma@paruluniversity.ac.in',
      cabin: 'Block B, Cabin 108'
    },
    {
      id: 'fac-4',
      name: 'Dr. Rajesh Mehta',
      initials: 'RM',
      designation: 'Associate Professor',
      subjects: ['Cloud Computing & DevOps', 'DevOps Lab'],
      email: 'rajesh.mehta@paruluniversity.ac.in',
      cabin: 'Block A, Cabin 312'
    },
    {
      id: 'fac-5',
      name: 'Prof. Anand Patel',
      initials: 'AP',
      designation: 'Assistant Professor',
      subjects: ['Big Data Analytics', 'Big Data Lab'],
      email: 'anand.patel@paruluniversity.ac.in',
      cabin: 'Block B, Cabin 205'
    }
  ],
  batches: [
    {
      id: 'QC 1.1',
      name: 'Batch 1 (QC 1.1)',
      rollRange: 'Roll No. 01 to 35',
      baseLab: 'Lab 3 (NLP) / Lab 2 (Big Data)'
    },
    {
      id: 'QC 1.2',
      name: 'Batch 2 (QC 1.2)',
      rollRange: 'Roll No. 36 to 70',
      baseLab: 'Lab 5 (CV) / Lab 4 (Cloud)'
    }
  ],
  exams: [
    {
      id: 'ex-1',
      date: '24 Oct 2026',
      time: '02:00 PM - 04:00 PM',
      subject: 'Natural Language Processing',
      code: 'AIDS-601',
      room: 'Exam Hall 3',
      faculty: 'Dr. Priya Sharma'
    },
    {
      id: 'ex-2',
      date: '27 Oct 2026',
      time: '02:00 PM - 04:00 PM',
      subject: 'Computer Vision & Deep Learning',
      code: 'AIDS-602',
      room: 'Exam Hall 3',
      faculty: 'Prof. Kushal Verma'
    },
    {
      id: 'ex-3',
      date: '30 Oct 2026',
      time: '02:00 PM - 04:00 PM',
      subject: 'Cloud Computing & DevOps',
      code: 'CS-603',
      room: 'Exam Hall 1',
      faculty: 'Dr. Rajesh Mehta'
    }
  ],
  guidelines: [
    'Minimum 75% attendance is strictly enforced for exam eligibility.',
    'Lab journals and continuous assignments must be signed weekly.',
    'Wearing institute ID card is mandatory in all academic blocks.',
    'For any timetable discrepancies, contact Class Coordinator Dr. Nilesh Kumar Jain.'
  ],
  days: {
    monday: [
      {
        id: 'mon-1',
        start: '09:00',
        end: '10:00',
        subject: 'Natural Language Processing',
        type: 'Lecture',
        room: 'Lab 402',
        teacher: 'Dr. Priya Sharma',
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
        teacher: 'Prof. Kushal Verma',
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
          { id: 'QC 1.1', sub: 'NLP Lab', room: 'Lab 3', teacher: 'Dr. Priya Sharma' },
          { id: 'QC 1.2', sub: 'Computer Vision Lab', room: 'Lab 5', teacher: 'Prof. Kushal Verma' }
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
        teacher: 'Dr. Rajesh Mehta',
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
        teacher: 'Prof. Anand Patel',
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
        teacher: 'Prof. Anand Patel',
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
        teacher: 'Dr. Rajesh Mehta',
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
          { id: 'QC 1.1', sub: 'Big Data Lab', room: 'Lab 2', teacher: 'Prof. Anand Patel' },
          { id: 'QC 1.2', sub: 'Cloud & DevOps Lab', room: 'Lab 4', teacher: 'Dr. Rajesh Mehta' }
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
        teacher: 'Dr. Nilesh Kumar Jain',
        batch: 'ALL'
      }
    ],
    wednesday: [
      {
        id: 'wed-1',
        start: '09:00',
        end: '11:00',
        subject: 'Computer Vision & Deep Learning',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Prof. Kushal Verma',
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
        teacher: 'Dr. Priya Sharma',
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
        teacher: 'Dr. Rajesh Mehta',
        batch: 'ALL'
      },
      {
        id: 'thu-2',
        start: '10:00',
        end: '11:00',
        subject: 'Natural Language Processing',
        type: 'Lecture',
        room: 'LH-101',
        teacher: 'Dr. Priya Sharma',
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
          { id: 'QC 1.1', sub: 'Cloud & DevOps Lab', room: 'Lab 4', teacher: 'Dr. Rajesh Mehta' },
          { id: 'QC 1.2', sub: 'NLP Lab', room: 'Lab 3', teacher: 'Dr. Priya Sharma' }
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
        teacher: 'Prof. Anand Patel',
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
        teacher: 'Prof. Kushal Verma',
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
          { id: 'QC 1.1', sub: 'Computer Vision Lab', room: 'Lab 5', teacher: 'Prof. Kushal Verma' },
          { id: 'QC 1.2', sub: 'Big Data Lab', room: 'Lab 2', teacher: 'Prof. Anand Patel' }
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
        subject: 'Open Source Hackathon / AI Club',
        type: 'Other',
        room: 'AI Innovation Hub',
        teacher: 'Student Coordinators',
        batch: 'ALL'
      }
    ],
    sunday: []
  }
};
