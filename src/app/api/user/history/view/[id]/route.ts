import { db } from "@/lib/firebase";
import { doc, getDoc } from "@firebase/firestore";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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
      userId?: string;
      checkIn?: Timestamp | null;
      checkOut?: Timestamp | null;
      duration?: number | null;
    };


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


    let user = null;
    if (data.userId) {
      const userSnap = await getDoc(
        doc(db, "users", data.userId),
      );
      if (userSnap.exists()) {
        user = {
          id: userSnap.id,
          ...userSnap.data(),
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
        user,
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
