import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, id_template, informations,title_template } = body;

    const client = await clientPromise;
    const db = client.db();

    // Use existing collection
    const collection = db.collection("templates_info");

    const result = await collection.insertOne({
      user_id,
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



export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");



    if (!user_id) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Find all templates for this user
    const templates = await db
      .collection("templates_info")
      .find({ user_id })
      .toArray();

    if (!templates.length) {
      return NextResponse.json(
        { error: "No templates found for this user" },
        { status: 404 }
      );
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