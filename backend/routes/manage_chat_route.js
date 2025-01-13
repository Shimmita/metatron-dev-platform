import app from "express";
import { handleChatAi } from "../controllers/manage_chat_controller.js";

const manageChatAiRoute = app.Router();

// route hits the chating ai
manageChatAiRoute.post("/ai", handleChatAi);

export default manageChatAiRoute;
