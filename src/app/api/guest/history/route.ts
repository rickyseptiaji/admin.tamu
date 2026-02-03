import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = query(collection(db, "visits"), where("guestId", "!=", null),);
    const visitSnapshot = await getDocs(q);
    const visitData = await Promise.all(
      visitSnapshot.docs.map(async (e) => {
        const data = e.data() as {
          employeeId?: string;
          description?: string;
          guestId?: string;
          checkIn?: Timestamp | null;
          checkOut?: Timestamp | null;
          duration?: number | null;
        };

        let employee = null;
        if (data.employeeId) {
          const employeeRef = doc(db, "employees", data.employeeId);
          const employeeSnap = await getDoc(employeeRef);
          if (employeeSnap.exists()) {
            employee = {
              id: employeeSnap.id,
              ...employeeSnap.data(),
            };
          }
        }

        let guest = null;
        if (data.guestId) {
          const guestRef = doc(db, "guests", data.guestId);
          const guestSnap = await getDoc(guestRef);
          if (guestSnap.exists()) {
            guest = {
              id: guestSnap.id,
              ...guestSnap.data(),
            };
          }
        }
        return {
          id: e.id,
          description: data.description,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          duration: data.duration,
          employee,
          guest,
        };
      })
    );
    return NextResponse.json(visitData, {
      status: 200,
    });
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
