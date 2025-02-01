import app from "express";
import {
    handleCreateNewConversation,
    handleGetAllMessageConversation,
    handleGetUserConvesations,
    handleSendMessageToConversation,
} from "../controllers/manage_Convers_controller.js";

const manageConversationsRoute = app.Router();

//create a conversation
manageConversationsRoute.post("/users/create", handleCreateNewConversation);

// send a message to an existing coversation
manageConversationsRoute.post(
  "/users/message/create",
  handleSendMessageToConversation
);

// get user specific conversations based on their iD
manageConversationsRoute.get("/users/all/:userID", handleGetUserConvesations);

// get all messages of a given conversation unique ID
manageConversationsRoute.get(
  "/users/message/:conversationId",
  handleGetAllMessageConversation
);

// update conversation message route
manageConversationsRoute.put("/users/message/update/:messageId",)

export default manageConversationsRoute;
