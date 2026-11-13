/**
 * Shared Mongoose schema serialization options that expose `id` alongside `_id`
 * and normalize date/reference formatting for consistent JSON responses.
 */
exports.createSchemaOptions = (extraTransform) => ({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      if (ret._id) {
        ret.id = ret._id.toString();
      }
      delete ret.__v;
      if (typeof extraTransform === 'function') {
        extraTransform(doc, ret);
      }
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform(doc, ret) {
      if (ret._id) {
        ret.id = ret._id.toString();
      }
      delete ret.__v;
      if (typeof extraTransform === 'function') {
        extraTransform(doc, ret);
      }
      return ret;
    },
  },
});
