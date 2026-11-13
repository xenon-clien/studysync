const mongoose = require('mongoose');
const { EXAM_PREP_STATUSES } = require('../constants');
const { createSchemaOptions } = require('../utils/schemaTransform');

const ExamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an exam name'],
    trim: true,
    maxlength: [200, 'Exam name cannot exceed 200 characters'],
  },
  title: {
    type: String,
    trim: true,
  },
  subjectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    default: null,
  },
  date: {
    type: String,
    required: [true, 'Please add an exam date'],
  },
  prep: {
    type: String,
    enum: EXAM_PREP_STATUSES,
    default: 'Not Started',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, createSchemaOptions((doc, ret) => {
  if (ret.subjectId) ret.subjectId = ret.subjectId.toString();
  if (!ret.name && ret.title) ret.name = ret.title;
}));

ExamSchema.pre('validate', function () {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;
});

module.exports = mongoose.model('Exam', ExamSchema);
