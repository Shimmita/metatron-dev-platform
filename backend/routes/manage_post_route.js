import express from "express";
import multer from "multer";
import {
  handleCreateNewPost,
  handleDeletePostReaction,
  handleDeleteUserPost,
  handleGetAllPostsReactions,
  handleGetAllTechiePost,
  handlePostLiking,
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

// update post likes
postManageRouter.put("/update/likes", handlePostLiking);

// get all post reactions if they match passedID for it's belongs them as notfication
postManageRouter.get("/reactions/all/:id", handleGetAllPostsReactions);

/* delete specific post reaction by unique Ids of the post. a liked user doesnt need this route to delete their
 liked reaction i.e like/unlike coz it will autodelete when they unlike. but the user being notfied that their
 post got a like  needs this route to delete the notification reaction */

postManageRouter.delete("/reactions/delete/:id", handleDeletePostReaction);
