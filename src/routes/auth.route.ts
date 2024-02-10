import express from "express";

import { create, login } from "../controllers/auth.controller";

const router = express.Router();

router.get("/create", create);
router.get("/login", login);

export default router;
