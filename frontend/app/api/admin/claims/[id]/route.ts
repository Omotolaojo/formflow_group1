import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    /**
     * ============================================================
     * API URL
     * ============================================================
     */

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
        "Admin claim update: No token found"
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
     * GET CLAIM ID
     * ============================================================
     */

    const {
      id,
    } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Claim ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * ============================================================
     * GET REQUEST BODY
     * ============================================================
     */

    const body =
      await request.json();

    console.log(
      "Updating admin claim:",
      {
        id,
        status:
          body.status,
      }
    );

    /**
     * ============================================================
     * EXPRESS BACKEND URL
     * ============================================================
     *
     * Frontend:
     *
     * PATCH /api/admin/claims/:id
     *
     * Next.js proxy:
     *
     * PATCH ${apiUrl}/claims/:id/status
     *
     * Express:
     *
     * PATCH /api/claims/:id/status
     *
     * ============================================================
     */

    const backendUrl =
      `${apiUrl}/claims/${id}/status`;

    console.log(
      "Forwarding claim status update to:",
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
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            /**
             * Forward authentication
             * cookie to Express.
             */
            Cookie:
              `token=${token}`,
          },

          body:
            JSON.stringify(
              body
            ),

          cache: "no-store",
        }
      );

    /**
     * ============================================================
     * READ EXPRESS RESPONSE
     * ============================================================
     */

    const responseText =
      await response.text();

    console.log(
      "Express claim update response:",
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
      "ADMIN CLAIM UPDATE PROXY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update claim status",
      },
      {
        status: 500,
      }
    );
  }
}