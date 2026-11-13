const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name'],
    trim: true,
    maxlength: [100, 'Subject name cannot exceed 100 characters'],
  },
  color: {
    type: String,
    default: '#E8A33D',
  },
  icon: {
    type: String,
    default: 'Book',
  },
  loggedHours: {
    type: Number,
    default: 0,
    min: [0, 'Logged hours cannot be negative'],
  },
  goalHours: {
    type: Number,
    default: 20,
    min: [0, 'Goal hours cannot be negative'],
  },
  targetHours: {
    type: Number,
    default: 20,
    min: [0, 'Target hours cannot be negative'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, createSchemaOptions((doc, ret) => {
  if (ret.goalHours === undefined && ret.targetHours !== undefined) {
    ret.goalHours = ret.targetHours;
  }
}));

SubjectSchema.pre('save', function () {
  if (this.goalHours !== undefined) {
    this.targetHours = this.goalHours;
  } else if (this.targetHours !== undefined) {
    this.goalHours = this.targetHours;
  }
});

module.exports = mongoose.model('Subject', SubjectSchema);
