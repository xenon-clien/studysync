const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const PomodoroStatsSchema = new mongoose.Schema({
  todaySessions: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalFocusMinutes: {
    type: Number,
    default: 0,
    min: 0,
  },
  sessionLog: [{
    date: { type: String },
    minutes: { type: Number },
  }],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
}, createSchemaOptions());

module.exports = mongoose.model('PomodoroStats', PomodoroStatsSchema);
