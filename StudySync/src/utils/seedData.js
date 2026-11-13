import { uid } from './storage';

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };

export const SUBJECT_COLORS = [
  { name: 'Amber', value: '#E8A33D' },
  { name: 'Sage', value: '#7A9B76' },
  { name: 'Coral', value: '#D97757' },
  { name: 'Slate', value: '#5B7B9A' },
  { name: 'Plum', value: '#8B6BA8' },
  { name: 'Teal', value: '#4D9B92' },
];

export function defaultSubjects() {
  return [
    { id: uid('sub'), name: 'JavaScript', color: '#E8A33D', goalHours: 50, loggedHours: 28 },
    { id: uid('sub'), name: 'Data Structures', color: '#5B7B9A', goalHours: 40, loggedHours: 31 },
    { id: uid('sub'), name: 'React', color: '#7A9B76', goalHours: 35, loggedHours: 19 },
    { id: uid('sub'), name: 'System Design', color: '#D97757', goalHours: 25, loggedHours: 6 },
  ];
}

export function defaultTasks(subjects) {
  const [js, ds, react, sysd] = subjects;
  return [
    { id: uid('task'), name: 'Finish closures & scope deep dive', subjectId: js.id, priority: 'High', deadline: addDays(1), estHours: 2, status: 'Pending' },
    { id: uid('task'), name: 'Practice array methods exercises', subjectId: js.id, priority: 'Medium', deadline: addDays(3), estHours: 1.5, status: 'Pending' },
    { id: uid('task'), name: 'Binary search tree implementation', subjectId: ds.id, priority: 'High', deadline: addDays(0), estHours: 3, status: 'Pending' },
    { id: uid('task'), name: 'Solve 10 linked list problems', subjectId: ds.id, priority: 'Medium', deadline: addDays(2), estHours: 2, status: 'Completed' },
    { id: uid('task'), name: 'Build custom hooks practice app', subjectId: react.id, priority: 'Medium', deadline: addDays(4), estHours: 2.5, status: 'Pending' },
    { id: uid('task'), name: 'Read about useMemo & useCallback', subjectId: react.id, priority: 'Low', deadline: addDays(5), estHours: 1, status: 'Completed' },
    { id: uid('task'), name: 'Design a URL shortener', subjectId: sysd.id, priority: 'High', deadline: addDays(6), estHours: 3, status: 'Pending' },
    { id: uid('task'), name: 'Revise CAP theorem notes', subjectId: sysd.id, priority: 'Low', deadline: addDays(-1), estHours: 1, status: 'Completed' },
  ];
}

export function defaultSchedule() {
  return [
    { id: uid('sch'), date: iso(today), time: '09:00', title: 'React Revision', subject: 'React', duration: 60 },
    { id: uid('sch'), date: iso(today), time: '11:00', title: 'DSA Practice', subject: 'Data Structures', duration: 90 },
    { id: uid('sch'), date: iso(today), time: '14:00', title: 'System Design Reading', subject: 'System Design', duration: 45 },
    { id: uid('sch'), date: iso(today), time: '16:30', title: 'JavaScript Quiz Prep', subject: 'JavaScript', duration: 60 },
  ];
}

export function defaultGoals(subjects) {
  return [
    { id: uid('goal'), name: 'Complete React in 30 Days', targetDate: addDays(20), progress: 45, subjectId: subjects[2]?.id || '' },
    { id: uid('goal'), name: 'Master Core DSA Patterns', targetDate: addDays(45), progress: 60, subjectId: subjects[1]?.id || '' },
    { id: uid('goal'), name: 'Ship a System Design Portfolio Doc', targetDate: addDays(60), progress: 15, subjectId: subjects[3]?.id || '' },
  ];
}

export function defaultNotes() {
  return [
    { id: uid('note'), title: 'React Hooks Notes', content: 'useState batches updates in event handlers. useEffect cleanup runs before next effect and on unmount. useMemo/useCallback are for referential stability, not raw speed.', subject: 'React', updatedAt: addDays(-2) },
    { id: uid('note'), title: 'JavaScript Interview Notes', content: 'Closures capture variables by reference, not value. Event loop: call stack -> microtasks (Promises) -> macrotasks (setTimeout). Hoisting applies to var and function declarations.', subject: 'JavaScript', updatedAt: addDays(-5) },
    { id: uid('note'), title: 'Big-O Cheat Sheet', content: 'Array access O(1), search O(n). Hash map average O(1) for get/set. Balanced BST operations O(log n). Sorting comparison-based lower bound is O(n log n).', subject: 'Data Structures', updatedAt: addDays(-1) },
  ];
}

export function defaultExams(subjects) {
  return [
    { id: uid('exam'), name: 'JavaScript Fundamentals Test', subjectId: subjects[0]?.id || '', date: addDays(7), prep: 'In Progress' },
    { id: uid('exam'), name: 'DSA Mock Interview', subjectId: subjects[1]?.id || '', date: addDays(14), prep: 'Not Started' },
    { id: uid('exam'), name: 'React Project Defense', subjectId: subjects[2]?.id || '', date: addDays(-3), prep: 'Completed' },
  ];
}

export function defaultAssignments(subjects) {
  return [
    { id: uid('asg'), title: 'Build a Todo App with Context API', subjectId: subjects[2]?.id || '', dueDate: addDays(4), status: 'Pending', priority: 'High' },
    { id: uid('asg'), title: 'Implement Merge Sort & Quick Sort', subjectId: subjects[1]?.id || '', dueDate: addDays(2), status: 'Pending', priority: 'Medium' },
    { id: uid('asg'), title: 'Write notes on Event Delegation', subjectId: subjects[0]?.id || '', dueDate: addDays(-2), status: 'Completed', priority: 'Low' },
  ];
}

export function defaultPomodoroStats() {
  return { todaySessions: 3, totalFocusMinutes: 1860, sessionLog: [] };
}

export function defaultStreak() {
  return { current: 12, longest: 30, lastStudyDate: iso(today) };
}
