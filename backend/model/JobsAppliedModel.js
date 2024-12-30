import mongoose from "mongoose";

const jobAppliedSchema = new mongoose.Schema(
  {
    applicant: {
      name: {
        type: String,
        required: [true, "applicant name is required"],
        trim: true,
      },
      ID: {
        type: String,
        required: [true, "applicant ID is required"],
        trim: true,
      },
      gender: {
        type: String,
        required: [true, "applicant gender is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "applicant country is required"],
        trim: true,
      },

      _id: false,
    },

    jobID: {
      type: String,
      required: true,
    },

    cvLink: {
      type: String,
      required: false,
      default: "",
    },
    letterLink: {
      type: String,
      required: false,
      default: "",
    },
    viewed: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically exclude the applicantID field when sending JSON
// coz the current user in the frontend has this ID and also for security reasons,
jobAppliedSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.applicant.ID; // Remove the applicantID field
    return ret;
  },
});

export default mongoose.model("JobApp", jobAppliedSchema);
