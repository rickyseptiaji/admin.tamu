import { adminDB } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const visitSnapshot = await adminDB
      .collection("visits")
      .where("userId", "!=", null)
      .get();

    const visitData = await Promise.all(
      visitSnapshot.docs.map(async (visitDoc) => {
        const data = visitDoc.data();

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

        let user = null;

        if (data.userId) {
          const userSnap = await adminDB
            .collection("users")
            .doc(data.userId)
            .get();

          if (userSnap.exists) {
            user = {
              id: userSnap.id,
              ...userSnap.data(),
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
          user,
        };
      })
    );

    return NextResponse.json(visitData, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching visits:", error);

    return NextResponse.json(
      {
        error: "failed fetch data",
      },
      {
        status: 500,
      }
    );
  }
}