import { db } from "@/lib/firebase";
import { collection, doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { employeeId, description } = body;
    const newDocRef = doc(collection(db, "visits"));
    const visitId = newDocRef.id;
    await setDoc(newDocRef, {
      id: visitId,
      guestId: id,
      employeeId,
      description,
      checkIn: serverTimestamp(),
      checkOut: null,
      duration: null,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json(
      {
        message: "Berhasil menambahkan req guest",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
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
