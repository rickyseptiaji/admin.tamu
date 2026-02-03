import { formatDate } from "@/hooks/formatDate";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = query(collection(db, "visits"), where("userId", "!=", null));
    const visitSnapshot = await getDocs(q);
    const visitData = await Promise.all(
      visitSnapshot.docs.map(async (e) => {
        const data = e.data() as {
          employeeId?: string;
          description?: string;
          userId?: string;
          checkIn?: any;
          checkOut?: any;
          duration?: any;
          createdAt?: any;
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

        let user = null;
        if (data.userId) {
          const userRef = doc(db, "users", data.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            user = {
              id: userSnap.id,
              ...userSnap.data(),
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
          user,
        };
      }),
    );
    return new NextResponse(JSON.stringify(visitData), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
