const mongoose = require('mongoose');
const { PRIORITIES, TASK_STATUSES } = require('../constants');
const { createSchemaOptions } = require('../utils/schemaTransform');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a task name'],
    trim: true,
    maxlength: [200, 'Task name cannot exceed 200 characters'],
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
  deadline: {
    type: String,
    default: '',
  },
  dueDate: {
    type: Date,
  },
  estHours: {
    type: Number,
    default: 1,
    min: [0, 'Estimated hours cannot be negative'],
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
  if (!ret.deadline && ret.dueDate) {
    ret.deadline = new Date(ret.dueDate).toISOString().slice(0, 10);
  }
}));

TaskSchema.index({ userId: 1, status: 1, priority: 1 });

TaskSchema.pre('validate', function () {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;
  if (!this.deadline && this.dueDate) {
    this.deadline = new Date(this.dueDate).toISOString().slice(0, 10);
  }
});

module.exports = mongoose.model('Task', TaskSchema);
