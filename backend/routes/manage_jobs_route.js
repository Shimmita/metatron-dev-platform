import express from "express";

import multer from "multer";
import {
  handleCreateJob,
  handleDeleteJobPost,
  handleGetAllobs,
  handleGetSpecificJobPost,
  handleJobApplication,
} from "../controllers/manage_jobs_controller.js";
// set up multer for file uploads cloudinary
const uploadMulter = multer({ storage: multer.memoryStorage() });

export const manageJobsRouter = express.Router();

//create jobs route
manageJobsRouter.post("/create", uploadMulter.single("image"), handleCreateJob);

// get all jobs
manageJobsRouter.get("/all", handleGetAllobs);

// get specific job
manageJobsRouter.get("/all/:id", handleGetSpecificJobPost);

// delete job post
manageJobsRouter.delete("/delete/:id", handleDeleteJobPost);

// apply a new job from the posted
manageJobsRouter.post(
  "/application/apply",
  uploadMulter.array("files"),
  handleJobApplication
);
