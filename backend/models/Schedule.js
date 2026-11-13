const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const ScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  date: {
    type: String,
    required: [true, 'Please add a date'],
    default: () => new Date().toISOString().slice(0, 10),
  },
  time: {
    type: String,
    required: [true, 'Please add a time'],
  },
  subject: {
    type: String,
    default: 'General',
    trim: true,
  },
  type: {
    type: String,
    default: 'Study',
  },
  duration: {
    type: Number,
    default: 60,
    min: [1, 'Duration must be at least 1 minute'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, createSchemaOptions());

ScheduleSchema.index({ userId: 1, date: 1, time: 1 });

module.exports = mongoose.model('Schedule', ScheduleSchema);
