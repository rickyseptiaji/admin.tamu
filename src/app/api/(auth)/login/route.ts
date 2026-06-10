import { adminAuth, adminDB } from "@/lib/firebase-admin";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const decodedToken = await adminAuth.verifyIdToken(token);

    const userDoc = await adminDB
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    if (userData?.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const res = NextResponse.json(
      {
        message: "Login successful",
      },
      {
        status: 200,
      }
    );

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}