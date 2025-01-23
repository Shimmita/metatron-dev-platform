import app from "express";
import {
  handleSigninPersonal,
  handleSignupPersonal,
  handleSignupPersonalMongo,
} from "../controllers/authentication_controller.js";
import multer from "multer";
const authenticationRouter = app.Router();
// Set up multer for file uploads
const uploadMulter = multer({ storage: multer.memoryStorage() });

// signup user with personal a/c using google auth that takes token param
authenticationRouter.post(
  "/personal/google/:token",
  uploadMulter.single("image"),
  handleSignupPersonal
);

// signup user without a provider to mongoDB database
authenticationRouter.post(
  "/personal/mongo",
  uploadMulter.single("image"),
  handleSignupPersonalMongo
);


// signin users without provider
authenticationRouter.post("/personal", handleSigninPersonal);

export default authenticationRouter;
