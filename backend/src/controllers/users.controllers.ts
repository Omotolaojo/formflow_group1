import { Request, Response } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";

/**
 * ============================================================
 * GET ALL USERS
 * ============================================================
 *
 * GET /api/admin/users
 *
 * Admin only.
 */
export const getUsers = async (
  _req: Request,
  res: Response
) => {
  try {
    const users =
      await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              claims: true,
            },
        }
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error(
      "GET USERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve users",
    });
  }
};


/**
 * ============================================================
 * GET CURRENT USER
 * ============================================================
 *
 * GET /api/auth/me
 *
 * Authentication required.
 */
export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: req.user.userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "GET CURRENT USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve current user",
    });
  }
};


/**
 * ============================================================
 * GET USER BY ID
 * ============================================================
 *
 * GET /api/admin/users/:id
 *
 * Admin only.
 */
export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user =
      await prisma.user.findUnique({
        where: {
          id: String(id),
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,

          claims: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "GET USER BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve user",
    });
  }
};


/**
 * ============================================================
 * UPDATE USER
 * ============================================================
 *
 * PATCH /api/admin/users/:id
 *
 * Admin only.
 */
/**
 * ============================================================
 * UPDATE USER
 * ============================================================
 *
 * PATCH /api/admin/users/:id
 *
 * Admin only.
 *
 * Updates:
 * - name
 * - email
 * - role
 */
export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      role,
    } = req.body;

    /**
     * ==========================================================
     * VALIDATE USER ID
     * ==========================================================
     */

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "User ID is required",
      });
    }

    /**
     * ==========================================================
     * CHECK USER EXISTS
     * ==========================================================
     */

    const existingUser =
      await prisma.user.findUnique({
        where: {
          id: String(id),
        },
      });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    /**
     * ==========================================================
     * VALIDATE THAT AT LEAST ONE FIELD
     * WAS PROVIDED
     * ==========================================================
     */

    if (
      name === undefined &&
      email === undefined &&
      role === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field is required",
      });
    }

    /**
     * ==========================================================
     * VALIDATE NAME
     * ==========================================================
     */

    if (
      name !== undefined &&
      (
        typeof name !== "string" ||
        name.trim().length === 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name cannot be empty",
      });
    }

    /**
     * ==========================================================
     * NORMALIZE EMAIL
     * ==========================================================
     */

    const normalizedEmail =
      email !== undefined
        ? email.trim().toLowerCase()
        : undefined;

    /**
     * ==========================================================
     * VALIDATE EMAIL
     * ==========================================================
     */

    if (
      email !== undefined &&
      !normalizedEmail
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email cannot be empty",
      });
    }

    /**
     * ==========================================================
     * VALIDATE ROLE
     * ==========================================================
     */

    if (
      role !== undefined &&
      role !== Role.USER &&
      role !== Role.ADMIN
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be USER or ADMIN",
      });
    }

    /**
     * ==========================================================
     * PREVENT ADMIN FROM CHANGING THEIR OWN ROLE
     * ==========================================================
     */

    if (
      role !== undefined &&
      role !== existingUser.role &&
      req.user?.userId === existingUser.id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role",
      });
    }

    /**
     * ==========================================================
     * CHECK DUPLICATE EMAIL
     * ==========================================================
     */

    if (
      normalizedEmail &&
      normalizedEmail !==
        existingUser.email
    ) {
      const emailExists =
        await prisma.user.findUnique({
          where: {
            email:
              normalizedEmail,
          },
        });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message:
            "A user with this email already exists",
        });
      }
    }

    /**
     * ==========================================================
     * UPDATE USER
     * ==========================================================
     */

    const updatedUser =
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },

        data: {
          ...(name !== undefined
            ? {
                name:
                  name.trim(),
              }
            : {}),

          ...(normalizedEmail !== undefined
            ? {
                email:
                  normalizedEmail,
              }
            : {}),

          ...(role !== undefined
            ? {
                role,
              }
            : {}),
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    /**
     * ==========================================================
     * RETURN UPDATED USER
     * ==========================================================
     */

    return res.status(200).json({
      success: true,

      message:
        "User updated successfully",

      user: updatedUser,
    });

  } catch (error) {
    console.error(
      "UPDATE USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user",
    });
  }
};

/**
 * ============================================================
 * UPDATE USER ROLE
 * ============================================================
 *
 * PATCH /api/admin/users/:id/role
 *
 * Admin only.
 */
export const updateUserRole = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    /**
     * Validate role.
     */
    if (
      role !== Role.USER &&
      role !== Role.ADMIN
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be USER or ADMIN",
      });
    }

    /**
     * Make sure target user exists.
     */
    const targetUser =
      await prisma.user.findUnique({
        where: {
          id: String(id),
        },
      });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    /**
     * Prevent admin from changing
     * their own role.
     */
    if (
      req.user?.userId ===
      targetUser.id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role",
      });
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: targetUser.id,
        },

        data: {
          role,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "User role updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(
      "UPDATE USER ROLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user role",
    });
  }
};


/**
 * ============================================================
 * DELETE USER
 * ============================================================
 *
 * DELETE /api/admin/users/:id
 *
 * Admin only.
 */
export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    /**
     * Make sure user exists.
     */
    const targetUser =
      await prisma.user.findUnique({
        where: {
          id: String(id),
        },
      });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    /**
     * Prevent admin from deleting
     * their own account.
     */
    if (
      req.user?.userId ===
      targetUser.id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account",
      });
    }

    /**
     * Delete user.
     *
     * Your Prisma relation currently
     * uses onDelete: Cascade, so
     * associated claims will also
     * be deleted.
     */
    await prisma.user.delete({
      where: {
        id: targetUser.id,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete user",
    });
  }
};