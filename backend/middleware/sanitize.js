const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function cleanValue(val) {
  if (typeof val === 'string') {
    return val
      .replace(/<\s*script[^>]*>.*?<\s*\/\s*script\s*>/gis, '')
      .replace(/<\s*script[^>]*>/gi, '')
      .replace(/javascript\s*:/gi, '');
  }
  if (Array.isArray(val)) {
    return val.map(cleanValue);
  }
  if (val && typeof val === 'object') {
    return sanitizeObject(val);
  }
  return val;
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_KEYS.has(key) || key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleaned[key] = cleanValue(value);
  }
  return cleaned;
}

/**
 * Express 5-safe middleware preventing NoSQL operator injection & basic XSS
 * without attempting to reassign the read-only req.query getter.
 */
module.exports = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = cleanValue(req.params[key]);
      }
    }
  }
  next();
};
