// Full core-team roster, grouped by department. Shared by the homepage and /team.
export const TEAM_DEPARTMENTS = [
  { key: 'tech-dev', label: 'Tech & Dev', id: 'MOD_01' },
  { key: 'event-mgmt', label: 'Event Management', id: 'MOD_02' },
  { key: 'social-media', label: 'Social Media', id: 'MOD_03' },
  { key: 'public-relations', label: 'Public Relations', id: 'MOD_04' },
];

export const TEAM_MEMBERS = {
  'tech-dev': [
    { name: 'Ishan', role: 'Tech Head', img: 'https://i.postimg.cc/VvJdtjPw/Ishan.jpg' },
    { name: 'Diwakar', role: 'Tech Head', img: 'https://i.postimg.cc/fyy0vGm4/Diwakar.jpg' },
    { name: 'Kriti', role: 'Developer', img: 'https://i.postimg.cc/fyqYnzZ6/kriti.jpg' },
    { name: 'Rahul', role: 'President', img: 'https://i.postimg.cc/SNwzWtsy/rahul.jpg' },
    { name: 'Falak', role: 'Developer', img: 'https://i.postimg.cc/m2xH95hW/falak.jpg' },
    { name: 'Aparna', role: 'Developer', img: 'https://i.postimg.cc/MpSVCF8X/aparna.jpg' },
    { name: 'Ashwani Jha', role: 'Developer', img: 'https://i.postimg.cc/NFb0hbDJ/ashwini.jpg' },
    { name: 'Sumit Bhatt', role: 'Developer', img: 'https://i.postimg.cc/9XLCpJZ5/sumit.jpg' },
  ],
  'event-mgmt': [
    { name: 'Madhur', role: 'Event Member', img: 'https://i.postimg.cc/hGRTq3W3/madhur.jpg' },
    { name: 'Parth', role: 'Event Head', img: 'https://i.postimg.cc/dt7yZKJC/parth.jpg' },
    { name: 'Sumit Kumar', role: 'Event Executive', img: 'https://i.postimg.cc/6pTWjhXQ/sumit-kumar.png' },
    { name: 'Kanishka Bhardwaj', role: 'Event Member', img: 'https://i.postimg.cc/1XyzYbGq/kanishka.jpg' },
  ],
  'social-media': [
    { name: 'Apoorva', role: 'Vice President', img: 'https://i.postimg.cc/PxzBMchy/apoorva.jpg' },
    { name: 'Kshitij', role: 'Secretary', img: 'https://i.postimg.cc/BQy2mnhG/kshtiij.jpg' },
    { name: 'Naman', role: 'Vice President', img: 'https://i.postimg.cc/ryZ4ppXB/naman.jpg' },
  ],
  'public-relations': [
    { name: 'Sharad', role: 'PR Head', img: 'https://i.postimg.cc/pXJ1SBBd/Whats-App-Image-2026-09-15-at-12-49-31.jpg' },
    { name: 'Bharti', role: 'PR Executive', img: 'https://i.postimg.cc/gkf9S5Jw/bharti.jpg' },
    { name: 'Vansh', role: 'PR Member', img: 'https://i.postimg.cc/WpYcrtc2/vansh.jpg' },
  ],
};

// One colour per department (homepage pile, /team cards).
export const DEPT_TONE = { 'tech-dev': '#ffe85c', 'event-mgmt': '#ff8fb1', 'social-media': '#9bd7ff', 'public-relations': '#3ae88a' };
// Office bearers (society-wide) and department heads.
export const isOfficeBearer = (m) => /president|secretary/i.test(m.role);
export const isLead = (m) => /president|secretary|head|lead|manager/i.test(m.role);

// Flat list with department attached (homepage pile, counts).
export const TEAM = TEAM_DEPARTMENTS.flatMap((d) => (TEAM_MEMBERS[d.key] || []).map((m) => ({ ...m, dept: d.key, deptLabel: d.label })));

// Kept for the old carousel components; same faces, no roles.
export const TEAM_HIGHLIGHTS = [
  { name: 'Ishan', img: 'https://i.postimg.cc/VvJdtjPw/Ishan.jpg' },
  { name: 'Diwakar', img: 'https://i.postimg.cc/fyy0vGm4/Diwakar.jpg' },
  { name: 'Kriti', img: 'https://i.postimg.cc/fyqYnzZ6/kriti.jpg' },
  { name: 'Rahul', img: 'https://i.postimg.cc/SNwzWtsy/rahul.jpg' },
  { name: 'Falak', img: 'https://i.postimg.cc/m2xH95hW/falak.jpg' },
  { name: 'Aparna', img: 'https://i.postimg.cc/MpSVCF8X/aparna.jpg' },
  { name: 'Madhur', img: 'https://i.postimg.cc/hGRTq3W3/madhur.jpg' },
  { name: 'Parth', img: 'https://i.postimg.cc/dt7yZKJC/parth.jpg' },
  { name: 'Apoorva', img: 'https://i.postimg.cc/PxzBMchy/apoorva.jpg' },
  { name: 'Kshitij', img: 'https://i.postimg.cc/BQy2mnhG/kshtiij.jpg' },
  { name: 'Naman', img: 'https://i.postimg.cc/ryZ4ppXB/naman.jpg' },
  { name: 'Pranjal', img: 'https://i.postimg.cc/nzyCvXFY/pranjal.jpg' },
  { name: 'Sharad', img: 'https://i.postimg.cc/pXJ1SBBd/Whats-App-Image-2026-09-15-at-12-49-31.jpg' },
  { name: 'Vansh', img: 'https://i.postimg.cc/WpYcrtc2/vansh.jpg' },
];
