import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./AuthOption";

export type SessionIdentity = { userId: string; email: string };

/**
 * Resolves the signed-in user for an API route.
 * Identity always comes from the NextAuth session cookie, never from the request
 * body or query string, so a client cannot act on another user's data.
 */
export async function requireSession(): Promise<SessionIdentity | NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const email = session?.user?.email;
  if (!userId || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { userId: String(userId), email: String(email) };
}
