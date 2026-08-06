import { Request, Response } from "express";
import { ClaimStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

export const getAllClaims = async (
  _req: Request,
  res: Response
) => {
  try {
    const claims = await prisma.claim.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(claims);
  } catch (error) {
    console.error(
      "GET /api/claims/all error:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch all claims",
    });
  }
};

export const getPendingClaims = async (
  _req: Request,
  res: Response
) => {
  try {
    const claims = await prisma.claim.findMany({
      where: {
        status: ClaimStatus.pending,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(claims);
  } catch (error) {
    console.error(
      "GET /api/claims error:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch claims",
    });
  }
};

export const createClaim = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(
      "POST /api/claims body:",
      req.body
    );

    const {
      vendor,
      amount,
      date,
      receiptUrl,
    } = req.body;

    // Validate required fields
    if (
      !vendor ||
      amount === undefined ||
      amount === null ||
      !date
    ) {
      return res.status(400).json({
        error:
          "Vendor, amount, and date are required",
      });
    }

    // Validate amount
    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        error:
          "Amount must be a valid number greater than zero",
      });
    }

    // Create claim
    const claim = await prisma.claim.create({
      data: {
        vendor: String(vendor),
        amount: numericAmount,
        date: new Date(date),
        status: ClaimStatus.pending,
        receiptUrl:
          receiptUrl || null,
      },
    });

    console.log(
      "Claim created successfully:",
      claim
    );

    return res.status(201).json(claim);
  } catch (error) {
    console.error(
      "POST /api/claims error:",
      error
    );

    return res.status(500).json({
      error: "Failed to create claim",
    });
  }
};

export const updateClaimStatus = async (
  req: Request,
  res: Response
) => {
  try {
    /**
     * --------------------------------------------------------
     * AUTHENTICATION
     * --------------------------------------------------------
     */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    /**
     * --------------------------------------------------------
     * ADMIN AUTHORIZATION
     * --------------------------------------------------------
     */

    if (
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Administrator privileges required",
      });
    }

    /**
     * --------------------------------------------------------
     * GET CLAIM ID
     * --------------------------------------------------------
     */

    const {
      id,
    } = req.params;

    /**
     * --------------------------------------------------------
     * GET REQUEST BODY
     * --------------------------------------------------------
     */

    const {
      status,
    } = req.body;

    /**
     * --------------------------------------------------------
     * VALIDATE STATUS
     * --------------------------------------------------------
     */

    const lowerStatus =
      status?.toLowerCase();

    if (
      !Object.values(
        ClaimStatus
      ).includes(
        lowerStatus as ClaimStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Invalid status value. Expected one of: ${Object.values(
            ClaimStatus
          ).join(", ")}`,
      });
    }

    /**
     * --------------------------------------------------------
     * CHECK CLAIM EXISTS
     * --------------------------------------------------------
     */

    const existingClaim =
      await prisma.claim.findUnique({
        where: {
          id: String(id),
        },
      });

    if (!existingClaim) {
      console.warn(
        "UPDATE CLAIM STATUS: CLAIM NOT FOUND",
        {
          claimId: id,
        }
      );

      return res.status(404).json({
        success: false,
        message:
          "Claim not found",
      });
    }

    /**
     * --------------------------------------------------------
     * UPDATE CLAIM STATUS
     * --------------------------------------------------------
     */

    const updatedClaim =
      await prisma.claim.update({
        where: {
          id: String(id),
        },

        data: {
          status:
            lowerStatus as ClaimStatus,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    /**
     * --------------------------------------------------------
     * SUCCESS RESPONSE
     * --------------------------------------------------------
     */

    return res.status(200).json({
      success: true,

      message:
        `Claim ${lowerStatus} successfully`,

      claim:
        updatedClaim,
    });

  } catch (error) {
    console.error(
      "UPDATE CLAIM STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update claim status",
    });
  }
};