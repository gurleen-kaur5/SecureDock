const User = require('../models/user.model');
const Task = require('../models/task.model');

// @route  GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// @route  DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    await Task.deleteMany({ owner: req.params.id });
    res.json({ message: 'User and their tasks deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

// @route  GET /api/admin/tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

// @route  PATCH /api/admin/tasks/:id  — admin edits any task
const updateAnyTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json({ task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

// @route  DELETE /api/admin/tasks/:id
const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};

// @route  GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalTasks, adminCount] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      User.countDocuments({ role: 'admin' }),
    ]);
    res.json({ totalUsers, totalTasks, adminCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

module.exports = { getAllUsers, deleteUser, getAllTasks, updateAnyTask, deleteAnyTask, getStats };
