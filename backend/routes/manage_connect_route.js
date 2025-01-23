import app from "express";
import {
  handleCreateNewConnectionRequest,
  handleGetAllConnectionRequest,
  handleGetTopUsersToConnect,
} from "../controllers/manage_connect_controller.js";

const manageConnectRequestRoute = app.Router();

// create connect request
manageConnectRequestRoute.post(
  "/connection/create",
  handleCreateNewConnectionRequest
);

//get all connection requests made by the users targeting a specific user
manageConnectRequestRoute.get(
  "/connection/all/:id",
  handleGetAllConnectionRequest
);

// get 10 users latest which are not frineds to the current user for connect req
manageConnectRequestRoute.get(
  "/connection/users/:id",
  handleGetTopUsersToConnect
);

export default manageConnectRequestRoute;
