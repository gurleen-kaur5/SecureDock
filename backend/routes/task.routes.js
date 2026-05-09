const express = require('express');
const router = express.Router();
const { getMyTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getMyTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
