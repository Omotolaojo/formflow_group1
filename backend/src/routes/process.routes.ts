import { Router } from "express";
import multer from "multer";
import { processClaim } from "../controllers/process.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  upload.single("file"),
  processClaim
);

export default router;