const ExamPrepPack = require('../models/ExamPrepPack');
const ExamPrepProgress = require('../models/ExamPrepProgress');
const { HTTP_STATUS } = require('../constants');

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeCourseInput(raw) {
  if (!raw || !raw.trim()) return '';
  const compact = raw.toLowerCase().replace(/[\s.\-_\/]+/g, '');
  if (compact.includes('btech') || compact.includes('becse') || compact === 'cse') return 'B.Tech CSE';
  if (compact.includes('bca')) return 'BCA';
  if (compact.includes('mca')) return 'MCA';
  if (compact.includes('bsc')) return 'B.Sc CS';
  if (compact.includes('ett') || compact.includes('deled')) return 'ETT / D.El.Ed';
  if (compact.includes('bba') || compact.includes('bcom') || compact.includes('mba')) return 'BBA / B.Com';
  return raw.trim();
}

function normalizeSemesterInput(raw) {
  if (!raw || !raw.trim()) return '';
  const trimmed = raw.trim();
  if (/^all/i.test(trimmed)) return '';
  const numMatch = trimmed.match(/^(?:sem(?:ester)?\s*)?([1-8])(?:st|nd|rd|th)?$/i);
  if (numMatch) return `Sem ${numMatch[1]}`;
  return trimmed;
}

const SUBJECT_ALIASES = {
  dsa: 'Data Structures',
  dbms: 'Database Management',
  os: 'Operating Systems',
  cn: 'Computer Networks',
  coa: 'Computer Organization',
  daa: 'Design & Analysis of Algorithms',
  toc: 'Theory of Computation',
  automata: 'Theory of Computation',
  cd: 'Compiler Design',
  compiler: 'Compiler Design',
  se: 'Software Engineering',
  oop: 'Object-Oriented Programming',
  oops: 'Object-Oriented Programming',
  ai: 'Artificial Intelligence',
  ml: 'Machine Learning',
  dl: 'Deep Learning',
  nlp: 'Natural Language Processing',
  dms: 'Discrete Structures',
  discrete: 'Discrete Structures',
  c: 'Programming in C',
  math: 'Engineering Mathematics',
  maths: 'Engineering Mathematics',
  de: 'Digital Electronics',
  digital: 'Digital Electronics',
  cloud: 'Cloud Computing',
  devops: 'Cloud Computing & DevOps',
  security: 'Cyber Security',
  crypto: 'Cyber Security & Cryptography',
};

function expandSearchTokens(rawSearch) {
  const cleaned = String(rawSearch || '').trim();
  if (!cleaned) return [];

  const lower = cleaned.toLowerCase();
  const extraPhrases = [];
  for (const [abbr, expansion] of Object.entries(SUBJECT_ALIASES)) {
    if (lower === abbr || lower.split(/\s+/).includes(abbr)) {
      extraPhrases.push(expansion);
    }
  }

  const baseTokens = cleaned
    .split(/[\s,.\-_/+]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !['and', 'of', 'in', 'the', 'for', 'notes', 'pyq', 'pyqs', 'exam'].includes(t.toLowerCase()));

  return [...new Set([...extraPhrases, ...baseTokens])];
}

const CURATED_UNIVERSITIES = [
  'CT University (Ludhiana)',
  'AKTU (Dr. A.P.J. Abdul Kalam Technical University)',
  'IKGPTU (Jalandhar)',
  'Chandigarh University',
  'Delhi University (DU)',
  'GGSIPU (IP University)',
  'Mumbai University',
  'SPPU (Savitribai Phule Pune University)',
  'Anna University',
  'VTU (Belagavi)',
  'RGPV (Bhopal)',
  'SCERT / PSEB (Punjab ETT Board)',
  'IGNOU',
];

const DEFAULT_EXAM_BLUEPRINTS = {
  'End Term Test (ETT)': {
    totalMarks: 60,
    duration: '3 Hours',
    passingMarks: '40% Overall (ETT 60 Marks + MTT/Internal 40 Marks)',
    sections: [
      { name: 'Section A (1M x 10)', questionCount: '10 Questions (All Compulsory)', marksPerQuestion: '1 Mark each (10 Marks)', description: 'Objective / MCQs, definitions, notations, truth values & one-line facts.' },
      { name: 'Section B (2M x 5)', questionCount: '5 Questions (All Compulsory)', marksPerQuestion: '2 Marks each (10 Marks)', description: 'Short derivations, formulas, counterexamples & concise comparisons.' },
      { name: 'Section C (5M x 4)', questionCount: '4 Questions (Internal Choice)', marksPerQuestion: '5 Marks each (20 Marks)', description: 'MTT-level analytical problems, proofs, truth tables & conversions.' },
      { name: 'Section D (10M x 2 of 3)', questionCount: '3 Given -> Attempt any 2', marksPerQuestion: '10 Marks each (20 Marks)', description: 'Long comprehensive problems: Hasse diagrams, recurrences, theorems & algorithms.' },
    ],
  },
  'Mid Term (MST)': {
    totalMarks: 30,
    duration: '1.5 Hours',
    passingMarks: '40% MTT / Internal Sessional',
    sections: [
      { name: 'Section A (1M x 5)', questionCount: '5 Short Questions', marksPerQuestion: '1 Mark each (5 Marks)', description: 'Unit 1 & 2 rapid objective concepts.' },
      { name: 'Section B (2M x 5)', questionCount: '5 Short Questions', marksPerQuestion: '2 Marks each (10 Marks)', description: 'Short definitions & properties from MTT syllabus.' },
      { name: 'Section C (5M x 3)', questionCount: '3 Analytical Questions', marksPerQuestion: '5 Marks each (15 Marks)', description: 'Medium numericals & proofs directly feeding into ETT Sections C & D.' },
    ],
  },
  'Semester Final': {
    totalMarks: 80,
    duration: '3 Hours',
    passingMarks: '40% Overall',
    sections: [
      { name: 'Part A', questionCount: 'Compulsory Short Questions', marksPerQuestion: '20 Marks total', description: 'Full-syllabus conceptual questions.' },
      { name: 'Part B', questionCount: 'Descriptive Unit Choice', marksPerQuestion: '60 Marks total', description: 'Deep analytical problems, proofs, and case studies.' },
    ],
  },
  'ETT Board Exam': {
    totalMarks: 100,
    duration: '2.5 Hours',
    passingMarks: '40% Qualifying / Merit Cut-off',
    sections: [
      { name: 'Section A', questionCount: '10 Short / Objective Questions', marksPerQuestion: '2 Marks each (20)', description: 'Pedagogy theorists, NEP 2020, RTE Act & key principles.' },
      { name: 'Section B', questionCount: '8 Short Analytical Questions', marksPerQuestion: '5 Marks each (40)', description: 'Inclusive education, assessment & classroom scenarios.' },
      { name: 'Section C', questionCount: '4 Long Essay Questions', marksPerQuestion: '10 Marks each (40)', description: 'Lesson planning, learning theories & teaching methodologies.' },
    ],
  },
};

function buildAdaptedCustomSubjectPack({ university, college, course, examType, subject }) {
  const effectiveCourse = normalizeCourseInput(course) || 'B.Tech CSE';
  const effectiveUniv = [university.trim(), college.trim()].filter(Boolean).join(' • ') || 'Your University / College';
  const effectiveExam = examType.trim() || 'End Term Test (ETT)';
  const topicName = subject.trim();
  const blueprint = DEFAULT_EXAM_BLUEPRINTS[effectiveExam] || DEFAULT_EXAM_BLUEPRINTS['End Term Test (ETT)'];

  return {
    id: `adapted_${topicName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    university: effectiveUniv,
    college: college.trim(),
    course: effectiveCourse,
    semester: 'Custom Match',
    subject: topicName,
    examType: effectiveExam,
    isGlobal: true,
    isVirtualStarter: true,
    examPattern: {
      ...blueprint,
      highWeightageTopics: [
        `${topicName} Core Definitions & Architecture`,
        `${topicName} Proofs, Numericals & Derivations`,
        `${topicName} Comparison Tables & Applications`,
        `${topicName} Previous Year Section C Essay Topics`,
      ],
    },
    notes: [
      {
        id: 'starter_unit_1',
        unit: 'Unit 1',
        title: `${topicName} — ETT Revision Framework`,
        summary: `This starter exam guide is tailored for ${topicName} (${effectiveCourse} at ${effectiveUniv} — ${effectiveExam}). Focus first on foundational definitions (Section A: 2-mark questions), diagrams/flowcharts (Section B: 5-mark questions), and end-to-end algorithms, derivations, or case proofs (Section C: 10-mark questions). Click "New University Pack" above to save ${topicName} to your personal MongoDB bank and upload your college PYQs & unit notes!`,
        keyPoints: [
          `Review ${effectiveUniv}'s 3-section ETT pattern: Definitions (2M), Derivations/Diagrams (5M), Long Proofs (10M).`,
          'Create a custom pack for this subject via "New University Pack" to permanently add unit notes & solved papers.',
        ],
      },
    ],
    pyqs: [],
    adaptedInfo: {
      mode: 'adapted_subject',
      requestedUniversity: effectiveUniv,
      requestedCourse: effectiveCourse,
      requestedExamType: effectiveExam,
    },
  };
}

function ensureCrashSummary(json) {
  if (json.crashSummary && Array.isArray(json.crashSummary.units) && json.crashSummary.units.length > 0) {
    return json.crashSummary;
  }
  const units = (json.notes || []).map((n) => ({
    unit: n.unit || 'Unit',
    title: n.title,
    analogy: `Quick Exam Idea: ${n.title} — pehle core concept + diagram samjho, phir Section B/C/D numericals ya differences likho.`,
    simpleExplanation: n.summary,
    keyFormulasOrKeywords: n.keyPoints || [],
    diagram: n.diagram || n.title || json.subject,
  }));
  const topTopics = (json.examPattern?.highWeightageTopics || []).slice(0, 3).join(', ');
  return {
    tagline: `Zero-to-Exam Quick Summary for ${json.subject} (${json.semester || json.course}): Sabhi Units simple bhasha me!`,
    passPlan: topTopics
      ? `Sabse pehle ye sure-shot repeated topics cover karein: ${topTopics}. Har 5M/10M answer me ek neat diagram aur bullet points zaroor banayein.`
      : 'Har Unit ke key formulas & 1 diagram yaad karein aur Section D ke 2 long questions pehle pakke karein.',
    units,
  };
}

exports.getMeta = async (req, res, next) => {
  try {
    const scope = { $or: [{ isGlobal: true }, { userId: req.user.id }] };
    const packs = await ExamPrepPack.find(scope).select('university course examType subject semester');

    const dbUnivs = packs.flatMap((p) => String(p.university || '').split('/').map((s) => s.trim())).filter(Boolean);
    const universities = [...new Set([...CURATED_UNIVERSITIES, ...dbUnivs])].sort();
    const courses = [...new Set(['B.Tech CSE', 'BCA', 'MCA', 'B.Sc CS', 'ETT / D.El.Ed', 'BBA / B.Com', ...packs.map((p) => p.course).filter(Boolean)])].sort();
    const semesters = [...new Set(['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Year 1 & Year 2', ...packs.map((p) => p.semester).filter(Boolean)])];
    const examTypes = [...new Set([
      'End Term Test (ETT)',
      'Mid Term (MST)',
      'Semester Final',
      'ETT Board Exam',
      ...packs.map((p) => p.examType).filter(Boolean),
    ])];
    const subjects = [...new Set(packs.map((p) => p.subject).filter(Boolean))].sort();
    const subjectCatalog = packs.map((p) => ({
      id: p._id.toString(),
      course: p.course,
      semester: p.semester,
      subject: p.subject,
      examType: p.examType,
    }));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { universities, courses, semesters, examTypes, subjects, subjectCatalog },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchPacks = async (req, res, next) => {
  try {
    const { university = '', college = '', course = '', semester = '', examType = '', subject = '', search = '' } = req.query || {};
    const scope = { $or: [{ isGlobal: true }, { userId: req.user.id }] };
    const normalizedCourse = normalizeCourseInput(course);
    const normalizedSemester = normalizeSemesterInput(semester);
    const searchTokens = expandSearchTokens(subject || search);

    const buildFilter = ({ useUniv, useCourse, useSem, useExamType, useTokens }) => {
      const f = { ...scope };
      const andClauses = [];

      if (useUniv && university.trim()) {
        const cleanUniv = university.trim().replace(/\(.*?\)/g, '').trim() || university.trim();
        andClauses.push({ university: new RegExp(escapeRegex(cleanUniv), 'i') });
      }
      if (useCourse && normalizedCourse) {
        andClauses.push({ course: new RegExp(escapeRegex(normalizedCourse), 'i') });
      }
      if (useSem && normalizedSemester) {
        andClauses.push({ semester: new RegExp(escapeRegex(normalizedSemester), 'i') });
      }
      if (useExamType && examType.trim()) {
        andClauses.push({ examType: new RegExp(escapeRegex(examType.trim()), 'i') });
      }
      if (subject.trim() && !useTokens) {
        andClauses.push({ subject: new RegExp(escapeRegex(subject.trim()), 'i') });
      }
      if (useTokens && searchTokens.length > 0) {
        const tokenOr = searchTokens.flatMap((tok) => {
          const rx = new RegExp(escapeRegex(tok), 'i');
          return [
            { subject: rx },
            { 'notes.title': rx },
            { 'notes.summary': rx },
            { 'pyqs.question': rx },
            { 'pyqs.answer': rx },
          ];
        });
        andClauses.push({ $or: tokenOr });
      }

      if (andClauses.length > 0) {
        f.$and = andClauses;
      }
      return f;
    };

    let matchMode = 'exact';

    // 1. Exact University + Course + Semester + Exam Type + Search Tokens
    let packs = await ExamPrepPack.find(
      buildFilter({ useUniv: true, useCourse: true, useSem: true, useExamType: true, useTokens: true })
    ).sort('-isGlobal -createdAt');

    // 2. Match University + Course + Semester + Search Tokens (adapt Exam Type)
    if (packs.length === 0 && (university.trim() || normalizedCourse || normalizedSemester)) {
      packs = await ExamPrepPack.find(
        buildFilter({ useUniv: true, useCourse: true, useSem: true, useExamType: false, useTokens: true })
      ).sort('-isGlobal -createdAt');
      if (packs.length > 0) matchMode = 'adapted_exam_type';
    }

    // 3. Custom college/university — match Course + Semester + Search Tokens
    if (packs.length === 0 && (normalizedCourse || normalizedSemester)) {
      packs = await ExamPrepPack.find(
        buildFilter({ useUniv: false, useCourse: true, useSem: true, useExamType: false, useTokens: true })
      ).sort('-isGlobal -createdAt');
      if (packs.length > 0) matchMode = 'adapted_university';
    }

    // 4. Subject / Search Tokens across other semesters of the Course (if user picked wrong sem e.g. Sem 4 for ML or Sem 5 for DBMS)
    if (packs.length === 0 && normalizedCourse && searchTokens.length > 0) {
      packs = await ExamPrepPack.find(
        buildFilter({ useUniv: false, useCourse: true, useSem: false, useExamType: false, useTokens: true })
      ).sort('-isGlobal -createdAt');
      if (packs.length > 0) matchMode = 'adapted_course';
    }

    // 5. Search Tokens across ALL courses
    if (packs.length === 0 && searchTokens.length > 0) {
      packs = await ExamPrepPack.find(
        buildFilter({ useUniv: false, useCourse: false, useSem: false, useExamType: false, useTokens: true })
      ).sort('-isGlobal -createdAt');
      if (packs.length > 0) matchMode = 'adapted_course';
    }

    // 6. Fallback: unseen subject in Course+Semester -> show semester packs + virtual starter for searched subject
    let virtualStarter = null;
    if (packs.length === 0 && normalizedCourse) {
      packs = await ExamPrepPack.find(
        buildFilter({ useUniv: false, useCourse: true, useSem: true, useExamType: false, useTokens: false })
      ).sort('-isGlobal -createdAt');
      if (packs.length === 0) {
        packs = await ExamPrepPack.find(
          buildFilter({ useUniv: false, useCourse: true, useSem: false, useExamType: false, useTokens: false })
        ).sort('-isGlobal -createdAt');
      }
      if (packs.length > 0) {
        matchMode = (subject || search).trim() ? 'adapted_subject' : 'adapted_university';
        if ((subject || search).trim()) {
          virtualStarter = buildAdaptedCustomSubjectPack({
            university,
            college,
            course: normalizedCourse,
            examType,
            subject: (subject || search).trim(),
          });
        }
      }
    }

    // 7. Broad fallback if nothing matched
    if (packs.length === 0) {
      packs = await ExamPrepPack.find(scope).sort('-isGlobal -createdAt').limit(8);
      if (packs.length > 0) {
        matchMode = (subject || search).trim() ? 'adapted_subject' : 'suggested';
        if ((subject || search).trim()) {
          virtualStarter = buildAdaptedCustomSubjectPack({
            university,
            college,
            course: normalizedCourse || course,
            examType,
            subject: (subject || search).trim(),
          });
        }
      }
    }

    const customLabel = [university.trim(), college.trim()].filter(Boolean).join(' • ');
    const targetBlueprint = examType.trim() ? DEFAULT_EXAM_BLUEPRINTS[examType.trim()] : null;

    const overriddenGlobalIds = new Set(
      packs.filter((p) => !p.isGlobal && p.parentGlobalId).map((p) => p.parentGlobalId.toString())
    );

    const fullSearchPhrase = (subject || search || '').trim().toLowerCase();
    const scorePack = (json) => {
      if (!fullSearchPhrase && searchTokens.length === 0) return 0;
      const subj = (json.subject || '').toLowerCase();
      let score = 0;
      if (fullSearchPhrase && subj.includes(fullSearchPhrase)) score += 100;
      for (const tok of searchTokens) {
        const t = tok.toLowerCase();
        if (subj.includes(t)) score += 45;
        if ((json.notes || []).some((n) => (n.title || '').toLowerCase().includes(t))) score += 15;
        if ((json.pyqs || []).some((q) => (q.question || '').toLowerCase().includes(t))) score += 10;
        if ((json.notes || []).some((n) => (n.summary || '').toLowerCase().includes(t))) score += 5;
      }
      return score;
    };

    const mapped = packs
      .filter((doc) => !(doc.isGlobal && overriddenGlobalIds.has(doc._id.toString())))
      .map((doc) => {
        const json = doc.toJSON();
        json.crashSummary = ensureCrashSummary(json);
        if (matchMode !== 'exact') {
          json.adaptedInfo = {
            mode: matchMode,
            requestedUniversity: customLabel || doc.university,
            requestedCourse: normalizedCourse || doc.course,
            requestedExamType: examType.trim() || doc.examType,
          };
          if (targetBlueprint && examType.trim() && examType.trim() !== json.examType) {
            json.examPattern = {
              ...json.examPattern,
              ...targetBlueprint,
            };
          }
        }
        return { json, score: scorePack(json) };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.json);

    const data = virtualStarter ? [virtualStarter, ...mapped] : mapped;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      matchMode,
      results: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.createPack = async (req, res, next) => {
  try {
    const { university, college, course, semester, subject, examType, examPattern, notes, pyqs } = req.body;
    if (!university?.trim() || !course?.trim() || !subject?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'University/College, Course, and Subject are required',
      });
    }

    const blueprint = examPattern || DEFAULT_EXAM_BLUEPRINTS[examType] || DEFAULT_EXAM_BLUEPRINTS['End Term Test (ETT)'];

    const doc = await ExamPrepPack.create({
      university: university.trim(),
      college: college?.trim() || '',
      course: normalizeCourseInput(course) || course.trim(),
      semester: semester?.trim() || 'All Semesters',
      subject: subject.trim(),
      examType: examType?.trim() || 'End Term Test (ETT)',
      examPattern: blueprint,
      notes: Array.isArray(notes) ? notes : [],
      pyqs: Array.isArray(pyqs) ? pyqs : [],
      isGlobal: false,
      userId: req.user.id,
    });

    res.status(HTTP_STATUS.CREATED).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

exports.addPyqToPack = async (req, res, next) => {
  try {
    const { year, marks, section, unit, frequency, question, answer, examTip } = req.body;
    if (!question?.trim() || !answer?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Question and Answer are required',
      });
    }

    const pack = await ExamPrepPack.findById(req.params.id);
    if (!pack || (!pack.isGlobal && pack.userId?.toString() !== req.user.id)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Study pack not found' });
    }

    const pyqItem = {
      year: Number(year) || new Date().getFullYear(),
      marks: Number(marks) || 10,
      section: section || 'Section B',
      unit: unit || 'Unit 1',
      frequency: frequency || 'Added by Student',
      question: question.trim(),
      answer: answer.trim(),
      examTip: examTip?.trim() || '',
    };

    if (pack.isGlobal) {
      let personalCopy = await ExamPrepPack.findOne({
        userId: req.user.id,
        parentGlobalId: pack._id,
      });

      if (!personalCopy) {
        personalCopy = await ExamPrepPack.create({
          university: pack.university,
          college: pack.college,
          course: pack.course,
          semester: pack.semester,
          subject: pack.subject,
          examType: pack.examType,
          examPattern: pack.examPattern,
          notes: pack.notes.map((n) => ({ unit: n.unit, title: n.title, summary: n.summary, keyPoints: n.keyPoints })),
          pyqs: [pyqItem, ...pack.pyqs.map((q) => ({
            year: q.year, marks: q.marks, section: q.section, unit: q.unit,
            frequency: q.frequency, question: q.question, answer: q.answer, examTip: q.examTip,
          }))],
          isGlobal: false,
          parentGlobalId: pack._id,
          userId: req.user.id,
        });
      } else {
        personalCopy.pyqs.unshift(pyqItem);
        await personalCopy.save();
      }
      return res.status(HTTP_STATUS.CREATED).json({ success: true, data: personalCopy });
    }

    pack.pyqs.unshift(pyqItem);
    await pack.save();
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: pack });
  } catch (err) {
    next(err);
  }
};

exports.addNoteToPack = async (req, res, next) => {
  try {
    const { unit, title, summary, keyPoints } = req.body;
    if (!title?.trim() || !summary?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Note title and summary are required',
      });
    }

    const pack = await ExamPrepPack.findById(req.params.id);
    if (!pack || (!pack.isGlobal && pack.userId?.toString() !== req.user.id)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Study pack not found' });
    }

    const noteItem = {
      unit: unit?.trim() || 'Unit 1',
      title: title.trim(),
      summary: summary.trim(),
      keyPoints: Array.isArray(keyPoints)
        ? keyPoints
        : String(keyPoints || '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
    };

    if (pack.isGlobal) {
      let personalCopy = await ExamPrepPack.findOne({
        userId: req.user.id,
        parentGlobalId: pack._id,
      });

      if (!personalCopy) {
        personalCopy = await ExamPrepPack.create({
          university: pack.university,
          college: pack.college,
          course: pack.course,
          semester: pack.semester,
          subject: pack.subject,
          examType: pack.examType,
          examPattern: pack.examPattern,
          notes: [...pack.notes.map((n) => ({ unit: n.unit, title: n.title, summary: n.summary, keyPoints: n.keyPoints })), noteItem],
          pyqs: pack.pyqs.map((q) => ({
            year: q.year, marks: q.marks, section: q.section, unit: q.unit,
            frequency: q.frequency, question: q.question, answer: q.answer, examTip: q.examTip,
          })),
          isGlobal: false,
          parentGlobalId: pack._id,
          userId: req.user.id,
        });
      } else {
        personalCopy.notes.push(noteItem);
        await personalCopy.save();
      }
      return res.status(HTTP_STATUS.CREATED).json({ success: true, data: personalCopy });
    }

    pack.notes.push(noteItem);
    await pack.save();
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: pack });
  } catch (err) {
    next(err);
  }
};

exports.deletePack = async (req, res, next) => {
  try {
    const doc = await ExamPrepPack.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
      isGlobal: false,
    });
    if (!doc) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Custom study pack not found or cannot delete built-in pack',
      });
    }
    res.status(HTTP_STATUS.OK).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    let progress = await ExamPrepProgress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await ExamPrepProgress.create({ userId: req.user.id });
    }
    res.status(HTTP_STATUS.OK).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const {
      university,
      college,
      course,
      semester,
      examType,
      revisedQuestionIds,
      bookmarkedQuestionIds,
    } = req.body;

    const update = {};
    if (university !== undefined) update.university = university;
    if (college !== undefined) update.college = college;
    if (course !== undefined) update.course = course;
    if (semester !== undefined) update.semester = semester;
    if (examType !== undefined) update.examType = examType;
    if (Array.isArray(revisedQuestionIds)) update.revisedQuestionIds = revisedQuestionIds;
    if (Array.isArray(bookmarkedQuestionIds)) update.bookmarkedQuestionIds = bookmarkedQuestionIds;

    const progress = await ExamPrepProgress.findOneAndUpdate(
      { userId: req.user.id },
      { $set: update, $setOnInsert: { userId: req.user.id } },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.status(HTTP_STATUS.OK).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};
