import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
