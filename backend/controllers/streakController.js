const Streak = require('../models/Streak');
const factory = require('../utils/handlerFactory');
const { HTTP_STATUS } = require('../constants');

exports.getAll = factory.getAll(Streak);
exports.getOne = factory.getOne(Streak);
exports.updateOne = factory.updateOne(Streak);
exports.deleteOne = factory.deleteOne(Streak);

exports.createOne = async (req, res, next) => {
  try {
    const { current, longest, lastStudyDate } = req.body;
    const update = {};
    if (current !== undefined) update.current = current;
    if (longest !== undefined) update.longest = longest;
    if (lastStudyDate !== undefined) update.lastStudyDate = lastStudyDate;

    const doc = await Streak.findOneAndUpdate(
      { userId: req.user.id },
      { $set: update, $setOnInsert: { userId: req.user.id } },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.status(HTTP_STATUS.OK).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};
