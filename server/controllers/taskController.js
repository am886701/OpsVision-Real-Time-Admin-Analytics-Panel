import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, team, stage, date, priority, assets } = req.body;
    const assignedTeam = Array.isArray(team) ? team : [];

    const assignmentText =
      assignedTeam.length > 1
        ? `New task has been assigned to you and ${assignedTeam.length - 1} others.`
        : assignedTeam.length === 1
          ? "New task has been assigned to you."
          : "New task created by admin.";

    const task = await Task.create({
      title,
      team: assignedTeam,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: [
        {
          type: "assigned",
          activity: assignmentText,
          by: userId,
        },
      ],
    });

    const notifications = assignedTeam.map((user) => ({
      team: user,
      text: `You've been assigned a new task: "${title}".`,
      task: task._id,
    }));

    if (notifications.length > 0) {
      await Notice.insertMany(notifications);
    }

    res.status(200).json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    const newTask = await Task.create({
      ...task.toObject(),
      _id: undefined,
      title: `${task.title} - Duplicate`,
    });

    const dueDateLabel = task.date ? new Date(task.date).toDateString() : "No due date";
    const text = `Task duplicated. Priority: ${task.priority}. Date: ${dueDateLabel}`;

    const notifications = (task.team || []).map((user) => ({
      team: user,
      text,
      task: newTask._id,
    }));

    if (notifications.length > 0) {
      await Notice.insertMany(notifications);
    }

    res.status(200).json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    task.activities.push({ type, activity, by: userId });
    await task.save();

    res.status(200).json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({ isTrashed: false }).populate("team", "name role title email").sort({ _id: -1 })
      : await Task.find({ isTrashed: false, team: { $all: [userId] } })
          .populate("team", "name role title email")
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    const groupedTasks = allTasks.reduce((result, task) => {
      result[task.stage] = (result[task.stage] || 0) + 1;
      return result;
    }, {});

    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        result[task.priority] = (result[task.priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    res.status(200).json({
      status: true,
      message: "Successfully",
      totalTasks: allTasks.length,
      last10Task: allTasks.slice(0, 10),
      users: isAdmin ? users : [],
      tasks: groupedTasks,
      graphData: groupData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    const query = {};
    if (stage) query.stage = stage;
    query.isTrashed = isTrashed === "true";

    const tasks = await Task.find(query).populate("team", "name title email").sort({ _id: -1 });

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("team", "name title role email")
      .populate("activities.by", "name");

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    res.status(200).json({ status: true, task });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    task.subTasks.push({ title, tag, date });
    await task.save();

    res.status(200).json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = Array.isArray(team) ? team : [];

    await task.save();

    res.status(200).json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    task.isTrashed = true;
    await task.save();

    res.status(200).json({ status: true, message: "Task trashed successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  const { id } = req.params;
  const actionType = req.query.actionType?.toLowerCase().trim();

  if (!id || !actionType) {
    return res.status(400).json({
      status: false,
      message: "Missing task ID or actionType.",
    });
  }

  try {
    let updatedTask;

    switch (actionType) {
      case "trash":
        updatedTask = await Task.findByIdAndUpdate(id, { isTrashed: true }, { new: true });
        return res.status(200).json({
          status: true,
          message: "Task trashed successfully.",
          data: updatedTask,
        });

      case "restore":
        updatedTask = await Task.findByIdAndUpdate(id, { isTrashed: false }, { new: true });
        return res.status(200).json({
          status: true,
          message: "Task restored successfully.",
          data: updatedTask,
        });

      default:
        return res.status(400).json({
          status: false,
          message: "Invalid actionType.",
        });
    }
  } catch (error) {
    console.error("Error in deleteRestoreTask:", error);
    return res.status(500).json({
      status: false,
      message: "Server error.",
    });
  }
};

export const restoreAllTasks = async (req, res) => {
  try {
    const updatedTasks = await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });

    if (updatedTasks.modifiedCount === 0) {
      return res.status(404).json({ status: false, message: "No tasks found to restore." });
    }

    res.status(200).json({ status: true, message: "All tasks restored successfully." });
  } catch (error) {
    console.error("Error in restoreAllTasks:", error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const getTrashedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isTrashed: true }).sort({ updatedAt: -1 });
    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const permanentlyDeleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    if (!task.isTrashed) {
      return res.status(400).json({
        status: false,
        message: "Task must be trashed before permanent deletion.",
      });
    }

    await Task.findByIdAndDelete(id);
    await Notice.deleteMany({ task: id });

    res.status(200).json({ status: true, message: "Task permanently deleted." });
  } catch (error) {
    console.error("Error in permanentlyDeleteTask:", error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const permanentlyDeleteAllTasks = async (req, res) => {
  try {
    const trashedTasks = await Task.find({ isTrashed: true });

    if (trashedTasks.length === 0) {
      return res.status(404).json({ status: false, message: "No trashed tasks to delete." });
    }

    const trashedTaskIds = trashedTasks.map((task) => task._id);

    await Task.deleteMany({ _id: { $in: trashedTaskIds } });
    await Notice.deleteMany({ task: { $in: trashedTaskIds } });

    res.status(200).json({ status: true, message: "All trashed tasks permanently deleted." });
  } catch (error) {
    console.error("Error in permanentlyDeleteAllTasks:", error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};
