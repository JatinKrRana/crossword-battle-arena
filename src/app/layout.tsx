import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Crossword Battle Arena ",
  description: "Multiplayer Crossword Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* Navbar with login/logout */}
          <nav className="flex justify-between p-4 bg-gray-900 text-white">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl">Crossword Battle Arena</h1>
            
            <div>
              <SignedOut>
                <a href="/sign-in">Sign In</a>
                <a href="/sign-up" className="ml-4">Sign Up</a>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </nav>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
