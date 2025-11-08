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

    const userSnapshot = await getDocs(collection(db, "users"));
    const users = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    })).filter((user) => user.role != "admin");

    const visitQuery = query(
      collection(db, "visits"),
      where("createdAt", ">=", startDate),
      where("createdAt", "<=", endDate),
      orderBy("createdAt", "desc")
    );
    const visitSnapshot = await getDocs(visitQuery);
    const visits = visitSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    const result = users.map((user) => {
      const userVisits = visits.filter((v) => v.userId === user.id);
      const visitCount = userVisits.length;

      let lastVisit = null;
      if (visitCount > 0) {
        lastVisit = userVisits[0].createdAt.toDate
          ? userVisits[0].createdAt.toDate()
          : userVisits[0].createdAt;
      }

      let kategori = "Tidak ada kunjungan";
      if (visitCount >= 10) kategori = "Sering";
      else if (visitCount >= 5) kategori = "Sedang";
      else if (visitCount > 0) kategori = "Jarang";

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        phone: user.phone,
        role: user.role,
        visitCount,
        lastVisit,
        kategori,
      };
    });
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
