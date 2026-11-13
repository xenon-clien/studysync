const { HTTP_STATUS } = require('../constants');

module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: false,
    allowUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message.replace(/"/g, '')).join(', ');
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message,
    });
  }

  req.body = value;
  next();
};
