import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export async function POST(req: Request) {
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
      deletedAt: null,
    });

    await updateDoc(docRef, { id: docRef.id });
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
    const divisionsQuery = query(
      collection(db, "divisions"),
      where("deletedAt", "==", null)
    );
    const divisionsSnapshot = await getDocs(divisionsQuery);
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
