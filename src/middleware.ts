import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "./lib/session";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.username) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Specific path protection for non-admins
        const adminOnlyPaths = ["/dashboard/users", "/dashboard/setting"];
        const currentPath = request.nextUrl.pathname;

        if (session.role !== 'admin' && adminOnlyPaths.some(path => currentPath.startsWith(path))) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
