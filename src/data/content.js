export const profile = {
  name: 'Atul Kumar Singh',
  role: 'Android & Flutter Developer',
  location: 'Ghaziabad, India',
  email: 'atul.k.singh5002@gmail.com',
  phone: '+91-9336474830',
  github: 'https://github.com/mahakaal2005',
  githubHandle: 'mahakaal2005',
  linkedin: 'https://linkedin.com/in/atulkumarsingh5002',
}

export const manifesto =
  'I build production-grade mobile applications. Native Android in Kotlin, cross-platform in Flutter, shipped for real clients on real deadlines — while mentoring two hundred students to do the same.'

export const stack = [
  'Kotlin',
  'Jetpack Compose',
  'Flutter',
  'Dart',
  'Java',
  'Spring Boot',
  'Firebase',
  'Supabase',
  'BLoC',
  'MVVM',
  'Clean Architecture',
  'Hilt',
  'Room',
  'REST APIs',
  'SQL',
  'Git',
  'Gradle',
  'Material Design 3',
]

export const projects = [
  {
    id: 'fluence',
    index: '01',
    title: 'Fluence Pay Admin Panel',
    client: 'Freelance · Blue Parrot',
    date: 'Nov 2024',
    stack: ['Flutter', 'Dart', 'BLoC', 'Firebase'],
    summary:
      'Production cross-platform fintech admin panel — the central management hub for cashback rewards, social features and merchant services.',
    highlights: [
      'Architected with BLoC for scalable state management',
      '7 backend microservices, 1000+ daily API calls',
      'Firebase Auth with JWT and encrypted local storage',
    ],
    accent: '#3ddc84',
    href: null,
  },
  {
    id: 'lookgig',
    index: '02',
    title: 'LookGig',
    client: 'Freelance · Job Portal Platform',
    date: 'Dec 2024',
    stack: ['Flutter', 'Firebase', 'Provider', 'Cloudinary'],
    summary:
      'A complete two-sided job marketplace with distinct flows for seekers and employers, delivered end to end for a client.',
    highlights: [
      'Real-time chat with delivery confirmation and read receipts',
      'Optimized Firestore queries for fast job discovery',
      'Google Sign-In and Cloudinary résumé uploads',
    ],
    accent: '#7f52ff',
    href: null,
  },
  {
    id: 'health',
    index: '03',
    title: 'Health Assistant',
    client: 'Native Android',
    date: 'Oct 2024',
    stack: ['Kotlin', 'MVVM', 'Hilt', 'Gemini AI'],
    summary:
      'Android health tracker with step counting, prescription management and AI-generated health summaries.',
    highlights: [
      'Google Gemini API for personalized health insights',
      'Clean Architecture, Hilt DI, multi-module Gradle',
      'Background sensor tracking with Room offline persistence',
    ],
    accent: '#3ddc84',
    href: 'https://github.com/mahakaal2005/Health-Assistant',
  },
]

export const milestones = [
  {
    id: 'innogeeks',
    label: 'Sept 2024 — Present',
    title: 'Android Domain Coordinator',
    org: 'Innogeeks Club, KIET',
    metric: '200+',
    metricLabel: 'students mentored',
    points: [
      'Weekly technical workshops and code reviews',
      'Reusable starter templates cut project setup time 60%',
      'Campus hackathons with 100+ participants, end to end',
    ],
  },
  {
    id: 'nasa',
    label: 'Oct 2024',
    title: 'NASA Space Apps Challenge',
    org: 'Co-organizer & Participant',
    metric: '48h',
    metricLabel: 'to a working MVP',
    points: [
      'Coordinated mentors and logistics for the campus edition',
      'Led a team to build and demo inside the 48-hour window',
    ],
  },
  {
    id: 'academics',
    label: 'Aug 2024 — May 2028',
    title: 'B.Tech Computer Science',
    org: 'KIET Group of Institutions',
    metric: '9.03',
    metricLabel: 'CGPA — top 5% of class',
    points: [
      'Data Structures, Algorithms, OOP, DBMS, Operating Systems',
      'Competitive programming and DSA practice in Java',
    ],
  },
  {
    id: 'open-source',
    label: 'Ongoing',
    title: 'Building in Public',
    org: 'GitHub · @mahakaal2005',
    metric: '40+',
    metricLabel: 'public repositories',
    points: [
      'Consistent shipping across mobile, backend and tooling',
      'Interested in system design and AI/ML applications',
    ],
  },
]
