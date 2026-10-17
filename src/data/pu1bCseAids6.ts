import type { TimetableData } from '../types';

export const PU_1B_CSE_AIDS_6_TIMETABLE: TimetableData = {
  metadata: {
    id: 'pu-1b-cse-aids-6',
    title: '1B_CSE AIDS 6 — B.Tech CSE (AI & Data Science)',
    institution: 'Parul Institute of Engineering & Technology, Parul University (NAAC A++)',
    branch: 'B.Tech Computer Science Engineering (Artificial Intelligence with Data Science)',
    semester: '1st Semester (UG)',
    section: 'Division 1B_CSE-AIDS 6',
    academicYear: '2026-27',
    baseRoom: 'N-108, N-109 (Classrooms)',
    classCoordinator: 'Dr. Manish R. Betheja & Dr. Chirag R. Trivedi (Time Table Coordinators)',
    coordinatorContact: 'mohdmaaz.shaikh34635@paruluniversity.ac.in (MFT: SHAIKH MOHD MAAZ NAIMODDIN)',
    effectiveDate: 'w.e.f. 20-07-2026',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  availableBatches: ['1', '2'],
  batches: [
    {
      id: '1',
      name: 'Batch 1 (1B_CSE-AIDS 6.1)',
      baseLab: 'LAB-210 (WD), A-204 (EEE), LAB-207 (PPS)'
    },
    {
      id: '2',
      name: 'Batch 2 (1B_CSE-AIDS 6.2)',
      baseLab: 'LAB-210 (WD), A-208 (EEE), LAB-212 (PPS)'
    }
  ],
  subjects: [
    {
      code: '03019101BS01',
      name: 'Calculus',
      shortName: 'Calculus',
      faculty: 'Calculus Faculty (L1)',
      initials: 'L1',
      credits: 4,
      weeklyHours: 4,
      type: 'Lecture',
      room: 'N-108 / N-109',
      attendedClasses: 18,
      totalClasses: 20
    },
    {
      code: '03010501PC01',
      name: 'Web Designing',
      shortName: 'WD Lecture',
      faculty: 'BINISHA MAKWANA',
      initials: 'BM',
      credits: 4,
      weeklyHours: 3,
      type: 'Lecture',
      room: 'N-108',
      attendedClasses: 14,
      totalClasses: 15
    },
    {
      code: '03010501PC01',
      name: 'Web Designing Laboratory',
      shortName: 'WD Lab',
      faculty: 'Banoth Ravindar',
      initials: 'BR',
      credits: 2,
      weeklyHours: 4,
      type: 'Lab',
      room: 'LAB-210',
      attendedClasses: 8,
      totalClasses: 8
    },
    {
      code: '03010601ES02',
      name: 'Electrical and Electronics Engineering',
      shortName: 'EEE Lecture',
      faculty: 'Mahit Jain',
      initials: 'MJ',
      credits: 4,
      weeklyHours: 4,
      type: 'Lecture',
      room: 'N-108',
      attendedClasses: 15,
      totalClasses: 18
    },
    {
      code: '03010601ES02',
      name: 'Electrical and Electronics Engineering Laboratory',
      shortName: 'EEE Lab',
      faculty: 'Mahit Jain',
      initials: 'MJ',
      credits: 2,
      weeklyHours: 4,
      type: 'Lab',
      room: 'A-204 / A-208',
      attendedClasses: 8,
      totalClasses: 8
    },
    {
      code: '03010501ES01',
      name: 'Programming for Problem Solving',
      shortName: 'PPS Lecture',
      faculty: 'Dr. NILESH KUMAR JAIN',
      initials: 'NKJ',
      credits: 4,
      weeklyHours: 3,
      type: 'Lecture',
      room: 'N-107 / N-109',
      attendedClasses: 14,
      totalClasses: 15
    },
    {
      code: '03010501ES01',
      name: 'Programming for Problem Solving Laboratory',
      shortName: 'PPS Lab',
      faculty: 'Dr. NILESH KUMAR JAIN',
      initials: 'NKJ',
      credits: 2,
      weeklyHours: 4,
      type: 'Lab',
      room: 'LAB-207 / LAB-212',
      attendedClasses: 7,
      totalClasses: 8
    },
    {
      code: 'PE-101',
      name: 'Prompt Engineering',
      shortName: 'PE',
      faculty: 'Rahul Moud',
      initials: 'RM',
      credits: 3,
      weeklyHours: 3,
      type: 'Lecture',
      room: 'N-107 / N-108 / N-109',
      attendedClasses: 12,
      totalClasses: 14
    },
    {
      code: '03010001HM01',
      name: 'Principles of Communication Skills',
      shortName: 'PCS TUTO',
      faculty: 'Mrs. Sonal Tiwari',
      initials: 'ST',
      credits: 2,
      weeklyHours: 2,
      type: 'Tutorial',
      room: 'N-109',
      attendedClasses: 8,
      totalClasses: 10
    }
  ],
  faculty: [
    {
      id: 'fac-bm',
      name: 'BINISHA MAKWANA',
      initials: 'BM',
      designation: 'Assistant Professor (MIS: 31526)',
      subjects: ['Web Designing (WD Lecture)'],
      email: 'binisaben.makwana31526@paruluniversity.ac.in',
      cabin: 'Faculty Block, PIET'
    },
    {
      id: 'fac-br',
      name: 'Banoth Ravindar',
      initials: 'BR',
      designation: 'Assistant Professor (MIS: 33153)',
      subjects: ['Web Designing Laboratory (WD Lab)'],
      email: 'ravindar.banoth33153@paruluniversity.ac.in',
      cabin: 'LAB-210, PIET'
    },
    {
      id: 'fac-mj',
      name: 'Mahit Jain',
      initials: 'MJ',
      designation: 'Assistant Professor (MIS: 30359)',
      subjects: ['Electrical and Electronics Engineering (EEE Lecture & Lab)'],
      email: 'mahit.jain30359@paruluniversity.ac.in',
      cabin: 'Block A, PIET'
    },
    {
      id: 'fac-nkj',
      name: 'Dr. NILESH KUMAR JAIN',
      initials: 'NKJ',
      designation: 'Associate Professor & Class Mentor (MIS: 38400)',
      subjects: ['Programming for Problem Solving (PPS Lecture & Lab)'],
      email: 'nilesh.jain38400@paruluniversity.ac.in',
      cabin: 'Block A, Cabin 304'
    },
    {
      id: 'fac-rm',
      name: 'Rahul Moud',
      initials: 'RM',
      designation: 'Assistant Professor (MIS: 32628)',
      subjects: ['Prompt Engineering (PE)'],
      email: 'rahulkumar.moud32628@paruluniversity.ac.in',
      cabin: 'Faculty Block, PIET'
    },
    {
      id: 'fac-st',
      name: 'Mrs. Sonal Tiwari',
      initials: 'ST',
      designation: 'Assistant Professor (MIS: 47018)',
      subjects: ['Principles of Communication Skills (PCS TUTO)'],
      email: 'sonal.tiwari47018@paruluniversity.ac.in',
      cabin: 'Humanities & Sciences, PIET'
    },
    {
      id: 'fac-l1',
      name: 'Calculus Faculty (L1)',
      initials: 'L1',
      designation: 'Assistant Professor in Mathematics',
      subjects: ['Calculus'],
      email: 'l1.calculus@paruluniversity.ac.in',
      cabin: 'Mathematics Department'
    }
  ],
  guidelines: [
    'Recess Timing: 11:20 AM - 12:20 PM (Lunch Recess) and 02:10 PM - 02:30 PM (Afternoon Tea Recess).',
    '75% Attendance Mandatory: As per Parul University guidelines, all students must maintain minimum 75% attendance in theory and laboratory sessions.',
    'Class Representative / MFT: SHAIKH MOHD MAAZ NAIMODDIN (mohdmaaz.shaikh34635@paruluniversity.ac.in).',
    'Laboratories: LAB-209, LAB-210, LAB-212, A-204, A-208.',
    'Head of Department: Dr. Sanjay Agal | Principal / Dean: Dr. Swapnil M. Parikh.'
  ],
  days: {
    monday: [
      {
        id: 'mon-1',
        start: '09:30',
        end: '10:25',
        subject: 'Web Designing',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'BINISHA MAKWANA',
        initials: 'BM',
        code: '03010501PC01',
        batch: 'ALL'
      },
      {
        id: 'mon-2',
        start: '10:25',
        end: '11:20',
        subject: 'Electrical and Electronics Engineering',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'Mahit Jain',
        initials: 'MJ',
        code: '03010601ES02',
        batch: 'ALL'
      },
      {
        id: 'mon-recess-1',
        start: '11:20',
        end: '12:20',
        subject: 'Recess (Lunch Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'mon-3',
        start: '12:20',
        end: '02:10',
        subject: 'Lab & Practical Session (Batches 1 & 2)',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          {
            id: '1',
            sub: 'Library / Self Study',
            room: 'Central Library',
            teacher: 'Self Study Mentor'
          },
          {
            id: '2',
            sub: 'Web Designing Laboratory',
            room: 'LAB-210',
            teacher: 'Banoth Ravindar'
          }
        ]
      },
      {
        id: 'mon-recess-2',
        start: '02:10',
        end: '02:30',
        subject: 'Recess (Tea Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'mon-4',
        start: '02:30',
        end: '03:25',
        subject: 'Calculus',
        type: 'Lecture',
        room: 'N-109',
        teacher: 'Calculus Faculty (L1)',
        initials: 'L1',
        code: '03019101BS01',
        batch: 'ALL'
      },
      {
        id: 'mon-5',
        start: '03:25',
        end: '04:20',
        subject: 'Prompt Engineering',
        type: 'Lecture',
        room: 'N-109',
        teacher: 'Rahul Moud',
        initials: 'RM',
        code: 'PE-101',
        batch: 'ALL'
      }
    ],
    tuesday: [
      {
        id: 'tue-1',
        start: '09:30',
        end: '11:20',
        subject: 'Library / Self Study Session',
        type: 'Break',
        room: 'Central Library',
        batch: 'ALL'
      },
      {
        id: 'tue-recess-1',
        start: '11:20',
        end: '12:20',
        subject: 'Recess (Lunch Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'tue-2',
        start: '12:20',
        end: '01:15',
        subject: 'Programming for Problem Solving',
        type: 'Lecture',
        room: 'N-109',
        teacher: 'Dr. NILESH KUMAR JAIN',
        initials: 'NKJ',
        code: '03010501ES01',
        batch: 'ALL'
      },
      {
        id: 'tue-3',
        start: '01:15',
        end: '02:10',
        subject: 'Calculus',
        type: 'Lecture',
        room: 'N-109',
        teacher: 'Calculus Faculty (L1)',
        initials: 'L1',
        code: '03019101BS01',
        batch: 'ALL'
      },
      {
        id: 'tue-recess-2',
        start: '02:10',
        end: '02:30',
        subject: 'Recess (Tea Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'tue-4',
        start: '02:30',
        end: '04:20',
        subject: 'Principles of Communication Skills (Tutorial)',
        type: 'Tutorial',
        room: 'N-109',
        teacher: 'Mrs. Sonal Tiwari',
        initials: 'ST',
        code: '03010001HM01',
        batch: 'ALL'
      }
    ],
    wednesday: [
      {
        id: 'wed-1',
        start: '09:30',
        end: '11:20',
        subject: 'Parallel Lab Session (Batches 1 & 2)',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          {
            id: '1',
            sub: 'Web Designing Laboratory',
            room: 'LAB-210',
            teacher: 'Banoth Ravindar'
          },
          {
            id: '2',
            sub: 'Electrical & Electronics Engineering Lab',
            room: 'A-208',
            teacher: 'Mahit Jain'
          }
        ]
      },
      {
        id: 'wed-recess-1',
        start: '11:20',
        end: '12:20',
        subject: 'Recess (Lunch Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'wed-2',
        start: '12:20',
        end: '02:10',
        subject: 'Library / Self Study',
        type: 'Break',
        room: 'Central Library',
        batch: 'ALL'
      },
      {
        id: 'wed-recess-2',
        start: '02:10',
        end: '02:30',
        subject: 'Recess (Tea Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'wed-3',
        start: '02:30',
        end: '03:25',
        subject: 'Programming for Problem Solving',
        type: 'Lecture',
        room: 'N-109',
        teacher: 'Dr. NILESH KUMAR JAIN',
        initials: 'NKJ',
        code: '03010501ES01',
        batch: 'ALL'
      },
      {
        id: 'wed-4',
        start: '03:25',
        end: '04:20',
        subject: 'Calculus',
        type: 'Lecture',
        room: 'N-109',
        teacher: 'Calculus Faculty (L1)',
        initials: 'L1',
        code: '03019101BS01',
        batch: 'ALL'
      }
    ],
    thursday: [
      {
        id: 'thu-1',
        start: '09:30',
        end: '10:25',
        subject: 'Programming for Problem Solving',
        type: 'Lecture',
        room: 'N-107',
        teacher: 'Dr. NILESH KUMAR JAIN',
        initials: 'NKJ',
        code: '03010501ES01',
        batch: 'ALL'
      },
      {
        id: 'thu-2',
        start: '10:25',
        end: '11:20',
        subject: 'Prompt Engineering',
        type: 'Lecture',
        room: 'N-107',
        teacher: 'Rahul Moud',
        initials: 'RM',
        code: 'PE-101',
        batch: 'ALL'
      },
      {
        id: 'thu-recess-1',
        start: '11:20',
        end: '12:20',
        subject: 'Recess (Lunch Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'thu-3',
        start: '12:20',
        end: '01:15',
        subject: 'Electrical and Electronics Engineering',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'Mahit Jain',
        initials: 'MJ',
        code: '03010601ES02',
        batch: 'ALL'
      },
      {
        id: 'thu-4',
        start: '01:15',
        end: '02:10',
        subject: 'Web Designing',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'BINISHA MAKWANA',
        initials: 'BM',
        code: '03010501PC01',
        batch: 'ALL'
      },
      {
        id: 'thu-recess-2',
        start: '02:10',
        end: '02:30',
        subject: 'Recess (Tea Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'thu-5',
        start: '02:30',
        end: '04:20',
        subject: 'Parallel Lab Session (Batches 1 & 2)',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          {
            id: '1',
            sub: 'Electrical and Electronics Engineering Lab',
            room: 'A-204',
            teacher: 'Mahit Jain'
          },
          {
            id: '2',
            sub: 'Programming for Problem Solving Lab',
            room: 'LAB-212',
            teacher: 'Dr. NILESH KUMAR JAIN'
          }
        ]
      }
    ],
    friday: [
      {
        id: 'fri-1',
        start: '09:30',
        end: '10:25',
        subject: 'Calculus',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'Calculus Faculty (L1)',
        initials: 'L1',
        code: '03019101BS01',
        batch: 'ALL'
      },
      {
        id: 'fri-2',
        start: '10:25',
        end: '11:20',
        subject: 'Prompt Engineering',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'Rahul Moud',
        initials: 'RM',
        code: 'PE-101',
        batch: 'ALL'
      },
      {
        id: 'fri-recess-1',
        start: '11:20',
        end: '12:20',
        subject: 'Recess (Lunch Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'fri-3',
        start: '12:20',
        end: '01:15',
        subject: 'Electrical and Electronics Engineering',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'Mahit Jain',
        initials: 'MJ',
        code: '03010601ES02',
        batch: 'ALL'
      },
      {
        id: 'fri-4',
        start: '01:15',
        end: '02:10',
        subject: 'Web Designing',
        type: 'Lecture',
        room: 'N-108',
        teacher: 'BINISHA MAKWANA',
        initials: 'BM',
        code: '03010501PC01',
        batch: 'ALL'
      },
      {
        id: 'fri-recess-2',
        start: '02:10',
        end: '02:30',
        subject: 'Recess (Tea Break)',
        type: 'Break',
        batch: 'ALL'
      },
      {
        id: 'fri-5',
        start: '02:30',
        end: '04:20',
        subject: 'Parallel Lab & Study Session (Batches 1 & 2)',
        type: 'Lab',
        batch: 'ALL',
        batches: [
          {
            id: '1',
            sub: 'Programming for Problem Solving Lab',
            room: 'LAB-207',
            teacher: 'Dr. NILESH KUMAR JAIN'
          },
          {
            id: '2',
            sub: 'Library / Self Study',
            room: 'Central Library',
            teacher: 'Self Study Mentor'
          }
        ]
      }
    ],
    saturday: [
      {
        id: 'sat-1',
        start: '09:30',
        end: '04:20',
        subject: 'Saturday Official College Holiday',
        type: 'Break',
        room: 'Campus Closed',
        batch: 'ALL'
      }
    ],
    sunday: []
  }
};
