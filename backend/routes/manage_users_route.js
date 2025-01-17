import app from "express";
import { handleGetSpecifcUser } from "../controllers/manage_users_controller.js";

const manageUsersRoute = app.Router();

//get specific user
manageUsersRoute.get("/all/:id", handleGetSpecifcUser);

export default manageUsersRoute;
