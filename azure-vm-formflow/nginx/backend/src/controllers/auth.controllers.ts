import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "A user with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        },
      });

    return res.status(201).json({
      success: true,

      message:
        "User registered successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "REGISTER USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to register user",
    });
  }
};


export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not configured"
      );
    }

    const token =
      jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "1d",
        }
      );

    console.log(
      "User logged in:",
      user.email
    );

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "LOGIN USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to login",
    });
  }
};


export const logoutUser = async (
  _req: Request,
  res: Response
) => {
  try {
    console.log(
      "Logout request received"
    );

    console.log(
      "Token before logout:",
      _req.cookies?.token
        ? "Token exists"
        : "No token"
    );

    /**
     * Clear the authentication cookie.
     *
     * These options must match
     * the options used when creating
     * the cookie.
     */
    res.clearCookie(
      "token",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",
        path: "/",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Logout successful",
    });

  } catch (error) {
    console.error(
      "LOGOUT USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to logout",
    });
  }
};
export const getUsers = async (
  req: Request,
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