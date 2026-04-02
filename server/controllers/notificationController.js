import Notice from "../models/notification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.user;
    const limit = parseInt(req.query.limit) || 30;
    const skip = parseInt(req.query.skip) || 0;

    const notifications = await Notice.find({
      team: userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("task", "title");

    const data = notifications.map((n) => ({
      ...n._doc,
      isReadByUser: n.isRead.includes(userId), // 👈 New field added
    }));

    res.status(200).json({ status: true, notifications: data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ status: false, message: "Notification not found." });
    }

    await Notice.findByIdAndUpdate(id, {
      $addToSet: { isRead: userId },
    });

    res.status(200).json({ status: true, message: "Marked as read." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
