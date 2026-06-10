import { adminDB } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const { employeeId, description } = body;

    const docRef = adminDB.collection("visits").doc();

    await docRef.set({
      id: docRef.id,
      userId: id,
      employeeId,
      description,
      checkIn: FieldValue.serverTimestamp(),
      checkOut: null,
      duration: null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        message: "Berhasil",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}