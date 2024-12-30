import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "job title is required"],
      trim: true,
    },
    organisation: {
      name: {
        type: String,
        required: [true, "organisation name is required"],
        trim: true,
      },
      about: {
        type: String,
        required: [true, "provide an about for your organisation"],
        trim: true,
      },
      _id: false,
    },
    logo: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    logoID: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      required: [true, "At least one skill must be provided"],
    },

    requirements: {
      document: {
        type: String,
        required: [true, "Document application type is required"],
        trim: true,
      },
      qualification: {
        type: [String],
        required: [true, "At least one qualification must be provided"],
        trim: true,
      },
      description: {
        type: [String],
        required: [true, "At least one description must be provided"],
        trim: true,
      },
      _id: false,
    },

    entry: {
      level: {
        type: String,
        required: [true, "level of entry is required"],
        trim: true,
        default: "",
      },
      years: {
        type: String,
        required: [true, "minimum years of experience is required"],
        trim: true,
        default: "",
      },
      _id: false,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },

    salary: {
      type: String,
      trim: true,
      default: "",
      required: [true, "monthly salary range in KES or USD is required"],
    },

    location: {
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "City or state is required"],
        trim: true,
      },
      _id: false,
    },

    contacts: {
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
      _id: false,
    },
    applicants: {
      total: {
        type: Number,
        default: 0,
      },
      male: {
        type: Number,
        default: 0,
      },
      female: {
        type: Number,
        default: 0,
      },
      other: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Jobs", jobSchema);
