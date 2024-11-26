// server/index.mjs

import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import authenticationRouter from "./routes/authentication_route.js";

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// init mongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION_URI)
  .then(() => console.log(" connected to mongo database"))
  .catch((err) => console.log("database connection Failed ", err));

// listening for requests
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

//signup users
app.use("/signup/", authenticationRouter);
// signin users
app.use('/signin',authenticationRouter)
