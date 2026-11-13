const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const UnitNoteSchema = new mongoose.Schema({
  unit: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true },
  keyPoints: [{ type: String }],
}, { _id: true });

const UnitCrashSchema = new mongoose.Schema({
  unit: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  analogy: { type: String, default: '' },
  simpleExplanation: { type: String, required: true },
  keyFormulasOrKeywords: [{ type: String }],
}, { _id: false });

const PyqSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  marks: { type: Number, default: 10 },
  section: { type: String, default: 'Section B' },
  unit: { type: String, default: 'Unit 1' },
  frequency: { type: String, default: 'Previous Year' },
  isImportant: { type: Boolean, default: true },
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true },
  examTip: { type: String, default: '' },
}, { _id: true });

const SectionPatternSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questionCount: { type: String, required: true },
  marksPerQuestion: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const ExamPrepPackSchema = new mongoose.Schema({
  university: { type: String, required: [true, 'University or College name is required'], trim: true, index: true },
  college: { type: String, default: '', trim: true },
  course: { type: String, required: [true, 'Course is required'], trim: true, index: true },
  semester: { type: String, default: 'All Semesters', trim: true, index: true },
  subject: { type: String, required: [true, 'Subject is required'], trim: true, index: true },
  examType: {
    type: String,
    default: 'End Term Test (ETT)',
    trim: true,
    index: true,
  },
  examPattern: {
    totalMarks: { type: Number, default: 60 },
    duration: { type: String, default: '3 Hours' },
    passingMarks: { type: String, default: '40%' },
    sections: [SectionPatternSchema],
    highWeightageTopics: [{ type: String }],
  },
  crashSummary: {
    tagline: { type: String, default: '' },
    passPlan: { type: String, default: '' },
    units: [UnitCrashSchema],
  },
  notes: [UnitNoteSchema],
  pyqs: [PyqSchema],
  isGlobal: { type: Boolean, default: false, index: true },
  parentGlobalId: { type: mongoose.Schema.ObjectId, ref: 'ExamPrepPack', default: null },
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', default: null, index: true },
}, createSchemaOptions((doc, ret) => {
  if (Array.isArray(ret.notes)) {
    ret.notes = ret.notes.map((n) => ({ ...n, id: n._id?.toString() }));
  }
  if (Array.isArray(ret.pyqs)) {
    ret.pyqs = ret.pyqs.map((q) => ({ ...q, id: q._id?.toString() }));
  }
}));

ExamPrepPackSchema.index({ course: 1, semester: 1, university: 1, examType: 1, subject: 1 });

module.exports = mongoose.model('ExamPrepPack', ExamPrepPackSchema);
