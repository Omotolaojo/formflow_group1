import { Router } from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} from "../controllers/users.controllers";

import {
  getAllClaims,
  getPendingClaims,
} from "../controllers/claims.controllers";

import {
  authenticateToken,
  requireAdmin,
} from "../config/auth.middleware";

const router = Router();

/**
 * ============================================================
 * ADMIN USERS
 * ============================================================
 */

/**
 * GET /api/admin/users
 *
 * Get all users.
 */
router.get(
  "/users",
  authenticateToken,
  requireAdmin,
  getUsers
);

/**
 * GET /api/admin/users/:id
 *
 * Get a single user.
 */
router.get(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  getUserById
);

/**
 * PATCH /api/admin/users/:id
 *
 * Update user details.
 */
router.patch(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  updateUser
);

/**
 * PATCH /api/admin/users/:id/role
 *
 * Change USER / ADMIN role.
 */
router.patch(
  "/users/:id/role",
  authenticateToken,
  requireAdmin,
  updateUserRole
);

/**
 * DELETE /api/admin/users/:id
 *
 * Delete user.
 */
router.delete(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  deleteUser
);


/**
 * ============================================================
 * ADMIN CLAIMS
 * ============================================================
 */

/**
 * GET /api/admin/claims
 */
router.get(
  "/claims",
  authenticateToken,
  requireAdmin,
  getAllClaims
);

/**
 * GET /api/admin/claims/pending
 */
router.get(
  "/claims/pending",
  authenticateToken,
  requireAdmin,
  getPendingClaims
);


export default router;