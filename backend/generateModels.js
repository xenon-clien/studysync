const fs = require('fs');
const path = require('path');

const models = {
  'Schedule.js': `const mongoose = require('mongoose');
const ScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, default: 'Study' },
  duration: { type: Number },
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Schedule', ScheduleSchema);`,

  'Goal.js': `const mongoose = require('mongoose');
const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.ObjectId, ref: 'Subject' },
  targetDate: { type: Date },
  progress: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Goal', GoalSchema);`,

  'Note.js': `const mongoose = require('mongoose');
const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  folder: { type: String, default: 'General' },
  tags: [{ type: String }],
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Note', NoteSchema);`,

  'Exam.js': `const mongoose = require('mongoose');
const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, required: true },
  prep: { type: String, enum: ['Not Started', 'In Progress', 'Ready'], default: 'Not Started' },
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Exam', ExamSchema);`,

  'Assignment.js': `const mongoose = require('mongoose');
const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.ObjectId, ref: 'Subject', required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Assignment', AssignmentSchema);`,

  'PomodoroStats.js': `const mongoose = require('mongoose');
const PomodoroStatsSchema = new mongoose.Schema({
  todaySessions: { type: Number, default: 0 },
  totalFocusMinutes: { type: Number, default: 0 },
  sessionLog: [{
    date: { type: String },
    minutes: { type: Number }
  }],
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true }
}, { timestamps: true });
module.exports = mongoose.model('PomodoroStats', PomodoroStatsSchema);`,

  'Streak.js': `const mongoose = require('mongoose');
const StreakSchema = new mongoose.Schema({
  current: { type: Number, default: 0 },
  longest: { type: Number, default: 0 },
  lastStudyDate: { type: String },
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true }
}, { timestamps: true });
module.exports = mongoose.model('Streak', StreakSchema);`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(__dirname, 'models', filename), content);
}
console.log('Models generated successfully!');
