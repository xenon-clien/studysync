const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const StreakSchema = new mongoose.Schema({
  current: {
    type: Number,
    default: 0,
    min: 0,
  },
  longest: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastStudyDate: {
    type: String,
    default: null,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
}, createSchemaOptions());

module.exports = mongoose.model('Streak', StreakSchema);
