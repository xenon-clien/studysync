const mongoose = require('mongoose');
const PomodoroStats = require('../models/PomodoroStats');
const Subject = require('../models/Subject');
const factory = require('../utils/handlerFactory');
const { HTTP_STATUS } = require('../constants');

exports.getAll = factory.getAll(PomodoroStats);
exports.getOne = factory.getOne(PomodoroStats);
exports.updateOne = factory.updateOne(PomodoroStats);
exports.deleteOne = factory.deleteOne(PomodoroStats);

exports.createOne = async (req, res, next) => {
  try {
    const { todaySessions, totalFocusMinutes, sessionLog, subjectId, sessionMinutes } = req.body;
    const update = {};
    if (todaySessions !== undefined) update.todaySessions = todaySessions;
    if (totalFocusMinutes !== undefined) update.totalFocusMinutes = totalFocusMinutes;
    if (Array.isArray(sessionLog)) update.sessionLog = sessionLog.slice(-200);

    const doc = await PomodoroStats.findOneAndUpdate(
      { userId: req.user.id },
      { $set: update, $setOnInsert: { userId: req.user.id } },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId) && sessionMinutes > 0) {
      const addHours = Number((sessionMinutes / 60).toFixed(2));
      await Subject.findOneAndUpdate(
        { _id: subjectId, userId: req.user.id },
        { $inc: { loggedHours: addHours } }
      );
    }

    res.status(HTTP_STATUS.OK).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};
