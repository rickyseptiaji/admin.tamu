import { db } from "@/lib/firebase";
import { collection, getDocs } from "@firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const guestsSnapshot = await getDocs(collection(db, "guests"));
    const guest = guestsSnapshot.docs.map((doc) => {
      const data = doc.data() as {
        fullName?: string;
        email?: string;
        companyName?: string;
        phone?: string;
        visitCount?: string
      };
      return {
        id: doc.id,
        fullName: data.fullName,
        email: data.email,
        companyName: data.companyName,
        phone: data.phone,
        visitCount: data.visitCount
      };
    });
    return new NextResponse(JSON.stringify(guest))
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
