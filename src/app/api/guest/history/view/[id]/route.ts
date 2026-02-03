import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // visitId

    // 🔥 Ambil 1 visit berdasarkan document ID
    const visitRef = doc(db, "visits", id);
    const visitSnap = await getDoc(visitRef);

    if (!visitSnap.exists()) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 },
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

    // 👨‍💼 employee
    let employee = null;
    if (data.employeeId) {
      const employeeSnap = await getDoc(
        doc(db, "employees", data.employeeId),
      );
      if (employeeSnap.exists()) {
        employee = {
          id: employeeSnap.id,
          ...employeeSnap.data(),
        };
      }
    }

    // 🧑 guest
    let guest = null;
    if (data.guestId) {
      const guestSnap = await getDoc(
        doc(db, "guests", data.guestId),
      );
      if (guestSnap.exists()) {
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
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching visit data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
