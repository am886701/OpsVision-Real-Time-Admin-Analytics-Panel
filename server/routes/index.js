import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import notificationRoutes from "./notificationRoute.js"; // make sure .js extension is present

const router = express.Router();

router.use("/user", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/notifications", notificationRoutes); // add this line

export default router;
