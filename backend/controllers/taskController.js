const Task = require('../models/Task');
const factory = require('../utils/handlerFactory');

exports.getAll = factory.getAll(Task);
exports.getOne = factory.getOne(Task);
exports.createOne = factory.createOne(Task);
exports.updateOne = factory.updateOne(Task);
exports.deleteOne = factory.deleteOne(Task);
