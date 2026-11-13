const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Task = require('../models/Task');
const { seedFullStudyDataForUser, addDays } = require('./seedStudyData');

/**
 * Ensures the built-in Demo Credentials account (`demo@studysync.app` / `demo1234`)
 * and known accounts have rich, populated study data with up-to-date schedule blocks.
 */
exports.seedDemoAccount = async () => {
  try {
    let demoUser = await User.findOne({ email: 'demo@studysync.app' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Jordan Lee',
        email: 'demo@studysync.app',
        password: 'demo1234',
        role: 'user',
      });
      await seedFullStudyDataForUser(demoUser._id, { overwrite: true });
      console.log('Demo account created and seeded with full B.Tech CSE study dataset.');
    } else {
      // Refresh demo user with fresh curriculum & today's schedule if schedule is stale
      const todayStr = addDays(0);
      const hasTodaySchedule = await Schedule.exists({ userId: demoUser._id, date: todayStr });
      if (!hasTodaySchedule) {
        await seedFullStudyDataForUser(demoUser._id, { overwrite: true });
        console.log('Demo account study data refreshed for today.');
      }
    }

    // Also auto-seed shivamkumar@gmail.com if it has 0 or 1 task/schedule
    const shivam = await User.findOne({ email: 'shivamkumar@gmail.com' });
    if (shivam) {
      const taskCount = await Task.countDocuments({ userId: shivam._id });
      if (taskCount <= 1) {
        await seedFullStudyDataForUser(shivam._id, { overwrite: true });
        console.log('User shivamkumar@gmail.com seeded with full B.Tech CSE study dataset.');
      }
    }
  } catch (err) {
    console.warn('Demo seed warning:', err.message);
  }
};
