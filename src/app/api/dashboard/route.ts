import { adminDB } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const to = searchParams.get("to")
      ? new Date(searchParams.get("to")!)
      : new Date();

    const from = searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : new Date(new Date().setDate(to.getDate() - 90));

    const snapshot = await adminDB
      .collection("visits")
      .where("createdAt", ">=", Timestamp.fromDate(from))
      .where("createdAt", "<=", Timestamp.fromDate(to))
      .orderBy("createdAt", "asc")
      .get();

    const map = new Map<string, number>();

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (!data.createdAt) return;

      const date = data.createdAt
        .toDate()
        .toISOString()
        .slice(0, 10);

      map.set(date, (map.get(date) ?? 0) + 1);
    });

    const result = Array.from(map.entries()).map(
      ([date, total]) => ({
        createdAt: date,
        total,
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch chart data",
      },
      {
        status: 500,
      }
    );
  }
}