import mongoose from "mongoose";

const PostReactionModal = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: [true, "postId is required"],
      trim: true,
    },

    ownerId: {
      type: String,
      required: [true, "ownerId is required"],
      trim: true,
    },

    userId: {
      type: String,
      required: [true, "userId is required"],
      trim: true,
    },

    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },

    title: {
      type: String,
      required: [true, "title of the user required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "main message main required"],
      trim: true,
    },

    minimessage: {
      type: String,
      required: [true, "overview message is required"],
      trim: true,
    },

    likes: {
      type: Number,
      required: [true, "likes count is required"],
      trim: true,
    },

    comments: {
      type: Number,
      required: [true, "comment count is required"],
      trim: true,
    },

    github: {
      type: Number,
      required: [true, "github count is required"],
      trim: true,
    },
    report_count: {
      type: Number,
      required: [true, "report count of the post is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("post_reaction", PostReactionModal);
