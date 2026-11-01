import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipientId: { type: String, required: true },
        actorId: { type: String, required: true },
        actorUsername: { type: String, required: true },
        type: {
            type: String,
            enum: ["follow", "unfollow", "like"],
            required: true,
        },
        postId: { type: String, default: "" },
        postTitle: { type: String, default: "" },
        read: { type: Boolean, default: false },
    },
    { timestamps: true },
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);