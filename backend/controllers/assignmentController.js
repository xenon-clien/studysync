const Assignment = require('../models/Assignment');
const factory = require('../utils/handlerFactory');

exports.getAll = factory.getAll(Assignment);
exports.getOne = factory.getOne(Assignment);
exports.createOne = factory.createOne(Assignment);
exports.updateOne = factory.updateOne(Assignment);
exports.deleteOne = factory.deleteOne(Assignment);
