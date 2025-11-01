import express from "express";
import { ask } from "../controllers/askController.js";

const router = express.Router();

// POST /ask  or /api/ask
router.post("/", ask);

export default router;
