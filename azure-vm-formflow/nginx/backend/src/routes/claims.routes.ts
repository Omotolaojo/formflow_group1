import { Router } from "express";

import {
  createClaim,
  getAllClaims,
  getPendingClaims,
} from "../controllers/claims.controllers";

import {
  authenticateToken,
} from "../config/auth.middleware";

const router = Router();

// GET pending claims
// GET /api/claims
router.get("/", getPendingClaims);

// GET all claims
// GET /api/claims/all
router.get("/all", getAllClaims);

router.get(
  "/pending",
  authenticateToken,
  getPendingClaims
);

// CREATE a new claim
// POST /api/claims
router.post("/", createClaim);

export default router;