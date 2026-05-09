const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllTasks,
  deleteAnyTask,
  getStats,
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteAnyTask);

module.exports = router;
