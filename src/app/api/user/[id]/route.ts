import { adminAuth, adminDB } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await adminAuth.getUser(id);
    const snap = await adminDB.collection("users").doc(id).get();
    const userData = snap.exists ? snap.data() : null;

    return NextResponse.json(
      {
        auth: user,
        data: userData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { email, password, fullName, companyName, phone } = body;

    const updateAuthData: any = { email };

    if (password && password.trim() !== "") {
      updateAuthData.password = password;
    }

    await adminAuth.updateUser(id, updateAuthData);
    await adminDB.collection("users").doc(id).update({
      fullName,
      companyName,
      phone,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "User updated successfully" },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
