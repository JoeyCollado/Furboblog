import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request); //reads cookie

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	return NextResponse.next(); //forward request to origin server
}

export const config = {
	matcher: ["/blog", "/create"], // Specify the routes the proxy applies to
};