const Schedule = require('../models/Schedule');
const factory = require('../utils/handlerFactory');

exports.getAll = factory.getAll(Schedule);
exports.getOne = factory.getOne(Schedule);
exports.createOne = factory.createOne(Schedule);
exports.updateOne = factory.updateOne(Schedule);
exports.deleteOne = factory.deleteOne(Schedule);
