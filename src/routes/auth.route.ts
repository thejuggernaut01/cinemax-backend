import express from "express";

import { create } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.get("/create", create);

export default authRouter;
