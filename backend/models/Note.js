const mongoose = require('mongoose');
const { createSchemaOptions } = require('../utils/schemaTransform');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a note title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    default: 'General',
    trim: true,
  },
  folder: {
    type: String,
    default: 'General',
  },
  tags: [{ type: String }],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, createSchemaOptions((doc, ret) => {
  if (ret.updatedAt) {
    ret.updatedAt = new Date(ret.updatedAt).toISOString().slice(0, 10);
  }
}));

module.exports = mongoose.model('Note', NoteSchema);
