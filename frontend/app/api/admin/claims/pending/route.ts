import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET(
  request: NextRequest
) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error(
        "NEXT_PUBLIC_API_URL is not configured"
      );

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
     * ============================================================
     * GET JWT FROM HTTP-ONLY COOKIE
     * ============================================================
     */

    const token =
      request.cookies.get("token")?.value;

    if (!token) {
      console.error(
        "Admin pending claims: No token found"
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
     * EXPRESS BACKEND URL
     * ============================================================
     *
     * Frontend:
     *
     * GET /api/admin/claims/pending
     *
     * Next.js proxy:
     *
     * GET ${apiUrl}/claims/pending
     *
     * Express:
     *
     * GET /api/claims/pending
     *
     * ============================================================
     */

    const backendUrl =
      `${apiUrl}/claims/pending`;

    console.log(
      "Fetching pending claims from:",
      backendUrl
    );

    /**
     * ============================================================
     * FORWARD REQUEST TO EXPRESS
     * ============================================================
     */

    const response =
      await fetch(
        backendUrl,
        {
          method: "GET",

          headers: {
            /**
             * Forward JWT cookie
             * to Express backend.
             */
            Cookie:
              `token=${token}`,
          },

          cache: "no-store",
        }
      );

    /**
     * ============================================================
     * READ RESPONSE
     * ============================================================
     */

    const responseText =
      await response.text();

    console.log(
      "Express pending claims response:",
      {
        status:
          response.status,

        response:
          responseText,
      }
    );

    /**
     * ============================================================
     * PARSE JSON
     * ============================================================
     */

    let data: unknown = {};

    try {
      data =
        responseText
          ? JSON.parse(
              responseText
            )
          : {};
    } catch {
      console.error(
        "Express returned invalid JSON:",
        responseText
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Backend returned an invalid response",
        },
        {
          status: 502,
        }
      );
    }

    /**
     * ============================================================
     * RETURN EXPRESS RESPONSE
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
      "ADMIN PENDING CLAIMS PROXY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending claims",
      },
      {
        status: 500,
      }
    );
  }
}