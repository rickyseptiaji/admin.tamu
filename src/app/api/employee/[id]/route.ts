import { adminDB } from "@/lib/firebase-admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const docSnap = await adminDB
      .collection("employees")
      .doc(id)
      .get();

    if (!docSnap.exists) {
      return Response.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        id: docSnap.id,
        ...docSnap.data(),
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Failed to fetch employee",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();

    const allowedFields = [
      "fullName",
      "email",
      "phone",
      "address",
      "division",
    ];

    const updatedData: Record<string, any> = {
      updatedAt: new Date(),
    };

    for (const field of allowedFields) {
      if (body[field] != null) {
        updatedData[field] = body[field];
      }
    }

    await adminDB
      .collection("employees")
      .doc(id)
      .update(updatedData);

    return Response.json(
      {
        ok: true,
        message: "Employee updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: "Failed to update employee",
      },
      { status: 500 }
    );
  }
}
