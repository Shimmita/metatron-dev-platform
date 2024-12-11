import express from "express";
import { handleCreateNewPost } from "../controllers/manage_post_controller.js";
import multer from "multer";
// Set up multer for file uploads
const uploadMulter = multer({ storage: multer.memoryStorage() });

export const postManageRouter = express.Router();

//create post route
postManageRouter.post(
  "/create",
  uploadMulter.single("image"),
  handleCreateNewPost
);
