import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
) {
  try {
    /**
     * ============================================================
     * BACKEND API URL
     * ============================================================
     *
     * Local:
     * http://localhost:5000/api
     *
     * Docker:
     * http://expense-backend:5000/api
     */
    const backendApiUrl =
      process.env.BACKEND_API_URL;

    if (!backendApiUrl) {
      console.error(
        "BACKEND_API_URL is not configured"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "BACKEND_API_URL is not configured",
        },
        {
          status: 500,
        }
      );
    }

    /**
     * ============================================================
     * GET JWT FROM BROWSER COOKIE
     * ============================================================
     */

    const token =
      request.cookies.get(
        "token"
      )?.value;

    if (!token) {
      console.warn(
        "No authentication token found in browser request"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * ============================================================
     * FORWARD JWT TO EXPRESS BACKEND
     * ============================================================
     *
     * Express authentication middleware checks:
     *
     * req.cookies.token
     *
     * Therefore we explicitly forward the
     * JWT using the Cookie header.
     */

    const backendUrl =
      `${backendApiUrl}/auth/me`;

    console.log(
      "Forwarding authentication request to:",
      backendUrl
    );

    const response =
      await fetch(
        backendUrl,
        {
          method: "GET",

          headers: {
            Cookie:
              `token=${token}`,
          },

          cache: "no-store",
        }
      );

    /**
     * ============================================================
     * PARSE BACKEND RESPONSE
     * ============================================================
     */

    const data =
      await response.json();

    console.log(
      "Express /auth/me response:",
      {
        status:
          response.status,

        success:
          data.success,

        user:
          data.user
            ? data.user.email
            : null,
      }
    );

    /**
     * ============================================================
     * RETURN BACKEND RESPONSE TO FRONTEND
     * ============================================================
     */

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      }
    );

  } catch (error) {
    console.error(
      "NEXT.JS AUTH ME ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to retrieve authenticated user",
      },
      {
        status: 500,
      }
    );
  }
}