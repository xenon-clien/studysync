const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const ExamPrepProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  university: { type: String, default: '', trim: true },
  college: { type: String, default: '', trim: true },
  course: { type: String, default: '', trim: true },
  semester: { type: String, default: '', trim: true },
  examType: { type: String, default: 'End Term Test (ETT)', trim: true },
  revisedQuestionIds: [{ type: String }],
  bookmarkedQuestionIds: [{ type: String }],
}, createSchemaOptions());

module.exports = mongoose.model('ExamPrepProgress', ExamPrepProgressSchema);
