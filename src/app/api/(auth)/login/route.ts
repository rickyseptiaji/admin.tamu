import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const userData = userDocSnap.data();
    if (userData.role !== "admin") {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized access" }),
        { status: 403 }
      );
    }
    const userToken = await userCredential.user.getIdToken();
    const res = new NextResponse(
      JSON.stringify({ ok: true, message: "Login successful" }),
      {
        status: 200,
      }
    );
    res.cookies.set("auth_token", userToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ ok: false, error: "Login failed, please try again" }),
      { status: 500 }
    );
  }
}
