import { Router } from "express";
import {
  deleteAllHistory,
  deleteHistory,
  getHistory,
} from "../controllers/history.controller.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();

router.get("/", authorize, getHistory);
router.delete("/:id", authorize, deleteHistory);
router.delete("/", authorize, deleteAllHistory);

export default router;
