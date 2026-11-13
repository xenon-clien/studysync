const mongoose = require('mongoose');
const { PRIORITIES, TASK_STATUSES } = require('../constants');
const { createSchemaOptions } = require('../utils/schemaTransform');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an assignment title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  subjectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    default: null,
  },
  dueDate: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: PRIORITIES,
    default: 'Medium',
  },
  status: {
    type: String,
    enum: TASK_STATUSES,
    default: 'Pending',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, createSchemaOptions((doc, ret) => {
  if (ret.subjectId) ret.subjectId = ret.subjectId.toString();
}));

module.exports = mongoose.model('Assignment', AssignmentSchema);
