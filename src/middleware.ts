import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Protects all routes, except static files and Next.js internals.
     * You can edit this to only protect certain routes.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
