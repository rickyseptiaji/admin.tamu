import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    await setDoc(doc(db, "users", user.uid), {
      userId: user.uid,
      email: user.email,
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Register successful",
      },
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Registration failed, please try again",
      }),
      { status: 500 }
    );
  }
}
