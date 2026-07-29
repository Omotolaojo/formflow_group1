import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function POST(request: Request) {
  try {
    if (!BACKEND_API_URL) {
      console.error("BACKEND_API_URL is not configured");

      return NextResponse.json(
        {
          success: false,
          message: "BACKEND_API_URL is not configured",
        },
        {
          status: 500,
        },
      );
    }

    const body = await request.json();

    console.log(
      "Sending registration request to:",
      `${BACKEND_API_URL}/auth/register,`
    );

    const backendResponse = await fetch(
      `${BACKEND_API_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),

        cache: "no-store",
      },
    );

    const data = await backendResponse.json();

    console.log("Express registration response:", {
      status: backendResponse.status,
      success: data.success,
      message: data.message,
    });

    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("NEXT.JS REGISTER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to register user",
      },
      {
        status: 500,
      },
    );
  }
}