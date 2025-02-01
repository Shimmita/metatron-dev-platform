// server/index.mjs

import bodyParser from "body-parser";
import { default as connectMongoStore } from "connect-mongodb-session";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import { handleAuthMiddleware } from "./middlewares/auth_middleware.js";
import authenticationRouter from "./routes/authentication_route.js";
import manageChatAiRoute from "./routes/manage_chat_route.js";
import manageConnectRequestRoute from "./routes/manage_connect_route.js";
import manageConversationsRoute from "./routes/manage_converse_route.js";
import { coursesManageRouter } from "./routes/manage_courses_route.js";
import { manageJobsRouter } from "./routes/manage_jobs_route.js";
import { postManageRouter } from "./routes/manage_post_route.js";
import manageUsersRoute from "./routes/manage_users_route.js";
const mongoDBSession = connectMongoStore(session);
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: " http://localhost:3000",
    credentials: true,
  })
);

// port for server
const PORT = process.env.PORT || 5000;
// base route
const BASE_ROUTE = process.env.BASE_ROUTE;
// defines if server is under maintainance
const isUnderMaintaince = process.env.MAINTAINANCE === "1";

// init mongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION_URI)
  .then(() => console.log(" connected to mongo database"))
  .catch((err) => console.log("database connection Failed ", err));

// listening for requests
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

// initialise mongoDB session for session storage
const store = new mongoDBSession({
  uri: process.env.MONGO_CONNECTION_URI,
  collection: process.env.SESSION_STORE_NAME,
});

// session initialisation
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: process.env.SESSION_NAME,
    store,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

//signup users
app.use(`${BASE_ROUTE}/signup`, authenticationRouter);

// signin users
app.use(`${BASE_ROUTE}/signin`, authenticationRouter);

// posts route
app.use(`${BASE_ROUTE}/posts`, handleAuthMiddleware, postManageRouter);

// connections route
app.use(
  `${BASE_ROUTE}/connections`,
  handleAuthMiddleware,
  manageConnectRequestRoute
);

//jobs route
app.use(`${BASE_ROUTE}/jobs`, handleAuthMiddleware, manageJobsRouter);

// chat route
app.use(`${BASE_ROUTE}/chats`, handleAuthMiddleware, manageChatAiRoute);

// courses route
app.use(`${BASE_ROUTE}/courses`, handleAuthMiddleware, coursesManageRouter);

//users route
app.use(`${BASE_ROUTE}/users`, handleAuthMiddleware, manageUsersRoute);

app.use(
  `${BASE_ROUTE}/conversations`,
  handleAuthMiddleware,
  manageConversationsRoute
);

// signOut user
app.use(`${BASE_ROUTE}/signout`, (req, res) => {
  try {
    // destroy the session
    req.session.destroy();
    // clear cookie if any
    res.clearCookie(process.env.SESSION_NAME);
    res.status(200).send("logged out successfully");
  } catch (error) {
    res.status(400).send(err.message);
  }
});

// for checking user valid when frontend reloaded. all routes use it
app.use(`${BASE_ROUTE}/valid`, (req, res) => {
  try {
    const isOnline = req.session?.isOnline;
    // session ended/expired or guest user
    if (!isOnline) {
      throw new Error("Hey there, welcome");
    }

    // server is under maintainance
    if (isUnderMaintaince) {
      throw new Error("server under maintainance try again later");
    }

    res.status(200).send({ authorised: true });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// not found route
app.use("*", (req, res) => {
  res.status(404).send("resource not accessible!");
});
