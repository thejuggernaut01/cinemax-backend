import express, { Express } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

const app: Express = express();

app.use(
  cors({
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Cookie parser middleware for parsing cookies sent by the client
app.use(cookieParser());
// Compress responses
app.use(compression());

// API routes go here
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
