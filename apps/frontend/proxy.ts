import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "homematch_access_token";

type Role = "USER" | "AGENCY" | "ADMIN";

type JwtPayload = {
  role?: Role;
  exp?: number;
};

const protectedRoutes: Array<{
  prefix: string;
  role: Role;
  loginPath: string;
}> = [
  {
    prefix: "/agency",
    role: "AGENCY",
    loginPath: "/agency-access/login",
  },
  {
    prefix: "/account",
    role: "USER",
    loginPath: "/login",
  },
  {
    prefix: "/homematch/intranet",
    role: "ADMIN",
    loginPath: "/homematch/login",
  },
];

function matchesRoute(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const payload = token.split(".")[1];

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    return JSON.parse(atob(normalizedPayload)) as JwtPayload;
  } catch {
    return null;
  }
}

function redirectTo(pathname: string, request: NextRequest) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export function proxy(request: NextRequest) {
  if (process.env.AUTH_MIDDLEWARE_ENABLED === "false") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const route = protectedRoutes.find((item) =>
    matchesRoute(pathname, item.prefix),
  );

  if (!route) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return redirectTo(route.loginPath, request);
  }

  const payload = decodeJwtPayload(token);
  const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false;

  if (!payload || isExpired) {
    return redirectTo(route.loginPath, request);
  }

  if (payload.role !== route.role) {
    return redirectTo("/access-denied", request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/agency/:path*",
    "/account/:path*",
    "/homematch/intranet/:path*",
  ],
};
