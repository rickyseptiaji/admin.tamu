import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export async function PUT(request: Request, { params }: any) {
  try {
    const id = params.id;

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return new Response(
        JSON.stringify({ message: "Division name is required" }),
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
    return new Response(
      JSON.stringify({message: "Failed to update division" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const docRef = doc(db, "divisions", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ message: "Divisions not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ id: docSnap.id, ...docSnap.data() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch divisions" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request: Request, { params }: any) {
  const id = params.id;

  const divisionRef = doc(db, "divisions", id);
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
}
