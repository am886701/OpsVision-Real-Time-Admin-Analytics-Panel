import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ status: false, message: "Not authorized. Try login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        status: false,
        message: "User account is unavailable. Please contact an administrator.",
      });
    }

    req.user = {
      userId: user._id.toString(),
      isAdmin: user.isAdmin,
      role: user.role,
      email: user.email,
      name: user.name,
      title: user.title,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };
