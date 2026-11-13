const Goal = require('../models/Goal');
const factory = require('../utils/handlerFactory');

exports.getAll = factory.getAll(Goal);
exports.getOne = factory.getOne(Goal);
exports.createOne = factory.createOne(Goal);
exports.updateOne = factory.updateOne(Goal);
exports.deleteOne = factory.deleteOne(Goal);
