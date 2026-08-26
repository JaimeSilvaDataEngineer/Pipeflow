import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isAuthPath = AUTH_PATHS.includes(pathname);

  if (isAuthPath) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/onboarding",
    "/:workspace/dashboard/:path*",
    "/:workspace/leads/:path*",
    "/:workspace/pipeline/:path*",
    "/:workspace/settings/:path*",
  ],
};
