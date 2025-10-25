import { db } from "@/lib/firebase";
import { collection, getDocs } from "@firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userSnapshot = await getDocs(collection(db, "users"));
    const user = userSnapshot.docs.map((e) => {
      const data = e.data() as {
        fullName?: string;
        email?: string;
        companyName?: string;
        phone?: string;
      };
      return {
        id: e.id,
        fullName: data.fullName,
        email: data.email,
        companyName: data.companyName,
        phone: data.companyName,
      };
    });
    return new NextResponse(JSON.stringify(user));
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
