import { adminDB } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return new Response(
        JSON.stringify({ message: "Division name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await adminDB.collection("divisions").doc(id).update({
      name,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return new Response(
      JSON.stringify({ message: "Division updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to update division" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const docSnap = await adminDB.collection("divisions").doc(id).get();

  if (!docSnap.exists) {
    return Response.json({ message: "Division not found" }, { status: 404 });
  }

  return Response.json({
    id: docSnap.id,
    ...docSnap.data(),
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await adminDB.collection("divisions").doc(id).update({
    deletedAt: FieldValue.serverTimestamp(),
  });

  return Response.json(
    { message: "Division deleted successfully" },
    { status: 200 },
  );
}
