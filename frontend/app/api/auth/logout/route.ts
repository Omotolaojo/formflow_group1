import {
  NextResponse,
} from "next/server";

export async function POST() {
  try {
    const response =
      NextResponse.json({
        success: true,
        message:
          "Logout successful",
      });

    /**
     * Delete the Next.js
     * authentication cookie.
     */
    response.cookies.set(
      "token",
      "",
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

        expires:
          new Date(0),

        path: "/",
      }
    );

    return response;

  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}