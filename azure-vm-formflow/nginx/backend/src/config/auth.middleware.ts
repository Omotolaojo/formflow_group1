import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

/**
 * ============================================================
 * AUTHENTICATED USER TYPE
 * ============================================================
 */

export type AuthenticatedUser = {
  userId: string;
  email: string;
  role: string;
};

/**
 * ============================================================
 * EXTEND EXPRESS REQUEST
 * ============================================================
 */

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Supports JWT authentication from:
 *
 * 1. HTTP-only cookie:
 *    token
 *
 * 2. Authorization header:
 *    Authorization: Bearer <token>
 *
 * Next.js API proxy routes currently forward
 * the JWT using the Cookie header.
 */

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * ========================================================
     * CHECK JWT SECRET
     * ========================================================
     */

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured"
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication service is not configured correctly",
      });
    }

    /**
     * ========================================================
     * GET TOKEN FROM AUTHORIZATION HEADER
     * ========================================================
     *
     * Expected:
     *
     * Authorization: Bearer eyJhbGciOi...
     */

    const authHeader =
      req.headers.authorization;

    let token: string | undefined;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token =
        authHeader.substring(7);
    }

    /**
     * ========================================================
     * FALLBACK TO HTTP-ONLY COOKIE
     * ========================================================
     *
     * This allows direct backend requests to work
     * when the browser sends the cookie directly.
     */

    if (!token) {
      token =
        req.cookies?.token;
    }

    /**
     * ========================================================
     * NO TOKEN
     * ========================================================
     */

if (!token) {
  console.warn(
    "============================================================"
  );

  console.warn(
    "AUTHENTICATION FAILED: NO TOKEN FOUND"
  );

  console.warn(
    "Method:",
    req.method
  );

  console.warn(
    "URL:",
    req.originalUrl
  );

  console.warn(
    "Authorization Header:",
    req.headers.authorization
      ? "PRESENT"
      : "MISSING"
  );

  console.warn(
    "Cookie Token:",
    req.cookies?.token
      ? "PRESENT"
      : "MISSING"
  );

  console.warn(
    "============================================================"
  );

  return res.status(401).json({
    success: false,
    message:
      "Authentication required",
  });
}
    /**
     * ========================================================
     * VERIFY JWT
     * ========================================================
     */

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as AuthenticatedUser;

    /**
     * ========================================================
     * ATTACH USER TO REQUEST
     * ========================================================
     */

    req.user = decoded;

    console.log(
      "Authenticated user:",
      {
        userId:
          decoded.userId,

        email:
          decoded.email,

        role:
          decoded.role,
      }
    );

    /**
     * ========================================================
     * CONTINUE
     * ========================================================
     */

    next();

  } catch (error) {

    console.error(
      "AUTHENTICATION ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token",
    });
  }
};

/**
 * ============================================================
 * ADMIN AUTHORIZATION MIDDLEWARE
 * ============================================================
 */

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  /**
   * Make sure user is authenticated.
   */

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required",
    });
  }

  /**
   * Check ADMIN role.
   */

  if (
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Administrator privileges required.",
    });
  }

  /**
   * User is authenticated
   * and is an administrator.
   */

  next();
};