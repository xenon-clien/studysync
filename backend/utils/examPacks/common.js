const CTU_ETT_60_SECTIONS = [
  { name: 'Section A (1M x 10)', questionCount: '10 Questions (All Compulsory)', marksPerQuestion: '1 Mark each (10 Marks)', description: 'Objective / 1-line definitions, symbols, truth values, and key properties.' },
  { name: 'Section B (2M x 5)', questionCount: '5 Questions (All Compulsory)', marksPerQuestion: '2 Marks each (10 Marks)', description: 'Short conceptual comparisons, formulas, and 2-step numerical checks.' },
  { name: 'Section C (5M x 4)', questionCount: '4 Questions (Internal Choice)', marksPerQuestion: '5 Marks each (20 Marks)', description: 'MTT core topics expanded into medium proofs, traces, truth tables & conversions.' },
  { name: 'Section D (10M x 2 of 3)', questionCount: '3 Given -> Attempt any 2', marksPerQuestion: '10 Marks each (20 Marks)', description: 'Full analytical long answers: theorems, architectures, algorithms & full numericals.' },
];

const DEFAULT_ETT_PATTERN = {
  totalMarks: 60,
  duration: '3 Hours',
  passingMarks: '40% Overall (ETT 60 Marks + MTT/Internal 40 Marks)',
  sections: CTU_ETT_60_SECTIONS,
};

module.exports = {
  CTU_ETT_60_SECTIONS,
  DEFAULT_ETT_PATTERN,
};
