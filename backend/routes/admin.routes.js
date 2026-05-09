const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllTasks,
  updateAnyTask,
  deleteAnyTask,
  getStats,
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/tasks', getAllTasks);
router.patch('/tasks/:id', updateAnyTask);
router.delete('/tasks/:id', deleteAnyTask);

module.exports = router;
