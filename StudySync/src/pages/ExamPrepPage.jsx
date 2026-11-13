import { useState, useEffect, useCallback } from 'react';
import { useStudy } from '../context/StudyContext';
import { apiFetch } from '../utils/api';
import { Modal, Pill, Tabs, StatCard, SearchInput, EmptyState, ProgressBar } from '../components/ui';
import VisualDiagram from '../components/ui/VisualDiagram';
import {
  LuBookOpenCheck, LuGraduationCap, LuSparkles, LuCheck, LuBookmark,
  LuChevronDown, LuChevronUp, LuPlus, LuFileText, LuLayers, LuTrash2, LuCopy
} from 'react-icons/lu';

const QUICK_COURSES = ['B.Tech CSE', 'BCA', 'MCA', 'B.Sc CS', 'ETT / D.El.Ed', 'BBA / B.Com'];
const SEMESTER_OPTIONS = ['All Semesters', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Year 1 & Year 2'];
const EXAM_TYPES = ['All Exam Types', 'End Term Test (ETT)', 'Mid Term (MST)', 'Semester Final', 'ETT Board Exam'];

function normalizeCourseMatch(raw) {
  const c = (raw || '').toLowerCase().replace(/[\s.\-_/]+/g, '');
  if (c.includes('btech') || c.includes('becse') || c === 'cse') return 'B.Tech CSE';
  if (c.includes('bca')) return 'BCA';
  if (c.includes('mca')) return 'MCA';
  if (c.includes('bsc')) return 'B.Sc CS';
  if (c.includes('ett') || c.includes('deled')) return 'ETT / D.El.Ed';
  if (c.includes('bba') || c.includes('bcom') || c.includes('mba')) return 'BBA / B.Com';
  return raw || '';
}

const DEMO_FALLBACK_META = {
  universities: ['CT University (Ludhiana)', 'AKTU', 'IKGPTU', 'All Universities'],
  courses: ['B.Tech CSE', 'BCA', 'MCA', 'B.Sc CS', 'ETT / D.El.Ed'],
  semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
  examTypes: ['End Term Test (ETT)', 'Mid Term (MST)', 'Semester Final'],
  subjects: ['Data Structures & Algorithms', 'Discrete Structures & Graph Theory', 'Database Management Systems'],
  subjectCatalog: [
    { course: 'B.Tech CSE', semester: 'Sem 3', subject: 'Data Structures & Algorithms' },
    { course: 'B.Tech CSE', semester: 'Sem 3', subject: 'Discrete Structures & Graph Theory' },
    { course: 'B.Tech CSE', semester: 'Sem 4', subject: 'Database Management Systems' },
  ],
};

const DEMO_FALLBACK_PACKS = [
  {
    id: 'demo_pack_dsa',
    university: 'CT University / AKTU / IKGPTU',
    course: 'B.Tech CSE',
    semester: 'Sem 3',
    subject: 'Data Structures & Algorithms',
    examType: 'End Term Test (ETT)',
    examPattern: {
      totalMarks: 60,
      passMarks: 24,
      structure: 'Section A (10x1M=10M), Section B (5x2M=10M), Section C (4x5M=20M), Section D (2x10M=20M)',
      highWeightageTopics: [
        'AVL Tree Balance Rotations (LL, RR, LR, RL)',
        'B+ Tree Splitting & Insertion (Order 3/4)',
        'Dijkstra Shortest Path & Prim MST Algorithm',
        'Quick Sort & Merge Sort Recurrence & Proofs',
      ],
    },
    crashSummary: {
      tagline: 'Zero-to-Exam DSA Crash Pack: AVL Rotations + B+ Tree + Dijkstra = 50+/60!',
      passPlan: '1) Unit 1: Asymptotic Big-O proofs. 2) Unit 3: AVL Rotations step-by-step. 3) Unit 4: B+ Tree insertions. 4) Unit 5: Dijkstra shortest path algorithm.',
      units: [
        {
          unit: 'Unit 1',
          title: 'Asymptotic Analysis & Linear Structures',
          analogy: 'Stack is like a pile of plates (LIFO); Queue is like a movie ticket line (FIFO).',
          simpleExplanation: '• Time Complexity: Big-O represents worst case upper bound.\n• Array vs Linked List: Arrays have O(1) random access but O(n) insertion. Linked lists have O(1) pointer inserts once located.\n• Circular Queue eliminates space waste in linear queue using (rear + 1) % size.',
          keyFormulasOrKeywords: ['Big-O Upper Bound', 'Stack LIFO (push/pop)', 'Queue FIFO (enqueue/dequeue)', 'Circular Queue: (rear+1)%size'],
          diagram: 'linked-list',
        },
        {
          unit: 'Unit 2',
          title: 'Sorting Algorithms & Divide and Conquer',
          analogy: 'Merge Sort cuts the deck in half repeatedly, then merges sorted piles like a zip fastener.',
          simpleExplanation: '• Quick Sort: Pick pivot, partition into smaller/larger elements. Average O(n log n), worst case O(n^2) when array already sorted.\n• Merge Sort: Stable sorting algorithm with guaranteed O(n log n) in all cases using extra O(n) space.',
          keyFormulasOrKeywords: ['QuickSort T(n)=2T(n/2)+O(n)', 'MergeSort O(n log n)', 'Divide and Conquer', 'Stable Sorting'],
          diagram: 'generic',
        },
        {
          unit: 'Unit 3',
          title: 'Binary Search Trees & AVL Balance Rotations',
          analogy: 'An AVL tree is like a self-balancing weighing scale: if one side tilts by more than 1 kg, it auto-rotates back to level.',
          simpleExplanation: '• Balance Factor: BF(node) = Height(Left Subtree) - Height(Right Subtree). Valid BF in AVL: {-1, 0, +1}.\n• LL Imbalance -> Single Right Rotation.\n• RR Imbalance -> Single Left Rotation.\n• LR Imbalance -> Double Rotation (Left on child, Right on root).\n• RL Imbalance -> Double Rotation (Right on child, Left on root).',
          keyFormulasOrKeywords: ['BF = H(left) - H(right)', 'Valid: {-1, 0, 1}', 'LL -> Right Rotate', 'RR -> Left Rotate', 'LR -> Left-Right', 'RL -> Right-Left'],
          diagram: 'avl_rotation',
        },
        {
          unit: 'Unit 4',
          title: 'B-Trees & B+ Tree Multi-Way Search',
          analogy: 'A B+ Tree is like a library index: inner cards only guide you to shelves, while all actual books and links sit on the ground floor (leaf nodes).',
          simpleExplanation: '• In a B+ Tree, all data records are stored strictly in the leaf nodes. Leaves are linked sequentially for rapid range queries.\n• Internal nodes only contain indexing router keys.\n• Splitting: When a leaf exceeds capacity M-1, it splits into two halves and copies the median key up to the parent.',
          keyFormulasOrKeywords: ['Leaves linked via pointers', 'Internal nodes = Router keys', 'Order M node has <= M children', 'Splitting when full'],
          diagram: 'bplus_tree',
        },
        {
          unit: 'Unit 5',
          title: 'Graphs, BFS/DFS & Dijkstra Algorithm',
          analogy: 'BFS is like dropping a pebble in water (ripples expand level by level); DFS is like exploring a maze by walking as deep as possible before backtracking.',
          simpleExplanation: '• BFS uses a Queue (Breadth level-by-level, O(V+E)).\n• DFS uses a Stack / Recursion (Depth first, O(V+E)).\n• Dijkstra: Greedy algorithm for single-source shortest paths on non-negative weighted graphs using Min-Heap priority queue.',
          keyFormulasOrKeywords: ['BFS -> Queue', 'DFS -> Stack', 'Dijkstra: dist[v] = min(dist[v], dist[u] + weight(u,v))', 'Time: O((V+E) log V)'],
          diagram: 'osi_stack',
        },
        {
          unit: 'Unit 6',
          title: 'Hashing & Collision Resolution',
          analogy: 'Hash function is like a hotel room allocator: maps your ID number directly to a room key.',
          simpleExplanation: '• Hash Collision: When two different keys produce the exact same index h(k1) == h(k2).\n• Separate Chaining: Each bucket holds a linked list of collided keys.\n• Open Addressing: Linear Probing (h(k)+i)%m, Quadratic Probing (h(k)+i^2)%m, Double Hashing.',
          keyFormulasOrKeywords: ['Load Factor alpha = n/m', 'Chaining -> Linked Lists', 'Linear Probing: (h(k)+i)%m', 'O(1) average lookup'],
          diagram: 'generic',
        },
      ],
    },
    pyqs: [
      {
        id: 'q_dsa_1',
        year: 2025,
        semester: 'Sem 3',
        marks: 10,
        frequency: 'Sure Shot ETT',
        isImportant: true,
        unit: 'Unit 3',
        question: 'Explain AVL tree balance factors. Construct an AVL tree by inserting the following sequence: 10, 20, 30, 40, 50, 25. Show rotations clearly.',
        answer: '1. Insert 10, 20: Tree is balanced.\n2. Insert 30: Node 10 has BF = -2 (Right-Right imbalance). Perform Left Rotation on 10 -> 20 becomes root with children 10 and 30.\n3. Insert 40: Balanced.\n4. Insert 50: Node 30 has BF = -2 (RR imbalance). Left rotate 30 -> 40 becomes parent of 30 and 50.\n5. Insert 25: Node 20 has RL imbalance. Right rotate around 40, then Left rotate around 20 -> tree is perfectly balanced!',
      },
      {
        id: 'q_dsa_2',
        year: 2024,
        semester: 'Sem 3',
        marks: 10,
        frequency: 'Repeated 3x',
        isImportant: true,
        unit: 'Unit 4',
        question: 'What is a B+ tree? Differentiate between B-Tree and B+ Tree. Why are B+ trees preferred in database indexing?',
        answer: 'Differences:\n1. Data storage: In B-Tree, keys and satellite data records are stored in both internal and leaf nodes. In B+ Tree, data records exist exclusively in leaf nodes; internal nodes only store router keys.\n2. Leaf node linking: In B+ Tree, all leaf nodes are linked together in a doubly linked list, allowing fast O(1) range queries and sequential scans. B-Tree requires expensive in-order tree traversal.\n3. Height: B+ tree has higher fan-out and lower height, resulting in fewer disk I/O operations.',
      },
      {
        id: 'q_dsa_3',
        year: 2025,
        semester: 'Sem 3',
        marks: 5,
        frequency: 'Important',
        isImportant: true,
        unit: 'Unit 5',
        question: 'Write Dijkstra algorithm for single source shortest path. Why does it fail for negative edge weights?',
        answer: 'Algorithm steps:\n1. Initialize dist[src] = 0 and dist[v] = infinity for all other vertices.\n2. Add all vertices to a Priority Queue.\n3. Extract min-distance vertex u. For each neighbor v of u, relax the edge: if dist[u] + weight(u,v) < dist[v], update dist[v] = dist[u] + weight(u,v).\n4. Repeat until priority queue is empty.\n\nNegative weights fail because Dijkstra greedily assumes that once a vertex is marked visited, its shortest distance cannot be decreased. Negative edges violate this greedy property.',
      },
    ],
    notes: [
      {
        id: 'n_dsa_1',
        title: 'Master Theorem for Divide & Conquer Recurrences',
        content: 'For T(n) = a*T(n/b) + f(n):\nCompare f(n) with n^(log_b(a)):\n- Case 1: If f(n) < n^(log_b(a)), T(n) = Theta(n^(log_b(a))).\n- Case 2: If f(n) == n^(log_b(a)), T(n) = Theta(n^(log_b(a)) * log n).\n- Case 3: If f(n) > n^(log_b(a)), T(n) = Theta(f(n)).',
      },
    ],
  },
];

export default function ExamPrepPage() {
  const { addNote, addTask, subjects } = useStudy();

  const [meta, setMeta] = useState({ universities: [], courses: [], semesters: [], examTypes: [], subjects: [], subjectCatalog: [] });
  const [filters, setFilters] = useState({
    course: '',
    semester: 'All Semesters',
    university: '',
    college: '',
    examType: 'End Term Test (ETT)',
    subject: '',
    search: '',
  });

  const [packs, setPacks] = useState([]);
  const [matchMode, setMatchMode] = useState('exact');
  const [selectedPackId, setSelectedPackId] = useState('');
  const [activeTab, setActiveTab] = useState('pyqs');
  const [yearFilter, setYearFilter] = useState('All');
  const [marksFilter, setMarksFilter] = useState('All');
  const [importantOnly, setImportantOnly] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [expandedPyqIds, setExpandedPyqIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const [progress, setProgress] = useState({
    revisedQuestionIds: [],
    bookmarkedQuestionIds: [],
  });

  // Modals
  const [packModalOpen, setPackModalOpen] = useState(false);
  const [packForm, setPackForm] = useState({
    university: '', college: '', course: 'B.Tech CSE', semester: 'Sem 3', subject: '', examType: 'End Term Test (ETT)',
  });

  const [contributeModal, setContributeModal] = useState(null); // 'pyq' | 'note' | null
  const [pyqForm, setPyqForm] = useState({
    year: 2025, marks: 10, section: 'Section B', unit: 'Unit 1', frequency: 'Important', question: '', answer: '', examTip: '',
  });
  const [noteForm, setNoteForm] = useState({
    unit: 'Unit 1', title: '', summary: '', keyPoints: '',
  });

  const showNotice = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const fetchMetaAndProgress = useCallback(async () => {
    try {
      const [metaRes, progRes] = await Promise.all([
        apiFetch('/examprep/meta'),
        apiFetch('/examprep/progress'),
      ]);
      if (metaRes?.data) setMeta(metaRes.data);
      if (progRes?.data) {
        setProgress({
          revisedQuestionIds: progRes.data.revisedQuestionIds || [],
          bookmarkedQuestionIds: progRes.data.bookmarkedQuestionIds || [],
        });
        setFilters((prev) => ({
          ...prev,
          course: progRes.data.course || prev.course,
          semester: progRes.data.semester || prev.semester,
          university: progRes.data.university || prev.university,
          college: progRes.data.college || prev.college,
          examType: progRes.data.examType || prev.examType,
        }));
      }
    } catch (e) {
      console.warn('Failed to load Exam Prep metadata, using demo metadata', e);
      setMeta(DEMO_FALLBACK_META);
    }
  }, []);

  const fetchPacks = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilters.course.trim()) params.set('course', activeFilters.course.trim());
      if (activeFilters.semester && activeFilters.semester !== 'All Semesters') {
        params.set('semester', activeFilters.semester);
      }
      if (activeFilters.university.trim()) params.set('university', activeFilters.university.trim());
      if (activeFilters.college.trim()) params.set('college', activeFilters.college.trim());
      if (activeFilters.examType && activeFilters.examType !== 'All Exam Types') {
        params.set('examType', activeFilters.examType);
      }
      if (activeFilters.subject.trim()) params.set('subject', activeFilters.subject.trim());
      if (activeFilters.search.trim()) params.set('search', activeFilters.search.trim());

      const res = await apiFetch(`/examprep?${params.toString()}`);
      const list = res.data || [];
      if (list.length === 0) {
        setPacks(DEMO_FALLBACK_PACKS);
        setSelectedPackId(DEMO_FALLBACK_PACKS[0]?.id || '');
      } else {
        setPacks(list);
        setMatchMode(res.matchMode || 'exact');
        const pickFirst = activeFilters.subject.trim() || activeFilters.search.trim();
        setSelectedPackId((prev) => (!pickFirst && list.some((p) => p.id === prev) ? prev : (list[0]?.id || '')));
      }
    } catch (e) {
      console.warn('Failed to fetch study packs, falling back to demo pack', e);
      setPacks(DEMO_FALLBACK_PACKS);
      setMatchMode('demo');
      setSelectedPackId(DEMO_FALLBACK_PACKS[0]?.id || '');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [metaRes, progRes] = await Promise.all([
          apiFetch('/examprep/meta'),
          apiFetch('/examprep/progress'),
        ]);
        if (!mounted) return;
        if (metaRes?.data) setMeta(metaRes.data);
        const p = progRes?.data || {};
        setProgress({
          revisedQuestionIds: p.revisedQuestionIds || [],
          bookmarkedQuestionIds: p.bookmarkedQuestionIds || [],
        });
        const initialFilters = {
          course: p.course || '',
          semester: p.semester || 'All Semesters',
          university: p.university || '',
          college: p.college || '',
          examType: p.examType || 'End Term Test (ETT)',
          subject: '',
          search: '',
        };
        setFilters(initialFilters);
        await fetchPacks(initialFilters);
      } catch (e) {
        console.warn('Failed to initialize Exam Prep Hub from backend, using demo data', e);
        if (mounted) {
          setMeta(DEMO_FALLBACK_META);
          setPacks(DEMO_FALLBACK_PACKS);
          setSelectedPackId(DEMO_FALLBACK_PACKS[0]?.id || '');
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [fetchPacks]);

  const handleApplyFilters = async (e, overrideFilters) => {
    if (e) e.preventDefault();
    const next = overrideFilters || filters;
    setYearFilter('All');
    setMarksFilter('All');
    await fetchPacks(next);
    try {
      await apiFetch('/examprep/progress', {
        method: 'PUT',
        body: JSON.stringify({
          course: next.course,
          semester: next.semester,
          university: next.university,
          college: next.college,
          examType: next.examType,
        }),
      });
    } catch {}
  };

  const handleQuickCourse = (c) => {
    const next = {
      ...filters,
      course: filters.course === c ? '' : c,
      subject: '',
      examType: c.includes('ETT') ? 'ETT Board Exam' : filters.examType,
    };
    setFilters(next);
    handleApplyFilters(null, next);
  };

  const activePack = packs.find((p) => p.id === selectedPackId) || packs[0] || null;

  const toggleAnswer = (qId) => {
    setExpandedPyqIds((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleProgressItem = async (field, qId) => {
    const currentList = progress[field] || [];
    const exists = currentList.includes(qId);
    const updatedList = exists ? currentList.filter((id) => id !== qId) : [...currentList, qId];
    setProgress((prev) => ({ ...prev, [field]: updatedList }));
    try {
      await apiFetch('/examprep/progress', {
        method: 'PUT',
        body: JSON.stringify({ [field]: updatedList }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveUnitToNotes = async (unitNote) => {
    if (!activePack) return;
    const bulletText = (unitNote.keyPoints || []).map((k) => `• ${k}`).join('\n');
    const content = `[${activePack.course} • ${activePack.university} • ${unitNote.unit}]\n\n${unitNote.summary}${bulletText ? `\n\nKey Revision Points:\n${bulletText}` : ''}`;
    await addNote({
      title: `${activePack.subject}: ${unitNote.title}`,
      subject: activePack.subject,
      content,
    });
    showNotice(`Saved "${unitNote.title}" to My Notes`);
  };

  const handleSaveCrashSummaryToNotes = async () => {
    if (!activePack?.crashSummary) return;
    const cs = activePack.crashSummary;
    const body = [
      cs.tagline,
      cs.passPlan ? `\nOne-Night Passing Plan:\n${cs.passPlan}` : '',
      ...(cs.units || []).map((u) => `\n--- ${u.unit}: ${u.title} ---\nAnalogy: ${u.analogy}\n${u.simpleExplanation}\nKey Formulas/Keywords: ${(u.keyFormulasOrKeywords || []).join(' | ')}`),
    ].filter(Boolean).join('\n');

    await addNote({
      title: `${activePack.subject} — Complete All-Unit Crash Summary`,
      subject: activePack.subject,
      content: body,
    });
    showNotice('Saved complete All-Unit Summary to My Notes');
  };

  const handleCreateTaskFromPyq = async (label) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const matchingSubject = subjects.find((s) =>
      activePack?.subject?.toLowerCase().includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes((activePack?.subject || '').toLowerCase())
    );
    await addTask({
      name: `Revise: ${label.slice(0, 120)}`,
      subjectId: matchingSubject?.id || '',
      priority: 'High',
      deadline: todayStr,
      estHours: 1.5,
      status: 'Pending',
    });
    showNotice('Added revision item to Tasks');
  };

  const handleCreatePack = async () => {
    if (!packForm.university.trim() || !packForm.course.trim() || !packForm.subject.trim()) return;
    try {
      const res = await apiFetch('/examprep', {
        method: 'POST',
        body: JSON.stringify(packForm),
      });
      setPackModalOpen(false);
      const nextFilters = {
        ...filters,
        university: packForm.university,
        college: packForm.college,
        course: packForm.course,
        examType: packForm.examType,
        subject: packForm.subject,
      };
      setFilters(nextFilters);
      await fetchMetaAndProgress();
      await fetchPacks(nextFilters);
      if (res?.data?.id) setSelectedPackId(res.data.id);
      showNotice('Created custom University & Course pack');
    } catch (e) {
      console.error(e);
    }
  };

  const handleContributeSubmit = async () => {
    if (!activePack) return;
    try {
      let targetPackId = activePack.id;
      if (activePack.isVirtualStarter) {
        const created = await apiFetch('/examprep', {
          method: 'POST',
          body: JSON.stringify({
            university: activePack.university,
            college: activePack.college || '',
            course: activePack.course,
            semester: activePack.semester || 'All Semesters',
            subject: activePack.subject,
            examType: activePack.examType,
          }),
        });
        targetPackId = created?.data?.id;
      }
      if (!targetPackId) return;

      if (contributeModal === 'pyq') {
        if (!pyqForm.question.trim() || !pyqForm.answer.trim()) return;
        const res = await apiFetch(`/examprep/${targetPackId}/pyq`, {
          method: 'POST',
          body: JSON.stringify(pyqForm),
        });
        setPyqForm({ year: 2025, marks: 10, section: 'Section B', unit: 'Unit 1', frequency: 'Important', question: '', answer: '', examTip: '' });
        await fetchPacks(filters);
        if (res?.data?.id) setSelectedPackId(res.data.id);
        showNotice('Added Previous Year Question & Answer');
      } else if (contributeModal === 'note') {
        if (!noteForm.title.trim() || !noteForm.summary.trim()) return;
        const res = await apiFetch(`/examprep/${targetPackId}/note`, {
          method: 'POST',
          body: JSON.stringify(noteForm),
        });
        setNoteForm({ unit: 'Unit 1', title: '', summary: '', keyPoints: '' });
        await fetchPacks(filters);
        if (res?.data?.id) setSelectedPackId(res.data.id);
        showNotice('Added Unit Note');
      }
      setContributeModal(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePack = async (packId) => {
    try {
      await apiFetch(`/examprep/${packId}`, { method: 'DELETE' });
      await fetchPacks(filters);
      showNotice('Removed custom study pack');
    } catch (e) {
      console.error(e);
    }
  };

  const totalNotesCount = packs.reduce((acc, p) => acc + (p.notes?.length || 0), 0);
  const totalPyqsCount = packs.reduce((acc, p) => acc + (p.pyqs?.length || 0), 0);
  const activePyqs = activePack?.pyqs || [];
  const activeNotes = activePack?.notes || [];
  const revisedInActive = activePyqs.filter((q) => progress.revisedQuestionIds.includes(q.id)).length;
  const availableYears = ['All', ...new Set(activePyqs.map((q) => String(q.year)))].sort((a, b) => (a === 'All' ? -1 : b.localeCompare(a)));
  const availableMarks = ['All', ...new Set(activePyqs.map((q) => Number(q.marks)).filter(Boolean)).values()]
    .sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a - b))
    .map(String);

  const qSearch = filters.search.trim().toLowerCase();
  const searchTargetsPack =
    qSearch &&
    activePack &&
    (activePack.subject.toLowerCase().includes(qSearch) ||
      qSearch.split(/\s+/).some((w) => w.length >= 3 && activePack.subject.toLowerCase().includes(w)) ||
      activePack.course.toLowerCase().includes(qSearch) ||
      activePack.university.toLowerCase().includes(qSearch));

  const filteredPyqs = activePyqs
    .filter((q) => {
      const matchYear = yearFilter === 'All' || String(q.year) === yearFilter;
      const matchMarks = marksFilter === 'All' || String(q.marks) === marksFilter;
      const isImp = q.isImportant !== false && /repeated|important|mtt|ett|sure/i.test(q.frequency || 'Important');
      const matchImportant = !importantOnly || isImp;
      const matchBookmark = !bookmarkedOnly || progress.bookmarkedQuestionIds.includes(q.id);
      const matchText = !qSearch || searchTargetsPack || q.question.toLowerCase().includes(qSearch) || q.answer.toLowerCase().includes(qSearch);
      return matchYear && matchMarks && matchImportant && matchBookmark && matchText;
    })
    .sort((a, b) => {
      const impA = a.isImportant !== false ? 1 : 0;
      const impB = b.isImportant !== false ? 1 : 0;
      if (impB !== impA) return impB - impA;
      return Number(b.marks || 0) - Number(a.marks || 0);
    });

  const normalizedCourseVal = normalizeCourseMatch(filters.course);
  const catalogForSelection = (meta.subjectCatalog || []).filter((item) => {
    const matchC = !normalizedCourseVal || item.course.toLowerCase() === normalizedCourseVal.toLowerCase();
    const matchS = !filters.semester || filters.semester === 'All Semesters' || item.semester === filters.semester;
    return matchC && matchS;
  });
  const selectableSubjectChips = [...new Set(catalogForSelection.map((i) => i.subject))];

  const allExpanded = filteredPyqs.length > 0 && filteredPyqs.every((q) => !!expandedPyqIds[q.id]);
  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedPyqIds({});
    } else {
      const next = { ...expandedPyqIds };
      filteredPyqs.forEach((q) => { next[q.id] = true; });
      setExpandedPyqIds(next);
    }
  };

  return (
    <div>
      <div className="page-head flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-eyebrow">University & ETT Exam Bank</div>
          <div className="page-title">Exam Prep Hub</div>
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {activePack && (
            <>
              <button className="btn btn-ghost" onClick={() => setContributeModal('note')}><LuFileText size={14} /> Add Note</button>
              <button className="btn btn-ghost" onClick={() => setContributeModal('pyq')}><LuPlus size={14} /> Add PYQ & Answer</button>
            </>
          )}
          <button className="btn btn-primary" onClick={() => setPackModalOpen(true)}><LuGraduationCap size={15} /> New University Pack</button>
        </div>
      </div>

      {feedback && (
        <div className="panel panel-pad mb-4 fade-in" style={{ background: 'var(--sage-wash)', borderColor: 'var(--sage)' }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--sage-deep)' }}>{feedback}</div>
        </div>
      )}

      {/* Course, Semester, University/College & ETT Exam Selector */}
      <form onSubmit={(e) => handleApplyFilters(e)} className="panel panel-pad mb-6">
        <div className="grid grid-3 mb-3">
          <div className="field">
            <label className="field-label">Your Course / Stream</label>
            <input
              list="course-options"
              className="field-input"
              placeholder="e.g. B.Tech CSE, BCA, ETT / D.El.Ed"
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value, subject: '' })}
            />
            <datalist id="course-options">
              {meta.courses.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div className="field">
            <label className="field-label">Semester</label>
            <select
              className="field-input"
              value={filters.semester}
              onChange={(e) => {
                const next = { ...filters, semester: e.target.value, subject: '' };
                setFilters(next);
                handleApplyFilters(null, next);
              }}
            >
              {SEMESTER_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">University / College</label>
            <input
              list="univ-options"
              className="field-input"
              placeholder="e.g. CT University, AKTU, DU, SPPU"
              value={filters.university}
              onChange={(e) => setFilters({ ...filters, university: e.target.value })}
            />
            <datalist id="univ-options">
              {meta.universities.map((u) => <option key={u} value={u} />)}
            </datalist>
          </div>
        </div>

        <div className="grid grid-2 mb-4">
          <div className="field">
            <label className="field-label">Exam Pattern / ETT</label>
            <select
              className="field-input"
              value={filters.examType}
              onChange={(e) => {
                const next = { ...filters, examType: e.target.value };
                setFilters(next);
                handleApplyFilters(null, next);
              }}
            >
              {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Subject / Topic Search</label>
            <SearchInput
              value={filters.search}
              onChange={(val) => setFilters({ ...filters, search: val, subject: '' })}
              placeholder="e.g. Machine Learning, Discrete Structures, DBMS..."
            />
          </div>
        </div>

        {selectableSubjectChips.length > 0 && (
          <div className="mb-4" style={{ padding: '12px 14px', background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div className="text-xs font-bold muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Select Subject ({filters.semester !== 'All Semesters' ? filters.semester : 'All Semesters'}) — then click Find Notes & PYQs
            </div>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {selectableSubjectChips.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  className={`btn btn-sm ${filters.subject === subj ? 'btn-accent' : 'btn-ghost'}`}
                  onClick={() => setFilters((prev) => ({
                    ...prev,
                    subject: prev.subject === subj ? '' : subj,
                    search: '',
                  }))}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="flex gap-2 items-center" style={{ flexWrap: 'wrap' }}>
            <span className="text-xs font-semibold muted">Quick Courses:</span>
            {QUICK_COURSES.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-sm ${filters.course === c ? 'btn-accent' : 'btn-ghost'}`}
                onClick={() => handleQuickCourse(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const reset = { course: '', semester: 'All Semesters', university: '', college: '', examType: 'All Exam Types', subject: '', search: '' };
                setFilters(reset);
                handleApplyFilters(null, reset);
              }}
            >
              Show All
            </button>
            <button type="submit" className="btn btn-primary btn-sm"><LuSparkles size={13} /> Find Notes & PYQs</button>
          </div>
        </div>
      </form>

      {/* Summary Stats */}
      <div className="grid grid-4 mb-6">
        <StatCard label="Matched Subjects" value={packs.length} icon={LuLayers} accent="amber" />
        <StatCard label="Unit Study Notes" value={totalNotesCount} icon={LuFileText} accent="slate" />
        <StatCard label="Solved PYQs" value={totalPyqsCount} icon={LuBookOpenCheck} accent="coral" />
        <StatCard
          label="Revised in Subject"
          value={`${revisedInActive}/${activePyqs.length}`}
          icon={LuCheck}
          accent="sage"
          sub={activePyqs.length ? `${Math.round((revisedInActive / activePyqs.length) * 100)}% exam ready` : 'Select a subject'}
        />
      </div>

      {/* Match Banner when adapted for custom college/university */}
      {activePack?.adaptedInfo && (
        <div className="panel panel-pad mb-6" style={{ background: 'var(--amber-wash)', borderColor: 'var(--amber)' }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--amber-deep)' }}>
            Adapted for {activePack.adaptedInfo.requestedUniversity} • {activePack.adaptedInfo.requestedCourse} ({activePack.adaptedInfo.requestedExamType})
          </div>
          <div className="text-xs soft mt-2">
            Showing verified core syllabus notes, solved PYQs, and tailored exam blueprint. You can also click "New University Pack" or "Add PYQ & Answer" to save your college's exact paper!
          </div>
        </div>
      )}

      {loading ? (
        <div className="panel panel-pad text-sm muted">Loading university notes and previous year papers...</div>
      ) : packs.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon="🎓"
            title="No matching study pack found"
            description="Clear filters or create a custom pack for your university and course."
            action={<button className="btn btn-primary" onClick={() => setPackModalOpen(true)}><LuPlus size={14} /> Create Custom Pack</button>}
          />
        </div>
      ) : (
        <>
          {/* Subject Pack Switcher */}
          <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
            {packs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setSelectedPackId(p.id); setYearFilter('All'); setMarksFilter('All'); }}
                className={`btn btn-sm ${activePack?.id === p.id ? 'btn-primary' : 'btn-ghost'}`}
              >
                <span>{p.subject}</span>
                <span className="text-xs" style={{ opacity: 0.75 }}>({p.course})</span>
              </button>
            ))}
          </div>

          {activePack && (
            <div>
              {/* Active Pack Header */}
              <div className="panel panel-pad mb-6">
                <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div className="flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
                      <Pill tone="amber">{activePack.course}</Pill>
                      <Pill tone="slate">{activePack.university}</Pill>
                      <Pill tone="coral">{activePack.examType}</Pill>
                      <Pill tone="sage">{activePack.semester}</Pill>
                    </div>
                    <h2 style={{ fontSize: 22 }}>{activePack.subject}</h2>
                    <div className="text-xs muted mt-2">
                      {activeNotes.length} Unit Notes • {activePyqs.length} Solved PYQs • {activePack.examPattern?.totalMarks || 70} Marks ({activePack.examPattern?.duration || '3 Hours'})
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!activePack.isGlobal && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeletePack(activePack.id)}>
                        <LuTrash2 size={13} /> Delete Custom Pack
                      </button>
                    )}
                  </div>
                </div>
                {activePyqs.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="muted">Subject PYQ Mastery</span>
                      <span className="font-semibold">{revisedInActive} of {activePyqs.length} revised</span>
                    </div>
                    <ProgressBar value={revisedInActive} max={activePyqs.length} color="var(--sage)" />
                  </div>
                )}
              </div>

              <Tabs
                tabs={[
                  { label: 'Previous Year Q&A (PYQs)', value: 'pyqs', count: activePyqs.length },
                  { label: 'All Study Notes', value: 'notes', count: activeNotes.length },
                  { label: 'Quick Summary (All Units)', value: 'summary', count: activePack.crashSummary?.units?.length || 0 },
                  { label: 'ETT & Exam Pattern', value: 'pattern' },
                ]}
                active={activeTab}
                onChange={setActiveTab}
              />

              {/* TAB 1: SOLVED PYQs */}
              {activeTab === 'pyqs' && (
                <div>
                  <div className="flex justify-between items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                      {availableYears.map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          className={`btn btn-sm ${yearFilter === yr ? 'btn-accent' : 'btn-ghost'}`}
                          onClick={() => setYearFilter(yr)}
                        >
                          {yr === 'All' ? 'All Years' : yr}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${importantOnly ? 'btn-accent' : 'btn-ghost'}`}
                        onClick={() => setImportantOnly(!importantOnly)}
                      >
                        <LuSparkles size={13} /> Important & Repeated Only
                      </button>
                      {filteredPyqs.length > 0 && (
                        <button type="button" className="btn btn-sm btn-ghost" onClick={toggleExpandAll}>
                          {allExpanded ? <LuChevronUp size={13} /> : <LuChevronDown size={13} />}
                          {allExpanded ? 'Collapse All Answers' : 'Expand All Answers'}
                        </button>
                      )}
                      <button
                        type="button"
                        className={`btn btn-sm ${bookmarkedOnly ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                      >
                        <LuBookmark size={13} /> Bookmarked ({progress.bookmarkedQuestionIds.length})
                      </button>
                    </div>
                  </div>

                  {availableMarks.length > 2 && (
                    <div className="flex gap-2 items-center mb-4" style={{ flexWrap: 'wrap' }}>
                      <span className="text-xs font-semibold muted">Filter by ETT Marks:</span>
                      {availableMarks.map((mk) => (
                        <button
                          key={mk}
                          type="button"
                          className={`btn btn-sm ${marksFilter === mk ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setMarksFilter(mk)}
                        >
                          {mk === 'All' ? `All Marks (${activePyqs.length})` : `${mk} Mark${mk === '1' ? '' : 's'} (${activePyqs.filter((q) => String(q.marks) === mk).length})`}
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredPyqs.length === 0 ? (
                    <div className="panel">
                      <EmptyState
                        icon="📄"
                        title="No matching questions"
                        description="Adjust year/bookmark filter or add a previous year question with solution."
                        action={<button className="btn btn-primary btn-sm" onClick={() => setContributeModal('pyq')}><LuPlus size={13} /> Add PYQ & Answer</button>}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {filteredPyqs.map((q) => {
                        const isOpen = !!expandedPyqIds[q.id];
                        const isRevised = progress.revisedQuestionIds.includes(q.id);
                        const isSaved = progress.bookmarkedQuestionIds.includes(q.id);
                        return (
                          <div key={q.id} className="panel panel-pad fade-in">
                            <div className="flex justify-between items-start mb-3" style={{ flexWrap: 'wrap', gap: 8 }}>
                              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                <Pill tone="amber">{q.year}</Pill>
                                <Pill tone="slate">{q.marks} Marks</Pill>
                                <Pill tone="sage">{q.section} • {q.unit}</Pill>
                                {q.frequency && <Pill tone="coral">{q.frequency}</Pill>}
                              </div>
                              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  className={`btn btn-sm ${isRevised ? 'btn-accent' : 'btn-ghost'}`}
                                  onClick={() => toggleProgressItem('revisedQuestionIds', q.id)}
                                >
                                  <LuCheck size={13} /> {isRevised ? 'Revised' : 'Mark Revised'}
                                </button>
                                <button
                                  type="button"
                                  className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-ghost'}`}
                                  onClick={() => toggleProgressItem('bookmarkedQuestionIds', q.id)}
                                >
                                  <LuBookmark size={13} /> {isSaved ? 'Saved' : 'Save'}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => handleCreateTaskFromPyq(q.question)}
                                >
                                  <LuPlus size={13} /> Add Task
                                </button>
                              </div>
                            </div>

                            <div className="font-semibold mb-3" style={{ fontSize: 15.5, lineHeight: 1.5 }}>{q.question}</div>

                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => toggleAnswer(q.id)}
                            >
                              {isOpen ? <LuChevronUp size={14} /> : <LuChevronDown size={14} />}
                              {isOpen ? 'Hide Full Answer' : 'View Full Answer & Exam Tip'}
                            </button>

                            {isOpen && (
                              <div className="mt-4 fade-in" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
                                <div className="text-xs font-bold muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>Model Exam Solution</div>
                                <div className="text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{q.answer}</div>
                                {q.examTip && (
                                  <div className="mt-3 text-xs" style={{ background: 'var(--amber-wash)', color: 'var(--amber-deep)', padding: '10px 12px', borderRadius: 8 }}>
                                    <strong>Exam Scoring Tip:</strong> {q.examTip}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ALL UNIT NOTES */}
              {activeTab === 'notes' && (
                <div>
                  {activeNotes.length === 0 ? (
                    <div className="panel">
                      <EmptyState
                        icon="📚"
                        title="No unit notes yet"
                        description="Add structured unit notes for quick exam revision."
                        action={<button className="btn btn-primary btn-sm" onClick={() => setContributeModal('note')}><LuPlus size={13} /> Add Unit Note</button>}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-2">
                      {activeNotes.map((n) => (
                        <div key={n.id} className="panel panel-pad fade-in flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <Pill tone="amber">{n.unit}</Pill>
                              <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleSaveUnitToNotes(n)}>
                                <LuCopy size={13} /> Save to My Notes
                              </button>
                            </div>
                            <h3 className="mb-2" style={{ fontSize: 17 }}>{n.title}</h3>
                            <p className="text-sm soft mb-4" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{n.summary}</p>
                            
                            {/* Visual Diagram for Unit */}
                            <VisualDiagram
                              type={n.diagram || n.title || activePack.subject}
                              title={`${n.unit}: ${n.title}`}
                              caption={`Visual architectural illustration for ${n.title}`}
                            />

                            {n.keyPoints?.length > 0 && (
                              <div style={{ background: 'var(--paper)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--line)' }}>
                                <div className="text-xs font-bold mb-2" style={{ color: 'var(--amber-deep)', textTransform: 'uppercase' }}>Quick Exam Cheatsheet</div>
                                <ul className="text-xs soft" style={{ paddingLeft: 16, lineHeight: 1.7 }}>
                                  {n.keyPoints.map((kp, idx) => <li key={idx}>{kp}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: QUICK SUMMARY (ZERO-TO-EXAM ALL UNITS) */}
              {activeTab === 'summary' && (
                <div className="flex flex-col gap-4">
                  <div className="panel panel-pad" style={{ background: 'var(--amber-wash)', borderColor: 'var(--amber)' }}>
                    <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div className="page-eyebrow">Zero-to-Exam All-Units Guide</div>
                        <h3 className="mb-2" style={{ fontSize: 19 }}>{activePack.crashSummary?.tagline || `Quick Easy Revision for ${activePack.subject}`}</h3>
                        {activePack.crashSummary?.passPlan && (
                          <p className="text-sm soft" style={{ lineHeight: 1.7 }}>
                            <strong>One-Night Pass Strategy:</strong> {activePack.crashSummary.passPlan}
                          </p>
                        )}
                      </div>
                      <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveCrashSummaryToNotes}>
                        <LuCopy size={13} /> Save Full Summary to Notes
                      </button>
                    </div>
                  </div>

                  {(activePack.crashSummary?.units || []).length === 0 ? (
                    <div className="panel"><EmptyState icon="✨" title="Summary coming soon" description="Add unit notes to build an instant exam summary." /></div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {activePack.crashSummary.units.map((u, idx) => (
                        <div key={idx} className="panel panel-pad fade-in">
                          <div className="flex justify-between items-center mb-3" style={{ flexWrap: 'wrap', gap: 8 }}>
                            <div className="flex items-center gap-2">
                              <Pill tone="amber">{u.unit}</Pill>
                              <h3 style={{ fontSize: 17 }}>{u.title}</h3>
                            </div>
                          </div>

                          {u.analogy && (
                            <div className="mb-3 text-sm" style={{ background: 'var(--sage-wash)', color: 'var(--sage-deep)', padding: '10px 14px', borderRadius: 10 }}>
                              <strong>Easy Real-Life Example:</strong> {u.analogy}
                            </div>
                          )}

                          <p className="text-sm soft mb-4" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
                            {u.simpleExplanation}
                          </p>

                          {/* Visual Diagram for Unit Summary */}
                          <VisualDiagram
                            type={u.diagram || u.title || activePack.subject}
                            title={`${u.unit}: Visual Concept & Architecture`}
                            caption={`Key conceptual diagram for ${u.title}`}
                          />

                          {u.keyFormulasOrKeywords?.length > 0 && (
                            <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px' }}>
                              <div className="text-xs font-bold mb-2" style={{ color: 'var(--amber-deep)', textTransform: 'uppercase' }}>Must-Remember Formulas & Exam Keywords</div>
                              <ul className="text-xs soft" style={{ paddingLeft: 18, lineHeight: 1.75 }}>
                                {u.keyFormulasOrKeywords.map((kw, kIdx) => <li key={kIdx}>{kw}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ETT & UNIVERSITY EXAM PATTERN */}
              {activeTab === 'pattern' && (
                <div className="grid grid-2" style={{ alignItems: 'start' }}>
                  <div className="panel panel-pad">
                    <h3 className="mb-4" style={{ fontSize: 18 }}>Question Paper Blueprint</h3>
                    <div className="grid grid-3 mb-4">
                      <div className="panel panel-pad" style={{ background: 'var(--amber-wash)', border: 'none' }}>
                        <div className="text-xs muted">Total Marks</div>
                        <div className="font-bold" style={{ fontSize: 22 }}>{activePack.examPattern?.totalMarks || 70}</div>
                      </div>
                      <div className="panel panel-pad" style={{ background: 'var(--slate-wash)', border: 'none' }}>
                        <div className="text-xs muted">Duration</div>
                        <div className="font-bold" style={{ fontSize: 18 }}>{activePack.examPattern?.duration || '3 Hours'}</div>
                      </div>
                      <div className="panel panel-pad" style={{ background: 'var(--sage-wash)', border: 'none' }}>
                        <div className="text-xs muted">Passing</div>
                        <div className="font-semibold text-sm">{activePack.examPattern?.passingMarks || '40%'}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {(activePack.examPattern?.sections || []).map((sec, idx) => (
                        <div key={idx} className="tab-mark" style={{ padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm">{sec.name}</span>
                            <Pill tone="amber">{sec.questionCount} • {sec.marksPerQuestion}</Pill>
                          </div>
                          <div className="text-xs soft">{sec.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel panel-pad">
                    <h3 className="mb-2" style={{ fontSize: 18 }}>High-Weightage Repeated Topics</h3>
                    <p className="text-xs muted mb-4">Focus on these recurring university topics first for maximum ETT/Final marks.</p>
                    <div className="flex flex-col gap-2">
                      {(activePack.examPattern?.highWeightageTopics || []).map((topic, idx) => (
                        <div key={idx} className="row-item" style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 10 }}>
                          <span className="mono text-xs font-bold" style={{ color: 'var(--amber-deep)' }}>#{idx + 1}</span>
                          <span className="text-sm font-semibold" style={{ flex: 1 }}>{topic}</span>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleCreateTaskFromPyq(`${activePack.subject}: ${topic}`)}>
                            <LuPlus size={12} /> Schedule
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal: Create Custom University & Course Pack */}
      <Modal
        open={packModalOpen}
        onClose={() => setPackModalOpen(false)}
        title="Add University / Course Exam Pack"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setPackModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreatePack}>Create Pack</button>
        </>}
      >
        <div className="field">
          <label className="field-label">University / College Name</label>
          <input className="field-input" value={packForm.university} onChange={(e) => setPackForm({ ...packForm, university: e.target.value })} placeholder="e.g. Lucknow University / ABC College" />
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label className="field-label">Course</label>
            <input className="field-input" value={packForm.course} onChange={(e) => setPackForm({ ...packForm, course: e.target.value })} placeholder="e.g. BCA, B.Tech CSE, ETT" />
          </div>
          <div className="field">
            <label className="field-label">Semester / Year</label>
            <input className="field-input" value={packForm.semester} onChange={(e) => setPackForm({ ...packForm, semester: e.target.value })} placeholder="e.g. Sem 4" />
          </div>
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label className="field-label">Subject Name</label>
            <input className="field-input" value={packForm.subject} onChange={(e) => setPackForm({ ...packForm, subject: e.target.value })} placeholder="e.g. Discrete Mathematics" />
          </div>
          <div className="field">
            <label className="field-label">Exam Type</label>
            <select className="field-input" value={packForm.examType} onChange={(e) => setPackForm({ ...packForm, examType: e.target.value })}>
              {EXAM_TYPES.filter((t) => t !== 'All Exam Types').map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal: Contribute PYQ or Unit Note */}
      <Modal
        open={!!contributeModal}
        onClose={() => setContributeModal(null)}
        title={contributeModal === 'pyq' ? `Add PYQ & Answer (${activePack?.subject})` : `Add Unit Note (${activePack?.subject})`}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setContributeModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleContributeSubmit}>Save to Database</button>
        </>}
      >
        {contributeModal === 'pyq' ? (
          <>
            <div className="grid grid-3">
              <div className="field">
                <label className="field-label">Year</label>
                <input type="number" className="field-input" value={pyqForm.year} onChange={(e) => setPyqForm({ ...pyqForm, year: Number(e.target.value) })} />
              </div>
              <div className="field">
                <label className="field-label">Marks</label>
                <input type="number" className="field-input" value={pyqForm.marks} onChange={(e) => setPyqForm({ ...pyqForm, marks: Number(e.target.value) })} />
              </div>
              <div className="field">
                <label className="field-label">Unit</label>
                <input className="field-input" value={pyqForm.unit} onChange={(e) => setPyqForm({ ...pyqForm, unit: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Previous Year Question</label>
              <textarea className="field-input" rows={3} value={pyqForm.question} onChange={(e) => setPyqForm({ ...pyqForm, question: e.target.value })} placeholder="Enter exact university question..." />
            </div>
            <div className="field">
              <label className="field-label">Model Answer / Solution</label>
              <textarea className="field-input" rows={5} value={pyqForm.answer} onChange={(e) => setPyqForm({ ...pyqForm, answer: e.target.value })} placeholder="Write clear step-by-step exam solution..." />
            </div>
            <div className="field">
              <label className="field-label">Exam Scoring Tip (Optional)</label>
              <input className="field-input" value={pyqForm.examTip} onChange={(e) => setPyqForm({ ...pyqForm, examTip: e.target.value })} placeholder="e.g. Draw diagram for full marks" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-2">
              <div className="field">
                <label className="field-label">Unit</label>
                <input className="field-input" value={noteForm.unit} onChange={(e) => setNoteForm({ ...noteForm, unit: e.target.value })} />
              </div>
              <div className="field">
                <label className="field-label">Topic Title</label>
                <input className="field-input" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="e.g. Deadlock & Semaphores" />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Full Study Notes</label>
              <textarea className="field-input" rows={5} value={noteForm.summary} onChange={(e) => setNoteForm({ ...noteForm, summary: e.target.value })} placeholder="Write comprehensive concepts & formulas..." />
            </div>
            <div className="field">
              <label className="field-label">Key Bullet Points (One per line)</label>
              <textarea className="field-input" rows={3} value={noteForm.keyPoints} onChange={(e) => setNoteForm({ ...noteForm, keyPoints: e.target.value })} placeholder="Key formula 1&#10;Key distinction 2" />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
