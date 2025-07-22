import { db } from "@/lib/firebase";
import { collection, doc, getDocs, serverTimestamp, updateDoc } from "@firebase/firestore";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest
) {
  const url = req.nextUrl
  const id = url.pathname.split('/').pop() 
  try {
    const body = await req.json();
    console.log("Updating division with ID:", id, "Data:", body);
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

    const divisionRef = doc(db, "divisions", id);
    await updateDoc(divisionRef, {
      name,
      updatedAt: serverTimestamp(),
    });

    return new Response(
      JSON.stringify({ message: "Division updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating division:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update division" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req: NextRequest) {
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

export async function DELETE(
  req: NextRequest
) {
    const url = new URL(req.url);
    const divisionId = url.pathname.split("/").pop()
  try {
    const divisionRef = doc(db, "divisions", divisionId);
    await updateDoc(divisionRef, {
      deletedAt: serverTimestamp(),
    });

    return new Response(
      JSON.stringify({ message: "Division deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting division:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete division" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 
