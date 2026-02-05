import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "./lib/session";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.isAdmin) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
