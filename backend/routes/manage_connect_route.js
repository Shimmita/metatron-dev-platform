import app from "express";
import {
  handleAcceptPreviousConnectRequest,
  handleCreateNewConnectionRequest,
  handleGetAllConnectionRequest,
  handleGetTopUsersToConnect,
  handleRejectAcceptingConnectRequest,
  handleUnfriendConnection,
} from "../controllers/manage_connect_controller.js";

const manageConnectRequestRoute = app.Router();

// create connect request
manageConnectRequestRoute.post(
  "/connection/create",
  handleCreateNewConnectionRequest
);

// accept saving of user previously sent a connect request add them to your network
manageConnectRequestRoute.post(
  "/connection/accept/:connectRequestID/:senderID/:targetID",
  handleAcceptPreviousConnectRequest
);

// reject a user who previously requested to connect. the connect request ID is used to
// handle deletion.
manageConnectRequestRoute.post(
  "/connection/reject/:connectRequestID",
  handleRejectAcceptingConnectRequest
);

//get all connection requests made by the users targeting a specific user
manageConnectRequestRoute.get(
  "/connection/all/:id",
  handleGetAllConnectionRequest
);

// get 10 users latest which are not frineds to the current user for connect req
// like system recommendation
manageConnectRequestRoute.get(
  "/connection/users/:id",
  handleGetTopUsersToConnect
);

// handle the unfriending of a user like remove them from your network
manageConnectRequestRoute.delete(
  "/connection/unfriend/:senderID/:targetID",
  handleUnfriendConnection
);

export default manageConnectRequestRoute;
