const Exam = require('../models/Exam');
const factory = require('../utils/handlerFactory');

exports.getAll = factory.getAll(Exam);
exports.getOne = factory.getOne(Exam);
exports.createOne = factory.createOne(Exam);
exports.updateOne = factory.updateOne(Exam);
exports.deleteOne = factory.deleteOne(Exam);
