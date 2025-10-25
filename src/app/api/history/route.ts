import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { NextResponse } from "next/server";
function formatDate(timestamp: any): string {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}
export async function GET() {
  try {
    const visitSnapshot = await getDocs(collection(db, "visits"));
    const visitData = await Promise.all(
      visitSnapshot.docs.map(async (e) => {
        const data = e.data() as {
          employeeId?: string;
          description?: string;
          userId?: string;
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
          createdAt: formatDate(data.createdAt),
          employee,
          user,
        };
      })
    );
    return new NextResponse(JSON.stringify(visitData));
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
