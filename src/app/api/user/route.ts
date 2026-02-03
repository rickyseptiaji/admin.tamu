import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs
      .map((q) => ({
        id: q.id,
        ...(q.data() as any),
      }))
      .filter((user) => user.role != "admin");
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, companyName, phone } = body;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      fullName,
      companyName,
      phone,
      email,
      role: "user",
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({
      message: "Berhasil",
    }, {
      status: 201
    });
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
