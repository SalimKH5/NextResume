import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { requireSession } from "@/lib/apiAuth"


export async function GET() {
  try {
    const identity = await requireSession();
    if (identity instanceof NextResponse) return identity;

    const client = await clientPromise;
    const db = client.db();

    // Only the signed-in user's own profile can be read.
    const user = await db.collection("users").findOne({ email: identity.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, email: identity.email });
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const EDITABLE_FIELDS = [
  "gender",
  "firstName",
  "lastName",
  "address",
  "postalCode",
  "town",
  "country",
  "phoneNumber",
  "dateOfbirth",
] as const;

const MAX_FIELD_LENGTH = 200;

export async function POST(request: Request) {
  try {
    const identity = await requireSession();
    if (identity instanceof NextResponse) return identity;

    const body = await request.json();

    // Whitelist + type check: only known string fields are written.
    const updateFields: Record<string, string> = {};
    for (const field of EDITABLE_FIELDS) {
      const value = body?.[field];
      if (value === undefined) continue;
      if (typeof value !== "string" || value.length > MAX_FIELD_LENGTH) {
        return NextResponse.json({ error: `Invalid value for ${field}` }, { status: 422 });
      }
      updateFields[field] = value;
    }

    const client = await clientPromise;
    const db = client.db();

    // The profile updated is always the session user's, whatever email the body contains.
    const result = await db.collection("users").findOneAndUpdate(
      { email: identity.email },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: result.value }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
