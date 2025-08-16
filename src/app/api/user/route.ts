import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"


export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // La méthode findOne prend juste le filtre, pas d'objet set:
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Retourne l'utilisateur trouvé et l'email
    return NextResponse.json({ user, email });
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

type UserFields = {
  gender?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  postalCode?: string;
  town?: string;
  country?: string;
  phoneNumber?: string;
  dateOfbirth?: string;
};




export async function POST(request: Request) {
  try {
    const body = await request.json();
   
    const { email, gender, firstName, lastName, address, postalCode, town,country,phoneNumber,dateOfbirth} = body;
   

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    // Nettoyer les champs non définis
    const updateFields: Record<string, UserFields> = {};
    if (gender !== undefined) updateFields.gender = gender;
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (address !== undefined) updateFields.address = address;
    if (postalCode !== undefined) updateFields.postalCode = postalCode;
    if (town !== undefined) updateFields.town = town;
    if (country !== undefined) updateFields.country = country;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    if (dateOfbirth !== undefined) updateFields.dateOfbirth = dateOfbirth;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("users").findOneAndUpdate(
       { email: { $regex: `^${email}$`, $options: "i" } },
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