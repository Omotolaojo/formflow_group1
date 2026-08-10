import { Router } from "express";

import {
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  
} from "../controllers/auth.controllers";
import { getCurrentUser } from "../controllers/users.controllers";

import {
  authenticateToken,
} from "../config/auth.middleware";

const router = Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/logout",
  logoutUser
);

router.get(
  "/users",
  getUsers
);

router.get(
  "/me",
  authenticateToken,
  getCurrentUser
);


export default router;