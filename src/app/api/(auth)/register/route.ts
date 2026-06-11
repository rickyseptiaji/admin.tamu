import { adminAuth, adminDB } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
  const { uid, email } = await req.json();

    await adminDB.collection("users").doc(uid).set({
      userId: uid,
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "Register successful",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}