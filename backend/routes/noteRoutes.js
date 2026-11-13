const createEntityRouter = require('../utils/createEntityRouter');
const controller = require('../controllers/noteController');

module.exports = createEntityRouter(controller);
