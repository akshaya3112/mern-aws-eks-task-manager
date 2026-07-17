const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Task Created Successfully ✅",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task Creation Failed ❌",
      error: error.message,
    });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to Fetch Tasks ❌",
      error: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found ❌",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not Authorized ❌",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Task Updated Successfully ✅",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task Update Failed ❌",
      error: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found ❌",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not Authorized ❌",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task Deleted Successfully ✅",
    });
  } catch (error) {
    res.status(500).json({
      message: "Task Deletion Failed ❌",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};