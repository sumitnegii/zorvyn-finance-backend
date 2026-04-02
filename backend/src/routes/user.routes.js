const express = require('express');
const { listUsers, setUserRole, setUserStatus, createNewUser } = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// All user management routes are protected and restricted to ADMIN
router.use(protect, restrictTo('ADMIN'));

router.get('/', listUsers);
router.post('/', createNewUser);
router.put('/:id/role', setUserRole);
router.put('/:id/status', setUserStatus);

module.exports = router;
