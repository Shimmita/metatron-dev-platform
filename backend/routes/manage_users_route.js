import app from "express";
import {
    handleGetSearchingUser,
    handleGetSpecifcUser,
    handleGetUserIsOnline,
} from "../controllers/manage_users_controller.js";

const manageUsersRoute = app.Router();

//get specific user
manageUsersRoute.get("/all/:id", handleGetSpecifcUser);

// check if specific user is online or not route based on session data
manageUsersRoute.get("/all/online/:userID", handleGetUserIsOnline);

// for searching users from the frontend during typing for autocomple
manageUsersRoute.get("/all/search/result/user", handleGetSearchingUser);

export default manageUsersRoute;
