// Direct /in/ only when the profile shows MAIT / Maharaja Agrasen AND Aivolution.
// Otherwise people-search: name + MAIT + Aivolutions.
export const maitPeopleSearch = (name) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${name} MAIT Aivolutions`)}`;

const member = (name, role, img, linkedin) => ({
  name,
  role,
  img,
  linkedin: linkedin || maitPeopleSearch(name),
});

// Full core-team roster, grouped by department. Shared by the homepage and /team.
export const TEAM_DEPARTMENTS = [
  { key: 'tech-dev', label: 'Tech & Dev', id: 'MOD_01' },
  { key: 'event-mgmt', label: 'Event Management', id: 'MOD_02' },
  { key: 'social-media', label: 'Social Media', id: 'MOD_03' },
  { key: 'public-relations', label: 'Public Relations', id: 'MOD_04' },
];

export const TEAM_MEMBERS = {
  'tech-dev': [
    member('Ishan', 'Tech Head', 'https://i.postimg.cc/VvJdtjPw/Ishan.jpg', 'https://www.linkedin.com/in/ishan-gupta-08686631a'),
    member('Diwakar', 'Tech Head', 'https://i.postimg.cc/fyy0vGm4/Diwakar.jpg', 'https://www.linkedin.com/in/diwakar-mishra-dev'),
    member('Kriti', 'Developer', 'https://i.postimg.cc/fyqYnzZ6/kriti.jpg', 'https://www.linkedin.com/in/kritsii/'),
    member('Rahul', 'President', 'https://i.postimg.cc/SNwzWtsy/rahul.jpg', 'https://www.linkedin.com/in/rahulkumarmait'),
    member('Aparna', 'Developer', 'https://i.postimg.cc/MpSVCF8X/aparna.jpg', 'https://www.linkedin.com/in/aparna-jha-58662b304/'),
    member('Sumit Bhatt', 'Developer', 'https://i.postimg.cc/9XLCpJZ5/sumit.jpg', 'https://www.linkedin.com/in/sumit-bhatt-753186218/'),
  ],
  'event-mgmt': [
    member('Madhur', 'Event Member', 'https://i.postimg.cc/hGRTq3W3/madhur.jpg', 'https://www.linkedin.com/in/madhur-chaudhary-ai/'),
    member('Parth', 'Event Head', 'https://i.postimg.cc/dt7yZKJC/parth.jpg', 'https://www.linkedin.com/in/parth-arora-a9b3b1316'),
    member('Sumit Kumar', 'Event Executive', 'https://i.postimg.cc/6pTWjhXQ/sumit-kumar.png', 'https://www.linkedin.com/in/sumit-kumar-b81344304/'),
    member('Kanishka Bhardwaj', 'Event Member', 'https://i.postimg.cc/1XyzYbGq/kanishka.jpg', 'https://www.linkedin.com/in/kanishka-bhardwaj-014310329/'),
    member('Ashwani Jha', 'Event Member', 'https://i.postimg.cc/NFb0hbDJ/ashwini.jpg', 'https://www.linkedin.com/in/ashwani-jha-a26bbb299'),
  ],
  'social-media': [
    member('Apoorva', 'Vice President', 'https://i.postimg.cc/PxzBMchy/apoorva.jpg', 'https://www.linkedin.com/in/apoorva-adhikari-66621323b/'),
    member('Kshitij', 'Secretary', 'https://i.postimg.cc/BQy2mnhG/kshtiij.jpg', 'https://www.linkedin.com/in/kshitij-garg-047221344'),
    member('Naman', 'Vice President', 'https://i.postimg.cc/ryZ4ppXB/naman.jpg', 'https://www.linkedin.com/in/naman-chopra-250325326'),
  ],
  'public-relations': [
    member('Sharad', 'PR Head', 'https://i.postimg.cc/pXJ1SBBd/Whats-App-Image-2026-09-15-at-12-49-31.jpg', 'https://www.linkedin.com/in/sharad-tiwari-a04a4b345/'),
    member('Bharti', 'PR Executive', 'https://i.postimg.cc/gkf9S5Jw/bharti.jpg', 'https://www.linkedin.com/in/bharti-bhatti-751933327'),
    member('Vansh', 'PR Member', 'https://i.postimg.cc/WpYcrtc2/vansh.jpg', 'https://www.linkedin.com/in/vanshbahl'),
    member('Falak', 'PR Member', 'https://i.postimg.cc/m2xH95hW/falak.jpg', 'https://www.linkedin.com/in/falakkhatreja'),
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
