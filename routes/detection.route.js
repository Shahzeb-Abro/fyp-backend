import { Router } from "express";
import { detectUlcer } from "../controllers/detection.controller.js";
const router = Router();

import multer from "multer";
import { authorize } from "../middlewares/authorize.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post("/", authorize, upload.single("file"), detectUlcer);

export default router;
