const fs = require("fs").promises;
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/tasks.json");

// Helper: Read tasks dari JSON file
const readTasks = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

// Helper: Write tasks ke JSON file
const writeTasks = async (tasks) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
};

// GET: Ambil semua tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading tasks",
      error: error.message,
    });
  }
};

// GET: Ambil task berdasarkan ID
exports.getTaskById = async (req, res) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading task",
      error: error.message,
    });
  }
};

// GET: Ambil tasks berdasarkan status
exports.getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["to_do", "process", "done"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: to_do, process, or done",
      });
    }

    const tasks = await readTasks();
    const filteredTasks = tasks.filter((t) => t.status === status);

    res.json({
      success: true,
      data: filteredTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading tasks",
      error: error.message,
    });
  }
};

// POST: Buat task baru
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status = "to_do",
      tags = [],
      dueDate,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const validStatuses = ["to_do", "process", "done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: to_do, process, or done",
      });
    }

    // Validasi dueDate jika ada
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid dueDate format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)",
      });
    }

    const tasks = await readTasks();
    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || "",
      status,
      tags: Array.isArray(tags) ? tags : [],
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

// PUT: Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, tags, dueDate } = req.body;

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (status) {
      const validStatuses = ["to_do", "process", "done"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be: to_do, process, or done",
        });
      }
    }

    // Validasi dueDate jika ada
    if (dueDate && dueDate !== null && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid dueDate format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)",
      });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description:
        description !== undefined ? description : tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      tags:
        tags !== undefined
          ? Array.isArray(tags)
            ? tags
            : []
          : tasks[taskIndex].tags,
      dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

// PATCH: Update status task saja
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["to_do", "process", "done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: to_do, process, or done",
      });
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    tasks[taskIndex].status = status;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    await writeTasks(tasks);

    res.json({
      success: true,
      message: "Task status updated successfully",
      data: tasks[taskIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task status",
      error: error.message,
    });
  }
};

// DELETE: Hapus task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);

    res.json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// GET: Ambil tasks berdasarkan tag
exports.getTasksByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const tasks = await readTasks();
    const filteredTasks = tasks.filter((t) => t.tags && t.tags.includes(tag));

    res.json({
      success: true,
      data: filteredTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading tasks",
      error: error.message,
    });
  }
};

// GET: Ambil tasks yang overdue
exports.getOverdueTasks = async (req, res) => {
  try {
    const tasks = await readTasks();
    const now = new Date();
    const overdueTasks = tasks.filter((t) => {
      if (!t.dueDate || t.status === "done") return false;
      return new Date(t.dueDate) < now;
    });

    res.json({
      success: true,
      data: overdueTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading tasks",
      error: error.message,
    });
  }
};

// GET: Ambil tasks dengan due date hari ini
exports.getTodayTasks = async (req, res) => {
  try {
    const tasks = await readTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });

    res.json({
      success: true,
      data: todayTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading tasks",
      error: error.message,
    });
  }
};
