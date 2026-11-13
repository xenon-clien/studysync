const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const {
  getMeta,
  searchPacks,
  createPack,
  addPyqToPack,
  addNoteToPack,
  deletePack,
  getProgress,
  updateProgress,
} = require('../controllers/examPrepController');

const router = express.Router();

router.use(protect);

router.get('/meta', getMeta);
router.route('/progress')
  .get(getProgress)
  .put(updateProgress);

router.route('/')
  .get(searchPacks)
  .post(createPack);

router.post('/:id/pyq', validateObjectId, addPyqToPack);
router.post('/:id/note', validateObjectId, addNoteToPack);
router.delete('/:id', validateObjectId, deletePack);

module.exports = router;
