import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const approveClaim = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, status } = req.body;

    // Validate request
    if (!id || !status) {
      return res.status(400).json({
        error: "Claim ID and status are required",
      });
    }

    // Validate allowed statuses
    if (
      status !== "approved" &&
      status !== "rejected"
    ) {
      return res.status(400).json({
        error:
          "Status must be approved or rejected",
      });
    }

    // Update claim
    const updatedClaim =
      await prisma.claim.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

    return res.status(200).json(
      updatedClaim
    );
  } catch (error) {
    console.error(
      "APPROVE CLAIM ERROR:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to update claim status",
    });
  }
};