import clientPromise from "@/lib/mongodb";
import { requireSession } from "@/lib/apiAuth";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// All handlers scope data to the signed-in user (session), not to a user_id
// sent by the client: a user can only create, read and update their own CVs.

export async function POST(request: NextRequest) {
  try {
    const identity = await requireSession();
    if (identity instanceof NextResponse) return identity;

    const body = await request.json();
    const { id_template, informations, title_template } = body;

    const client = await clientPromise;
    const db = client.db();

    // Use existing collection
    const collection = db.collection("templates_info");

    const result = await collection.insertOne({
      user_id: identity.userId,
      id_template,
      title_template,
      informations,
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "Insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}




export async function GET(request: NextRequest) {
  try {
    const identity = await requireSession();
    if (identity instanceof NextResponse) return identity;

    const url = new URL(request.url);
    const id_template = url.searchParams.get("id_template");

    if (id_template && !ObjectId.isValid(id_template)) {
      return NextResponse.json({ error: "Invalid id_template" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    let templates;

    if (id_template) {
      templates = await db.collection("templates_info").findOne({
        user_id: identity.userId,
        _id: new ObjectId(id_template),
      });
    } else {
      templates = await db
        .collection("templates_info")
        .find({ user_id: identity.userId })
        .toArray();
    }

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error("GET /api/templates error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const identity = await requireSession();
    if (identity instanceof NextResponse) return identity;

    const body = await request.json();
    const { id_template, informations, title_template } = body;

    if (!id_template || !ObjectId.isValid(id_template)) {
      return NextResponse.json(
        { error: "A valid id_template is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Update one template, only if it belongs to the session user
    const templates = await db.collection("templates_info").findOneAndUpdate(
      {
        _id: new ObjectId(id_template),
        user_id: identity.userId,
      },
      {
        $set: {
          informations: informations,
          title_template: title_template,
        },
      },
      { returnDocument: "after" } // return the updated document
    );

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/templates error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
