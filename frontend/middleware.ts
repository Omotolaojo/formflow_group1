import {
  NextRequest,
  NextResponse,
} from "next/server";

export function middleware(
  request: NextRequest
) {
  const { pathname } =
    request.nextUrl;

  const token =
    request.cookies.get(
      "token"
    )?.value;

  const isDashboardRoute =
    pathname.startsWith(
      "/dashboard"
    );

  /**
   * Protect dashboard routes.
   */
  if (
    isDashboardRoute &&
    !token
  ) {
    const loginUrl =
      new URL(
        "/login",
        request.url
      );

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  /**
   * If authenticated user
   * visits login page,
   * send them to dashboard.
   */
  if (
    pathname === "/login" &&
    token
  ) {
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
  ],
};