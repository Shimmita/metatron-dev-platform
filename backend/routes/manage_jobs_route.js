import express from "express";
import multer from "multer";

import {
  handleCreateJob,
  handleDeleteJobPost,
  handleGetAllJobs,
  handleGetAllJobsLatest,
  handleGetAllJobsSearch,
  handleGetNearbyJobs,
  handleGetSpecificJobPost,
  handleGetVerifiedJobs,
  handleJobApplication,
} from "../controllers/manage_jobs_controller.js";
// set up multer for file uploads cloudinary
const uploadMulter = multer({ storage: multer.memoryStorage() });

export const manageJobsRouter = express.Router();

//create jobs route
manageJobsRouter.post("/create", uploadMulter.single("image"), handleCreateJob);
// apply for new job from the posted
manageJobsRouter.post(
  "/application/apply",
  uploadMulter.single("file"),
  handleJobApplication
);

// handle searching of the jobs
manageJobsRouter.post("/all/search", handleGetAllJobsSearch);

// handle getting of the topJobs the latest 3 from the database
manageJobsRouter.get('/all/top', handleGetAllJobsLatest)

// get nearby jobs
manageJobsRouter.post("/all/nearby", handleGetNearbyJobs);

// get all jobs
manageJobsRouter.get("/all", handleGetAllJobs);

// get verified jobs
manageJobsRouter.get("/all/verified", handleGetVerifiedJobs);

// get specific job
manageJobsRouter.get("/all/:id", handleGetSpecificJobPost);

// delete job post
manageJobsRouter.delete("/delete/:id", handleDeleteJobPost);
