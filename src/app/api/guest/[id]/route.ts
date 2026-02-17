import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const docRef = doc(db, "guests", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        id: docSnap.id,
        ...docSnap.data(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { email, fullName, companyName, phone } = body;
    const { id } = await params;
    await updateDoc(doc(db, "guests", id), {
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
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const batch = writeBatch(db);

    const visitsQuery = query(
      collection(db, "visits"),
      where("guestId", "==", id),
    );

    const visitsSnapshot = await getDocs(visitsQuery);

    visitsSnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    const visitorFeatureRef = doc(db, "visitor_features", id);
    batch.delete(visitorFeatureRef);

    const guestRef = doc(db, "guests", id);
    batch.delete(guestRef);
    await batch.commit();

    return NextResponse.json(
      { message: "Berhasil menghapus guest beserta relasinya" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
