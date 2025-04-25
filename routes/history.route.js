import { Router } from "express";
import { getHistory } from "../controllers/history.controller.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();

router.get("/", authorize, getHistory);

export default router;
