const createEntityRouter = require('../utils/createEntityRouter');
const controller = require('../controllers/taskController');

module.exports = createEntityRouter(controller);
