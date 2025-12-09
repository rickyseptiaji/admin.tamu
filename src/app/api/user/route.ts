import { db } from "@/lib/firebase";
import { collection, getDocs } from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs
      .map((q) => ({
        id: q.id,
        ...(q.data() as any),
      }))
      .filter((user) => user.role != "admin");
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
