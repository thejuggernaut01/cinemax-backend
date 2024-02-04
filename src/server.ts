import http from "http";
import dotenv from "dotenv";

import app from "./app";
import mongoose from "mongoose";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
mongoose.connection.on("error", (error: Error) => console.log(error));
