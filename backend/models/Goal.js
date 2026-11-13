const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const GoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a goal name'],
    trim: true,
    maxlength: [200, 'Goal name cannot exceed 200 characters'],
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
  targetDate: {
    type: String,
    default: '',
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot exceed 100'],
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

GoalSchema.pre('validate', function () {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;
});

module.exports = mongoose.model('Goal', GoalSchema);
