import { adminDB } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const docSnap = await adminDB
      .collection("guests")
      .doc(id)
      .get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: docSnap.id,
        ...docSnap.data(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();

    const {
      email,
      fullName,
      companyName,
      phone,
    } = body;

    const { id } = await params;

    await adminDB
      .collection("guests")
      .doc(id)
      .update({
        email,
        fullName,
        companyName,
        phone,
      });

    return NextResponse.json(
      {
        message: "Berhasil mengubah guest",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const batch = adminDB.batch();

    const visitsSnapshot = await adminDB
      .collection("visits")
      .where("guestId", "==", id)
      .get();

    visitsSnapshot.forEach((visitDoc) => {
      batch.delete(visitDoc.ref);
    });

    batch.delete(
      adminDB.collection("visitor_features").doc(id)
    );

    batch.delete(
      adminDB.collection("guests").doc(id)
    );

    await batch.commit();

    return NextResponse.json(
      {
        message: "Berhasil menghapus guest beserta relasinya",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}