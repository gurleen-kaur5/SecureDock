const Task = require('../models/task.model');

// @route  GET /api/tasks  — get own tasks
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

// @route  POST /api/tasks  — create task
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const task = await Task.create({
      title,
      description,
      status,
      owner: req.user._id,
    });

    res.status(201).json({ task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create task.' });
  }
};

// @route  DELETE /api/tasks/:id  — delete own task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};

module.exports = { getMyTasks, createTask, deleteTask };
