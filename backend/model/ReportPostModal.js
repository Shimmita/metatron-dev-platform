import mongoose from "mongoose";

const ReportPostModal = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: [true, "postId is required"],
      trim: true,
    },

    postOwnerId: {
      type: String,
      required: [true, "postOwenerId is required"],
      trim: true,
    },

    post_owner_viewed: {
      type: Boolean,
      required: false,
      default: false,
    },

    post_title: {
      type: String,
      required: [true, "post title required"],
      trim: true,
    },

    reporterId: {
      type: String,
      required: [true, "reporterId of user is required"],
      trim: true,
    },

    reporter_name: {
      type: String,
      required: [true, "reporter name is required"],
      trim: true,
    },

    reporter_speciality: {
      type: String,
      required: [true, "reporter specialisation is required"],
      trim: true,
    },

    reporter_avatar: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },

    report_title: {
      type: String,
      required: [true, " reporting about what is required"],
      trim: true,
    },
    report_message: {
      type: String,
      unique: true,
      required: [true, "report message or description is required"],
      trim: true,
    },
    report_count: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("report_post", ReportPostModal);
