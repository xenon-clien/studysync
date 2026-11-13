const Subject = require('../models/Subject');
const Task = require('../models/Task');
const factory = require('../utils/handlerFactory');
const { HTTP_STATUS } = require('../constants');

exports.getAll = factory.getAll(Subject);
exports.getOne = factory.getOne(Subject);
exports.createOne = factory.createOne(Subject);
exports.updateOne = factory.updateOne(Subject);

exports.deleteOne = async (req, res, next) => {
  try {
    const doc = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!doc) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'No document found with that ID' });
    }
    await Task.deleteMany({ subjectId: req.params.id, userId: req.user.id });
    res.status(HTTP_STATUS.OK).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
