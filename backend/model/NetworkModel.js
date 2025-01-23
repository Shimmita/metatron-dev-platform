import mongoose from "mongoose";

const NetworkModel = new mongoose.Schema(
  {
    userID: {
      type: [mongoose.Schema.Types.ObjectId],
      required: [true, "userId owning the followers is required"],
      trim: true,
      unique: true,
    },
    networkID: {
      type: [String],
      required: [true, "friend Id is required"],
      trim: true,
      default: [],
      _id: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("network_connection", NetworkModel);
