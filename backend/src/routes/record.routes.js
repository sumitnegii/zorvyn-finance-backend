const express = require('express');
const {
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/record.controller');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// All record routes require authentication
router.use(protect);

router.get('/', listRecords);                              // ALL roles
router.get('/:id', getRecord);                            // ALL roles
router.post('/', restrictTo('ADMIN'), createRecord);      // ADMIN only
router.put('/:id', restrictTo('ADMIN'), updateRecord);    // ADMIN only
router.delete('/:id', restrictTo('ADMIN'), deleteRecord); // ADMIN only

module.exports = router;
