import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
    },
    course: {
      type: String,
      required: false,
      trim: true,
    },
    about: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    educationLevel: {
      type: String,
      required: [true, "Education level is required"],
      enum: {
        values: ["Diploma", "Bachelors", "Masters", "PhD"],
        message:
          "Invalid education level, should be Diploma, Bachelors, Masters or PhD",
      },
    },
    eduInstitution: {
      type: String,
      required: [true, "Education institution is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    county: {
      type: String,
      required: [true, "County is required"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female or Other",
      },
    },
    specialisationTitle: {
      type: String,
      required: [true, "Specialisation title is required"],
      trim: true,
    },
    selectedSkills: {
      type: [String],
      required: [true, "At least one skill must be selected"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserPersonal", userSchema);
