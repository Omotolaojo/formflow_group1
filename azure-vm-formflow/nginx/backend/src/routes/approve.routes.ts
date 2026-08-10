import { Router } from "express";
import { approveClaim } from "../controllers/approve.controllers";


const router = Router();

router.post("/", approveClaim);

export default router;