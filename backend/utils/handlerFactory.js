const mongoose = require('mongoose');
const BaseRepository = require('../repositories/baseRepository');
const { HTTP_STATUS } = require('../constants');

const IMMUTABLE_FIELDS = ['_id', 'id', 'userId', 'createdAt', 'updatedAt', '__v'];
const RESERVED_QUERY_KEYS = new Set(['page', 'sort', 'limit', 'fields', 'search']);

function cleanPayload(body) {
  const payload = { ...body };
  for (const field of IMMUTABLE_FIELDS) {
    delete payload[field];
  }
  if (payload.subjectId === '' || payload.subjectId === undefined) {
    delete payload.subjectId;
  } else if (payload.subjectId === null) {
    payload.subjectId = null;
  } else if (!mongoose.Types.ObjectId.isValid(payload.subjectId)) {
    delete payload.subjectId;
  }
  return payload;
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const repo = new BaseRepository(Model);
    const doc = await repo.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'No document found with that ID' });
    }
    res.status(HTTP_STATUS.OK).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const repo = new BaseRepository(Model);
    const payload = cleanPayload(req.body);
    const doc = await repo.updateOne({ _id: req.params.id, userId: req.user.id }, payload);
    if (!doc) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'No document found with that ID' });
    }
    res.status(HTTP_STATUS.OK).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const repo = new BaseRepository(Model);
    const payload = cleanPayload(req.body);
    payload.userId = req.user.id;
    const doc = await repo.create(payload);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    const repo = new BaseRepository(Model);
    const doc = await repo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'No document found with that ID' });
    }
    res.status(HTTP_STATUS.OK).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

exports.getAll = (Model, defaultSort = '-createdAt') => async (req, res, next) => {
  try {
    const repo = new BaseRepository(Model);
    const filter = { userId: req.user.id };

    for (const [key, val] of Object.entries(req.query || {})) {
      if (!RESERVED_QUERY_KEYS.has(key) && val !== '' && !key.startsWith('$')) {
        filter[key] = val;
      }
    }

    if (req.query && req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'i');
      filter.$or = [
        { name: regex },
        { title: regex },
        { subject: regex },
        { content: regex },
      ];
    }

    const page = Math.max(1, parseInt(req.query?.page, 10) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(req.query?.limit, 10) || 200));
    const skip = (page - 1) * limit;
    const sort = req.query?.sort ? String(req.query.sort).split(',').join(' ') : defaultSort;
    const select = req.query?.fields ? String(req.query.fields).split(',').join(' ') : undefined;

    const [docs, total] = await Promise.all([
      repo.findAll(filter, { sort, select, skip, limit }),
      repo.count(filter),
    ]);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      results: docs.length,
      total,
      page,
      data: docs,
    });
  } catch (error) {
    next(error);
  }
};
