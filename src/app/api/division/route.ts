import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return new Response(
        JSON.stringify({ error: "Division name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const docRef = await addDoc(collection(db, "divisions"), {
      name,
      createdAt: serverTimestamp(),
    });

    return new Response(
      JSON.stringify({ message: "Division created", id: docRef.id }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating division:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create division" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}



 export async function GET() {
  try {
    const divisionsSnapshot = await getDocs(collection(db, "divisions"));
    const divisions = divisionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(divisions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch divisions" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
