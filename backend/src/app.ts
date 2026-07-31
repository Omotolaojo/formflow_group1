import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import claimsRoutes from "./routes/claims.routes";
import approveRoutes from "./routes/approve.routes";
import processRoutes from "./routes/process.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost",
  // "https://expense-tracker-system-six.vercel.app",
  // "https://expense-tracker-system-f5iyltu3d-jaysoftys-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(
        `CORS blocked request from origin: ${origin}`
      );

      return callback(
        new Error(
          `Not allowed by CORS: ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

/**
 * Cookie parser
 */
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Claim API is live!",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Claim API is running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/claims",
  claimsRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/approve",
  approveRoutes
);

app.use(
  "/api/process",
  processRoutes
);

export default app;