import { adminAuth, adminDB } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await adminAuth.createUser({
      email,
      password,
    });

    await adminDB.collection("users").doc(user.uid).set({
      userId: user.uid,
      email: user.email,
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