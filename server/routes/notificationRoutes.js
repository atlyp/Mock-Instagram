import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipientId: req.params.userId,
        })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, notifications });
    } catch (error) {
        console.error("There was an error getting notifications", error);
        res.status(500).json({
            success: false,
            message: "There was an error getting notifications.",
        });
    }
});

router.patch("/:userId/read-all", async (req, res) => {
    try {
        await Notification.updateMany(
            { recipientId: req.params.userId, read: false },
            { $set: { read: true } },
        );
        res.json({ success: true });
    } catch (error) {
        console.error("There was an error marking notifications as read", error);
        res.status(500).json({
            success: false,
            message: "There was an error updating notifications.",
        });
    }
});

router.patch("/:userId/:notificationId/read", async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.notificationId,
                recipientId: req.params.userId,
            },
            { $set: { read: true } },
            { new: true },
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        res.json({ success: true, notification });
    } catch (error) {
        console.error("There was an error updating a notification", error);
        res.status(500).json({
            success: false,
            message: "There was an error updating the notification.",
        });
    }
});

export default router;
