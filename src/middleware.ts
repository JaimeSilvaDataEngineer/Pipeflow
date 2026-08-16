import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pipeflow_mock_session";
const DEFAULT_WORKSPACE_SLUG = "acme";
const AUTH_PATHS = ["/login", "/signup"];

// TODO(M7): substituir a checagem de cookie mock pela validação de sessão real do Supabase Auth.
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has(SESSION_COOKIE);
  const { pathname } = request.nextUrl;
  const isAuthPath = AUTH_PATHS.includes(pathname);

  if (isAuthPath) {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = `/${DEFAULT_WORKSPACE_SLUG}/dashboard`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/:workspace/dashboard/:path*",
    "/:workspace/leads/:path*",
    "/:workspace/pipeline/:path*",
    "/:workspace/settings/:path*",
  ],
};
