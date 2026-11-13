const Note = require('../models/Note');
const factory = require('../utils/handlerFactory');

exports.getAll = factory.getAll(Note);
exports.getOne = factory.getOne(Note);
exports.createOne = factory.createOne(Note);
exports.updateOne = factory.updateOne(Note);
exports.deleteOne = factory.deleteOne(Note);
