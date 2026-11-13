const mongoose = require('mongoose');
const { HTTP_STATUS } = require('../constants');

module.exports = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid resource ID format',
    });
  }
  next();
};
