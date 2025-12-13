import { db } from "@/lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const docRef = doc(db, "employees", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ message: "Employee not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ id: docSnap.id, ...docSnap.data() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch employee" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const allowedFields = ["fullName", "email", "phone", "address", "division"];
    const updatedData: Record<string, any> = {
      updatedAt: new Date(),
    };

    for (const field of allowedFields) {
      if (body[field] != null) {
        updatedData[field] = body[field];
      }
    }

    const employeeRef = doc(db, "employees", id);
    await updateDoc(employeeRef, updatedData);

    return new Response(
      JSON.stringify({ ok: true, message: "Employee updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, message: "Failed to update employee" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
