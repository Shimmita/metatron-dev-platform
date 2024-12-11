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
import { postManageRouter } from "./routes/manage_post_route.js";
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

const PORT = process.env.PORT || 5000;
const BASE_ROUTE = process.env.BASE_ROUTE;

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
      maxAge: 10000,
    },
  })
);

//signup users
app.use(`${BASE_ROUTE}/signup`, authenticationRouter);

// signin users
app.use(`${BASE_ROUTE}/signin`, authenticationRouter);

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

// create post when user is loggedin only
app.use(`${BASE_ROUTE}/post`, handleAuthMiddleware, postManageRouter);

// not found route
app.use("*", (req, res) => {
  res.status(404).send("Resource you are looking for is not found!");
});
