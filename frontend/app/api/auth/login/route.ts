import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "NEXT_PUBLIC_API_URL is not configured",
        },
        {
          status: 500,
        }
      );
    }

    /**
     * Login against Express backend.
     */
    const backendResponse =
      await fetch(
        `${apiUrl}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),

          cache: "no-store",
        }
      );

    const result =
      await backendResponse.json();

    /**
     * Backend login failed.
     */
    if (!backendResponse.ok) {
      return NextResponse.json(
        result,
        {
          status:
            backendResponse.status,
        }
      );
    }

    /**
     * IMPORTANT
     *
     * Your Express backend must return
     * the JWT in the response body.
     *
     * The Next.js route then saves it
     * as an HTTP-only cookie.
     */
    if (!result.token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication token was not returned by backend",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * Create Next.js response.
     */
    const response =
      NextResponse.json({
        success: true,

        message:
          "Login successful",

        user:
          result.user,
      });

    /**
     * Save JWT in HTTP-only cookie.
     */
    response.cookies.set(
      "token",
      result.token,
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

        maxAge:
          24 *
          60 *
          60,

        path: "/",
      }
    );

    return response;

  } catch (error) {
    console.error(
      "NEXT LOGIN API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to login",
      },
      {
        status: 500,
      }
    );
  }
}