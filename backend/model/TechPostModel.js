import mongoose from "mongoose";
// basic details of the user making post
const ownerDetails = new mongoose.Schema({
  ownerId: { type: String, required: true },
  ownername: { type: String, required: true, trim: true, default: "" },
  ownertitle: { type: String, required: true, trim: true, default: "" },
  owneravatar: { type: String, required: false, trim: true, default: "" },
  ownerverified: { type: Boolean, required: false, default: false },
  ownerskills: { type: [String], required: false, default: [], _id: false },
  _id: false, //prevent id generation
});

// for github links and clicks
const commonUserInfoSchema = new mongoose.Schema({
  userId: { type: String, required: false, default: "" },
  name: { type: String, required: false, default: "" },
  title: { type: String, required: false, default: "" },
  country: { type: String, required: true, trim: true, default: "" },
  state: { type: String, required: true, trim: true, default: "" },
  _id: false, //prevent id generation
});

// comment for the post
const commentSchema = new mongoose.Schema({
  commentor: commonUserInfoSchema,
  date: { type: Date, default: Date.now },
  body: { type: String, required: false, trim: true, default: "" },
  liked: {
    clicks: { type: Number, required: false, default: 0 },
    clickers: {
      type: [commonUserInfoSchema],
      default: [],
      _id: false,
    },
    _id: false,
  },
  disliked: {
    clicks: { type: Number, required: false, default: 0 },
    clickers: {
      type: [commonUserInfoSchema],
      default: [],
      _id: false,
    },
    _id: false,
  },
});

// main schema
const postSchema = new mongoose.Schema(
  {
    post_owner: ownerDetails,
    post_title: { type: String, required: true, trim: true },
    post_url: { type: String, trim: true, required: false, default: "" },
    post_url_id: { type: String, trim: true, required: false, default: "" },
    post_body: { type: String, required: true, trim: true, default: "" },
    post_category: {
      main: { type: String, required: true, trim: true, default: "" },
      sub1: { type: String, trim: true, default: "" },
      sub2: { type: String, trim: true, default: "" },
      sub3: { type: String, trim: true, default: "" },
      _id: false,
    },
    post_location: {
      country: { type: String, required: true, trim: true, default: "" },
      state: { type: String, required: true, trim: true, default: "" },
      _id: false,
    },
    post_edited: { type: Boolean, required: false, default: false },
    post_liked: {
      clicks: { type: Number, required: false, default: 0 },
      clickers: [commonUserInfoSchema],
      _id: false,
    },
    post_github: {
      link: { type: String, required: false, trim: true, default: "" },
      clicks: { type: Number, required: false, default: 0 },
      clickers: [commonUserInfoSchema],
      _id: false,
    },
    post_comments: {
      count: { type: Number, required: false, default: 0 },
      comments: [commentSchema],
      _id: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TechPost", postSchema);
