import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    if (!start || !end) {
      return new NextResponse(
        JSON.stringify({ error: "Missing start or end date" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const visitQuery = query(
      collection(db, "visits"),
      where("createdAt", ">=", startDate),
      where("createdAt", "<=", endDate),
      orderBy("createdAt", "desc")
    );

    const visitsSnapshot = await getDocs(visitQuery);

    const visits = visitsSnapshot.docs.map((v) => ({
      id: v.id,
      ...(v.data() as any),
    }));

    const guestsSnap = await getDocs(collection(db, "guests"));
    const result = guestsSnap.docs
      .filter((g) => visits.some((v) => v.guestId === g.id))
      .map((g) => {
        const data = g.data();

        const guestVisits = visits.filter((v) => v.guestId === g.id);
        const visitCount = guestVisits.length;

        const lastVisit = guestVisits[0]?.createdAt?.toDate() ?? null;

        let kategori = "Tidak ada kunjungan";
        if (visitCount >= 10) kategori = "Sering";
        else if (visitCount >= 5) kategori = "Sedang";
        else if (visitCount > 0) kategori = "Jarang";

        return {
          id: g.id,
          fullName: data.fullName,
          email: data.email,
          companyName: data.companyName,
          phone: data.phone,
          visitCount,
          lastVisit,
          kategori,
        };
      });

    return new NextResponse(JSON.stringify(result));
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
