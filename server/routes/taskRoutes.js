import express from "express";
import {
  createSubTask,
  createTask,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  getTrashedTasks,
  permanentlyDeleteAllTasks,
  permanentlyDeleteTask,
  postTaskActivity,
  restoreAllTasks,
  trashTask,
  updateTask,
} from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createTask);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/", protectRoute, getTasks);
router.get("/trash", protectRoute, isAdminRoute, getTrashedTasks);
router.get("/:id", protectRoute, getTask);

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/trash/:id", protectRoute, isAdminRoute, trashTask);
router.put("/restore/:id", protectRoute, isAdminRoute, deleteRestoreTask);
router.put("/restore-all", protectRoute, isAdminRoute, restoreAllTasks);
router.put("/:id", protectRoute, isAdminRoute, updateTask);

router.delete("/delete/:id", protectRoute, isAdminRoute, permanentlyDeleteTask);
router.delete("/delete-all", protectRoute, isAdminRoute, permanentlyDeleteAllTasks);

export default router;
