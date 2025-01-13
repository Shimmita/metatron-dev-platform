import express from "express";
import multer from "multer";
import {
  handleCreateNewCourse,
  handleDeleteCourse,
  handleGetAllCourses,
  handleUpdateCourse,
} from "../controllers/manage_courses_controller.js";

// Set up multer for file uploads
const uploadMulter = multer({ storage: multer.memoryStorage() });
const MAX_FILE_UPLOAD=2

export const coursesManageRouter = express.Router();

//create post route
coursesManageRouter.post(
  "/create",
  uploadMulter.array("file",MAX_FILE_UPLOAD),
  handleCreateNewCourse
);

// getAllPost
coursesManageRouter.get("/all", handleGetAllCourses);

// get specific job
coursesManageRouter.get("/all/:id", (req, res) => {
  res.status(200).send("working get spefic job");
});

// edit post
coursesManageRouter.patch("/edit/:id", handleUpdateCourse);

// delete post
coursesManageRouter.delete("/delete/:id", handleDeleteCourse);
