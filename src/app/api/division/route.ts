import { adminDB } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return Response.json(
        { message: "Division name is required" },
        { status: 400 }
      );
    }

    const docRef = await adminDB.collection("divisions").add({
      name,
      createdAt: FieldValue.serverTimestamp(),
      deletedAt: null,
    });

    await docRef.update({
      id: docRef.id,
    });

    return Response.json(
      {
        message: "Division created",
        id: docRef.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to create division",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("divisions")
      .where("deletedAt", "==", null)
      .get();

    const divisions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(divisions);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to fetch divisions",
      },
      { status: 500 }
    );
  }
}