import { adminDB } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDB.collection("guests").get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      companyName,
    } = body;

    const snapshot = await adminDB
      .collection("guests")
      .where("phone", "==", phone)
      .get();

    if (!snapshot.empty) {
      return NextResponse.json(
        {
          message: "Nomor telepon sudah terdaftar",
        },
        {
          status: 409,
        }
      );
    }

    const guestRef = adminDB.collection("guests").doc();

    await guestRef.set({
      id: guestRef.id,
      fullName,
      email,
      phone,
      companyName,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        message: "Berhasil menambahkan guest",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}