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
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

// Automatically exclude the password field when sending JSON
PostReactionModal.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password; // Remove the password field
    return ret;
  },
});

export default mongoose.model("post_reaction", PostReactionModal);
