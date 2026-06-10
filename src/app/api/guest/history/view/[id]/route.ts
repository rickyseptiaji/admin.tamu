import { adminDB } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const visitSnap = await adminDB
      .collection("visits")
      .doc(id)
      .get();

    if (!visitSnap.exists) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 }
      );
    }

    const data = visitSnap.data() as {
      employeeId?: string;
      description?: string;
      guestId?: string;
      checkIn?: Timestamp | null;
      checkOut?: Timestamp | null;
      duration?: number | null;
    };

    let employee = null;

    if (data.employeeId) {
      const employeeSnap = await adminDB
        .collection("employees")
        .doc(data.employeeId)
        .get();

      if (employeeSnap.exists) {
        employee = {
          id: employeeSnap.id,
          ...employeeSnap.data(),
        };
      }
    }

    let guest = null;

    if (data.guestId) {
      const guestSnap = await adminDB
        .collection("guests")
        .doc(data.guestId)
        .get();

      if (guestSnap.exists) {
        guest = {
          id: guestSnap.id,
          ...guestSnap.data(),
        };
      }
    }

    return NextResponse.json(
      {
        id: visitSnap.id,
        description: data.description ?? "",
        checkIn: data.checkIn ?? null,
        checkOut: data.checkOut ?? null,
        duration: data.duration ?? null,
        employee,
        guest,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching visit data:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}