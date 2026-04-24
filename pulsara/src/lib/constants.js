/* ─── COLORS ─────────────────────────────────────── */
export const LIME = '#d4ff3a';
export const EXAM_C = '#ff4d3a';
export const ASGN_C = '#4f9fff';
export const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin2026';
export const CLASSROOM_CODE = (process.env.NEXT_PUBLIC_CLASSROOM_CODE || 'HNU-CS-UNI').toUpperCase();

/* ─── TYPE CONFIG ────────────────────────────────── */
export const TYPE_CFG = {
  EXAM:       { label: 'EXAM',  color: EXAM_C, bg: 'rgba(255,79,79,.13)' },
  QUIZ:       { label: 'QUIZ',  color: LIME,   bg: 'rgba(212,255,58,.13)' },
  ASSIGNMENT: { label: 'ASGN',  color: ASGN_C, bg: 'rgba(79,159,255,.13)' },
  OTHER:      { label: 'OTHER', color: '#aaa',  bg: 'rgba(170,170,170,.1)' },
};

/* ─── CODENAME SUGGESTIONS ───────────────────────── */
export const SUGGESTIONS = [
  'ghost_404', 'null_ptr', 'dark_heap', 'void_loop', 'broken_seg',
  'silent_fork', 'dead_lock', 'lazy_byte', 'raw_stack', 'fuzzy_gate',
];

/* ─── FORUM ──────────────────────────────────────── */
export const FORUM_TAGS = ['STUDY', 'GROUP', 'EXAM', 'GRADES', 'ISSUE', 'GENERAL'];
export const TAG_COLORS = {
  STUDY: LIME,
  GROUP: ASGN_C,
  EXAM: EXAM_C,
  GRADES: '#f0a500',
  ISSUE: '#ff6b6b',
  GENERAL: 'var(--muted2)',
};

/* ─── SAMPLE DATA ────────────────────────────────── */
export const INITIAL_POSTS = [
  { id: 1, type: 'EXAM',       title: 'Database Systems — Midterm',         course: 'CS301',   prof: 'Dr. Ahmed Fawzy',   date: '2026-04-28', time: '10:00', notes: 'Covers chapters 4–7, ER diagrams, SQL',  author: 'null_ptr',    upvotes: 7,  status: 'approved' },
  { id: 2, type: 'QUIZ',       title: 'Algorithms — Quick Quiz #3',         course: 'CS202',   prof: 'Dr. Mona Samir',    date: '2026-04-25', time: '09:00', notes: 'Sorting algorithms, O(n) analysis',       author: 'dark_heap',   upvotes: 3,  status: 'approved' },
  { id: 3, type: 'ASSIGNMENT', title: 'Networks Lab Report — TCP/IP',       course: 'CS410',   prof: 'Dr. Khaled Nasser', date: '2026-04-30', time: '23:59', notes: 'Submit PDF via portal',                    author: 'ghost_404',   upvotes: 5,  status: 'approved' },
  { id: 4, type: 'EXAM',       title: 'Linear Algebra — Final',             course: 'MATH201', prof: 'Dr. Rania Hassan', date: '2026-05-05', time: '11:00', notes: 'All topics, bring calculator',              author: 'void_loop',   upvotes: 12, status: 'approved' },
  { id: 5, type: 'QUIZ',       title: 'Operating Systems — Memory Quiz',    course: 'CS305',   prof: 'Dr. Sameh Lotfy',   date: '2026-04-26', time: '14:00', notes: 'Virtual memory, paging',                   author: 'broken_seg',  upvotes: 2,  status: 'pending'  },
  { id: 6, type: 'ASSIGNMENT', title: 'Web Dev — React Project Submission', course: 'CS490',   prof: 'Dr. Hana Emad',     date: '2026-04-29', time: '23:59', notes: 'GitHub repo + deployed link required',     author: 'null_ptr',    upvotes: 8,  status: 'approved' },
  { id: 7, type: 'EXAM',       title: 'Physics II — Chapter 5–8 Exam',     course: 'PHYS102', prof: 'Dr. Amr Wahid',     date: '2026-05-02', time: '09:30', notes: 'Electricity & magnetism',                  author: 'silent_fork', upvotes: 6,  status: 'pending'  },
  { id: 8, type: 'QUIZ',       title: 'Discrete Math — Logic Quiz',         course: 'MATH101', prof: 'Dr. Layla Farouk',  date: '2026-04-27', time: '11:00', notes: 'Propositional logic only',                 author: 'lazy_byte',   upvotes: 1,  status: 'approved' },
];

export const FINALS_SCHEDULE = [
  { date: 'Tuesday, May 19, 2026',    time: '12:00 – 14:00', subject: 'Artificial Intelligence',           code: 'CS212',   days_left: 25 },
  { date: 'Saturday, May 23, 2026',   time: '12:00 – 14:00', subject: 'Data Structures',                  code: 'CS207',   days_left: 29 },
  { date: 'Monday, June 1, 2026',     time: '12:00 – 14:00', subject: 'Linear Algebra',                   code: 'MATH204', days_left: 38 },
  { date: 'Wednesday, June 3, 2026',  time: '12:00 – 14:00', subject: 'Internet Technology',              code: 'CS209',   days_left: 40 },
  { date: 'Saturday, June 6, 2026',   time: '12:00 – 14:00', subject: 'Advanced Computer Programming',    code: 'CS210',   days_left: 43 },
  { date: 'Wednesday, June 10, 2026', time: '12:00 – 14:00', subject: 'Systems Analysis and Design',      code: 'CS206',   days_left: 47 },
];

export const INITIAL_THREADS = [
  {
    id: 1, title: 'Anyone have notes for chapter 6 of DB?', author: 'null_ptr', created: '2h ago',
    replies: [
      { id: 1, author: 'dark_heap',  text: 'Check the shared drive, someone uploaded slides last week', time: '1h ago' },
      { id: 2, author: 'void_loop',  text: "I have the prof's whiteboard photos, drop your email and I'll send", time: '45m ago' },
      { id: 3, author: 'null_ptr',   text: 'you can DM me through the system, ghost_404 also had good notes', time: '30m ago' },
    ],
    tag: 'STUDY', upvotes: 14,
  },
  {
    id: 2, title: "Study group for Linear Algebra finals — who's in?", author: 'broken_seg', created: '5h ago',
    replies: [
      { id: 1, author: 'silent_fork', text: "I'm in. Library room B-204 works for me, Saturday afternoon?", time: '4h ago' },
      { id: 2, author: 'lazy_byte',   text: "Same, I need someone to explain eigenvalues to me like I'm 5", time: '3h ago' },
    ],
    tag: 'GROUP', upvotes: 9,
  },
  {
    id: 3, title: 'What exactly is covered in the AI midterm?', author: 'ghost_404', created: '1d ago',
    replies: [
      { id: 1, author: 'null_ptr',    text: 'Dr. Fawzy said search algorithms + constraint satisfaction, chapters 3–5', time: '23h ago' },
      { id: 2, author: 'broken_seg',  text: 'He also mentioned Bayesian networks might show up as a bonus Q', time: '20h ago' },
      { id: 3, author: 'dark_heap',   text: 'Confirmed: no neural networks on this midterm, he said explicitly', time: '18h ago' },
      { id: 4, author: 'silent_fork', text: 'Thanks! Saving me from studying 3 extra chapters lol', time: '10h ago' },
    ],
    tag: 'EXAM', upvotes: 22,
  },
  {
    id: 4, title: 'Grade curve for Algorithms last semester?', author: 'raw_stack', created: '2d ago',
    replies: [
      { id: 1, author: 'void_loop', text: "No curve, Dr. Mona doesn't curve. But avg was 68 so passing is around 55", time: '1d ago' },
    ],
    tag: 'GRADES', upvotes: 6,
  },
  {
    id: 5, title: 'Is the Networks lab submission portal down for anyone else?', author: 'fuzzy_gate', created: '3h ago',
    replies: [], tag: 'ISSUE', upvotes: 11,
  },
];

export const WA_MSGS = [
  { side: 'left',  name: 'Ahmed K.',  text: 'yo did anyone actually study lmaoooo 💀', time: '10:02' },
  { side: 'left',  name: 'Sara M.',   text: 'HAHAHA bro same I opened the book for 2 mins then closed it', time: '10:03' },
  { side: 'right', name: 'You',       text: 'guys when is the DB exam exactly??', time: '10:04' },
  { side: 'left',  name: 'Mahmoud',   text: '😂😂😂😂😂', time: '10:04' },
  { side: 'left',  name: 'Nour',      text: 'idk check the syllabus or smth', time: '10:05' },
  { side: 'left',  name: 'Ahmed K.',  text: 'lol good luck everyone fr', time: '10:05' },
  { side: 'left',  name: 'Sara M.',   text: 'anyone got the slides for chapter 6?? asking for a friend 🙃', time: '10:06' },
  { side: 'left',  name: 'Omar',      text: '💀💀💀💀', important: true, time: '10:07', realText: 'CS301 DB Midterm — April 28 at 10:00am. Covers ch4–7 + ER diagrams. Dr. Fawzy confirmed.' },
  { side: 'left',  name: 'Mahmoud',   text: '^^^^ this ☝️', time: '10:07' },
  { side: 'left',  name: 'Ahmed K.',  text: "ahahaha man I'm not ready at all 😭", time: '10:08' },
  { side: 'right', name: 'You',       text: 'WAIT what was that message above??', time: '10:09' },
  { side: 'left',  name: 'Sara M.',   text: "which one lol there's like 200 messages", time: '10:09' },
];

export const NOW = new Date();

/* ─── COURSES ────────────────────────────────────── */
export const COURSES = [
  'CS301 — Database Systems',
  'CS202 — Algorithms',
  'CS410 — Networks',
  'CS305 — Operating Systems',
  'CS490 — Web Development',
  'MATH201 — Linear Algebra',
  'MATH101 — Discrete Math',
  'PHYS102 — Physics II',
];

/* ─── SHARED INLINE STYLES ───────────────────────── */
export const LBL = {
  fontSize: 11, fontWeight: 600, color: 'var(--muted2)',
  fontFamily: 'var(--mono)', letterSpacing: '.06em',
  textTransform: 'uppercase', display: 'block', marginBottom: 6,
};

export const INP = {
  width: '100%', background: 'var(--s2)',
  border: '1px solid var(--border)', borderRadius: 8,
  padding: '10px 13px', color: 'var(--text)',
  fontFamily: 'var(--sans)', fontSize: 13,
  outline: 'none', transition: 'border-color .2s',
  colorScheme: 'dark',
};

export const LIME_BTN = {
  background: LIME, color: '#000', border: 'none',
  borderRadius: 8, padding: '11px 20px',
  fontFamily: 'var(--mono)', fontSize: 11,
  fontWeight: 700, letterSpacing: '.08em',
  cursor: 'pointer', transition: 'all .15s', width: '100%',
};

export const GHOST_BTN = {
  background: 'none', border: '1px solid var(--border)',
  borderRadius: 8, padding: '10px 16px',
  color: 'var(--muted)', fontFamily: 'var(--mono)',
  fontSize: 11, cursor: 'pointer',
  transition: 'all .15s', whiteSpace: 'nowrap',
};

/* ─── HELPERS ────────────────────────────────────── */
export function fmtDate(s) {
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function daysUntil(s) {
  const d = new Date(s + 'T00:00:00');
  const diff = Math.ceil((d - NOW) / 86400000);
  if (diff < 0) return 'Past';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `${diff}d left`;
}
