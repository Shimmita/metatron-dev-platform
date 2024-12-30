import express from "express";
import multer from "multer";
import {
  handleCreateNewPost,
  handleDeleteUserPost,
  handleGetAllTechiePost,
  handleUpdateUserPost,
} from "../controllers/manage_post_controller.js";
// Set up multer for file uploads
const uploadMulter = multer({ storage: multer.memoryStorage() });

export const postManageRouter = express.Router();

//create post route
postManageRouter.post(
  "/create",
  uploadMulter.single("image"),
  handleCreateNewPost
);

// getAllPost
postManageRouter.get("/all", handleGetAllTechiePost);

// get specific job
postManageRouter.get("/all/:id", (req, res) => {
  res.status(200).send("working get spefic job");
});

// edit post
postManageRouter.patch("/edit/:id", handleUpdateUserPost);

// delete post
postManageRouter.delete("/delete/:id", handleDeleteUserPost);
