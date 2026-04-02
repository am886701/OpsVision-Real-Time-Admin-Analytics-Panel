import bcrypt from "bcryptjs";
import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import { createJWT } from "../utils/index.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role, title } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ status: false, message: "User already exists" });
    }

    const userCount = await User.countDocuments();
    const allowBootstrapAdmin = userCount === 0;
    const nextIsAdmin = allowBootstrapAdmin ? true : Boolean(isAdmin && req.user?.isAdmin);

    const user = await User.create({
      name,
      email,
      password,
      isAdmin: nextIsAdmin,
      role: nextIsAdmin ? "Admin" : role || "Analyst",
      title: title || (nextIsAdmin ? "System Administrator" : "Operations Analyst"),
    });

    user.password = undefined;

    return res.status(201).json({
      status: true,
      message: allowBootstrapAdmin
        ? "Admin account created. You can now sign in to the dashboard."
        : "User created successfully.",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: false,
        message: "User account has been deactivated. Contact your administrator.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid email or password." });
    }

    const token = createJWT(res, user);

    return res.status(200).json({
      status: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      title: user.title,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find()
      .select("name title role email isActive isAdmin createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching team list:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name title role email isActive isAdmin createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: false, message: "Error fetching users", error: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;
    const id = isAdmin && userId !== _id ? _id : userId;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.title = req.body.title || user.title;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).json({ status: true, message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany({ team: userId, isRead: { $nin: [userId] } }, { $push: { isRead: userId } });
    } else {
      await Notice.findOneAndUpdate({ _id: id, isRead: { $nin: [userId] } }, { $push: { isRead: userId } });
    }

    res.status(200).json({ status: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Incorrect old password" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ status: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.isActive = req.body.isActive;
    await user.save();

    res.status(200).json({
      status: true,
      message: `User account has been ${user.isActive ? "activated" : "disabled"}.`,
    });
  } catch (error) {
    console.error("Error activating/deactivating user:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const editUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, title, isAdmin, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.title = title || user.title;
    if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;
    if (typeof isActive === "boolean") user.isActive = isActive;

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).json({ status: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const [users, tasks, notices] = await Promise.all([
      User.find().select("name email role title isAdmin isActive createdAt"),
      Task.find({ isTrashed: false }).select("title stage priority team createdAt date updatedAt"),
      Notice.find().select("createdAt"),
    ]);

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const activeUsers = users.filter((user) => user.isActive).length;
    const adminUsers = users.filter((user) => user.isAdmin).length;
    const recentUsers = users.filter((user) => new Date(user.createdAt) >= thirtyDaysAgo).length;
    const completedTasks = tasks.filter((task) => task.stage === "completed").length;
    const overdueTasks = tasks.filter(
      (task) => task.stage !== "completed" && task.date && new Date(task.date) < now
    ).length;
    const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const stageDistribution = ["todo", "in progress", "completed"].map((stage) => ({
      name: stage === "todo" ? "To Do" : stage === "in progress" ? "In Progress" : "Completed",
      total: tasks.filter((task) => task.stage === stage).length,
    }));

    const priorityDistribution = ["high", "medium", "normal", "low"].map((priority) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      total: tasks.filter((task) => task.priority === priority).length,
    }));

    const signupTrend = Array.from({ length: 6 }, (_, index) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (4 - index), 1);
      return {
        label: start.toLocaleString("en-US", { month: "short" }),
        total: users.filter((user) => {
          const createdAt = new Date(user.createdAt);
          return createdAt >= start && createdAt < end;
        }).length,
      };
    });

    const activityTrend = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(now.getDate() - (6 - index));
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      return {
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        signups: users.filter((user) => {
          const createdAt = new Date(user.createdAt);
          return createdAt >= day && createdAt < nextDay;
        }).length,
        tasks: tasks.filter((task) => {
          const createdAt = new Date(task.createdAt);
          return createdAt >= day && createdAt < nextDay;
        }).length,
      };
    });

    const workloadMap = new Map();
    tasks.forEach((task) => {
      task.team.forEach((memberId) => {
        const key = memberId.toString();
        const current = workloadMap.get(key) || { assigned: 0, completed: 0 };
        current.assigned += 1;
        if (task.stage === "completed") current.completed += 1;
        workloadMap.set(key, current);
      });
    });

    const workload = users
      .map((user) => ({
        name: user.name,
        assigned: workloadMap.get(user._id.toString())?.assigned || 0,
        completed: workloadMap.get(user._id.toString())?.completed || 0,
      }))
      .sort((left, right) => right.assigned - left.assigned)
      .slice(0, 6);

    const recentTasks = [...tasks]
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      .slice(0, 8);

    const teamSnapshot = users.slice(0, 8);

    res.status(200).json({
      status: true,
      summary: {
        totalUsers: users.length,
        activeUsers,
        adminUsers,
        totalTasks: tasks.length,
        completedTasks,
        completionRate,
        recentUsers,
        overdueTasks,
        weeklyAlerts: notices.filter((notice) => new Date(notice.createdAt) >= sevenDaysAgo).length,
      },
      charts: {
        stageDistribution,
        priorityDistribution,
        signupTrend,
        activityTrend,
        workload,
      },
      tables: {
        recentTasks,
        teamSnapshot,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ status: false, message: "Failed to fetch analytics" });
  }
};
