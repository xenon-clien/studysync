const fs = require('fs');
const path = require('path');

const entities = ['Subject', 'Task', 'Schedule', 'Goal', 'Note', 'Exam', 'Assignment', 'PomodoroStats', 'Streak'];

let routeContent = '';

for (const entity of entities) {
  const lower = entity.charAt(0).toLowerCase() + entity.slice(1);
  const controllerContent = `const ${entity} = require('../models/${entity}');
const factory = require('../utils/handlerFactory');

exports.getAll = factory.getAll(${entity});
exports.getOne = factory.getOne(${entity});
exports.createOne = factory.createOne(${entity});
exports.updateOne = factory.updateOne(${entity});
exports.deleteOne = factory.deleteOne(${entity});
`;

  fs.writeFileSync(path.join(__dirname, 'controllers', `${lower}Controller.js`), controllerContent);
  
  const routeFileContent = `const express = require('express');
const { getAll, getOne, createOne, updateOne, deleteOne } = require('../controllers/${lower}Controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAll)
  .post(createOne);

router.route('/:id')
  .get(getOne)
  .put(updateOne)
  .delete(deleteOne);

module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, 'routes', `${lower}Routes.js`), routeFileContent);
  
  routeContent += `const ${lower}Routes = require('./routes/${lower}Routes');\napp.use('/api/${lower}s', ${lower}Routes);\n`;
}

console.log('Controllers and Routes generated.');
// Output the app.js lines to console
console.log(routeContent);
