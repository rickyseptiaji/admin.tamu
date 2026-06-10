import { adminDB } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const visitSnapshot = await adminDB
      .collection("visits")
      .where("guestId", "!=", null)
      .get();

    const visitData = await Promise.all(
      visitSnapshot.docs.map(async (visitDoc) => {
        const data = visitDoc.data() as {
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

        return {
          id: visitDoc.id,
          description: data.description ?? null,
          checkIn: data.checkIn ?? null,
          checkOut: data.checkOut ?? null,
          duration: data.duration ?? null,
          employee,
          guest,
        };
      })
    );

    return NextResponse.json(visitData, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching guest visits:", error);

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