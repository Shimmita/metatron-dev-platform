import mongoose from "mongoose";

const ConversationModel = new mongoose.Schema(
  {
    participants: [{ type: String, required: true, ref: "personal" }],
    lastMessage: { type: String },
    updatedAt: { type: Date, default: Date.now },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, required: false, default: "" },
    targetName: { type: String, required: true },
    targetAvatar: { type: String, required: false, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("conversation", ConversationModel);
