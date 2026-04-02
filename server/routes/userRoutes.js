import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  editUserProfile,
  getAdminAnalytics,
  getNotificationsList,
  getTeamList,
  getUsers,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.get("/analytics", protectRoute, isAdminRoute, getAdminAnalytics);
router.get("/all", protectRoute, isAdminRoute, getUsers);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

router.put("/:id", protectRoute, isAdminRoute, editUserProfile);
router.patch("/:id", protectRoute, isAdminRoute, activateUserProfile);
router.delete("/:id", protectRoute, isAdminRoute, deleteUserProfile);

export default router;
