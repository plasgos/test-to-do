const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");

// Get all tasks
router.get("/", taskController.getAllTasks);

// Get tasks by status
router.get("/status/:status", taskController.getTasksByStatus);

// Get tasks by tag
router.get("/tag/:tag", taskController.getTasksByTag);

// Get overdue tasks
router.get("/overdue", taskController.getOverdueTasks);

// Get today's tasks
router.get("/today", taskController.getTodayTasks);

// Get task by ID
router.get("/:id", taskController.getTaskById);

// Create new task
router.post("/", taskController.createTask);

// Update task (full update)
router.put("/:id", taskController.updateTask);

// Update task status only
router.patch("/:id/status", taskController.updateTaskStatus);

// Delete task
router.delete("/:id", taskController.deleteTask);

module.exports = router;
