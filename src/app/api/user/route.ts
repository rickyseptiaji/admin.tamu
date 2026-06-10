import { adminAuth, adminDB } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDB.collection("users").get();

    const data = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }))
      .filter((user) => user.role !== "admin");

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "failed fetch",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, fullName, companyName, phone } = body;

    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    await adminDB.collection("users").doc(userRecord.uid).set({
      id: userRecord.uid,
      fullName,
      companyName,
      phone,
      email,
      role: "user",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        message: "Berhasil",
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        {
          message: "Email sudah terdaftar",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
