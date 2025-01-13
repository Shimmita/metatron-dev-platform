import mongoose from "mongoose";
// basic details of the instructor making the course
const instructorDetails = new mongoose.Schema({
  instructor_name: { type: String, required: true, trim: true, default: "" },
  instructor_title: { type: String, required: true, trim: true, default: "" },
  instructor_avatar: { type: String, required: false, trim: true, default: "" },
  instructor_skills: {
    type: [String],
    required: false,
    default: [],
    _id: false,
  },
  instructor_website: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  instructor_github: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  _id: false, //prevent id generation
});

// for indidual user info
const commonUserInfoSchema = new mongoose.Schema({
  name: { type: String, required: false, default: "" },
  avatar: { type: String, required: false, default: "" },
  message: { type: String, required: true, trim: true, default: "" },
  rating: { type: Number, required: true, trim: true, default: 0 },
  _id: false, //prevent id generation
});

// main schema
const courseSchema = new mongoose.Schema(
  {
    instructor: instructorDetails,
    course_title: { type: String, required: true, trim: true },
    course_video_url: {
      type: String,
      trim: true,
      required: false,
      default: "",
    },
    course_video_url_id: {
      type: String,
      trim: true,
      required: false,
      default: "",
    },
    course_logo_url: { type: String, trim: true, required: false, default: "" },
    course_logo_url_id: {
      type: String,
      trim: true,
      required: false,
      default: "",
    },
    course_price: { type: Number, trim: true, required: false, default: 0 },
    course_approved: { type: Boolean, required: false, default: false },
    course_description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    course_topics: { type: [String], required: false, default: [], _id: false },

    course_category: {
      main: { type: String, required: true, trim: true, default: "" },
      sub1: { type: String, trim: true, default: "" },
      sub2: { type: String, trim: true, default: "" },
      sub3: { type: String, trim: true, default: "" },
      _id: false,
    },

    course_comments: {
      comments: [commonUserInfoSchema],
      _id: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Courses", courseSchema);
