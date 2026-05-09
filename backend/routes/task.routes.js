const express = require('express');
const router = express.Router();
const { getMyTasks, createTask, deleteTask } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getMyTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);

module.exports = router;
