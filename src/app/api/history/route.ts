import { db } from "@/lib/firebase";
import { collection, getDocs } from "@firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const visitSnapshot = await getDocs(collection(db, "visits"));
    const visit = visitSnapshot.docs
      .map((e) => {
        const data = e.data() as {
          employeeId?: string;
          description?: string;
          userId?: string;

        };
        return {
          id: e.id,
          employeeId: data.employeeId,
          description: data.description,
          userId: data.userId

        };
      })
    return new NextResponse(JSON.stringify(visit));
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
