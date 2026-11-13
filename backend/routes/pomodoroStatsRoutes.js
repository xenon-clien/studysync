const createEntityRouter = require('../utils/createEntityRouter');
const controller = require('../controllers/pomodoroStatsController');

module.exports = createEntityRouter(controller);
