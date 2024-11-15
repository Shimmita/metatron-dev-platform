// server/index.mjs

import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import authenticationRouter from "./routes/authentication_route.js";
import express from 'express'
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

// listening for requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//signup users
app.use("/signup/", authenticationRouter);
